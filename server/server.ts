import express from "express";
import cors from "cors";
import { connectDb } from "./database";
import authenticatedRoutes from "./middleware/authenticated-routes.middleware"
import authRoutes from "./routes/authRoutes"
import axios from "axios";
import cheerio, { Cheerio } from "cheerio"
import { LiveTable } from "./models/liveTableModel";
import { UserRanking } from "./models/userRankingModel";
import { Fixture } from "./models/fantasy/fixtureModel";
import { TeamLogos } from "./models/teamLogosModel";
import { updatePointsService } from "./services/rankingService";
import { assignFavoriteTeamRankService, assignFriendRankService, assignOverallRankService, assignTopLevelStatsService } from "./services/rankSnapshotService";
import { privacyHtml } from "./privacyPolicy";
import { support } from "./support";
import { sendPushNotificationsToAllUsers } from "./services/pushNotificationService";
import { calculatePointsForWeek, resetAllUserPoints } from "./jobs/awardPoints"
const app = express();

app.use(cors())
app.use(express.json());

connectDb()
  .then(() => {
    console.log("Connected to MongoDB instance");
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
});

app.use("/auth", authRoutes)
app.use("/api", authenticatedRoutes)
app.get('/privacy', (req, res) => {
 res.send(privacyHtml)
})
app.get('/support', (req, res) => {
    res.send(support)
})
  
const PORT = 8080;
app.listen(PORT, '0.0.0.0', () => { console.log(`Server is running on port: ${PORT}`);})
app.get("/", (req, res) => {
    res.send("Hello from League Lock")
})

// Function to scrape the web page
async function scrapeStandings(): Promise<{ table: string[], srcUrls: string[] }> {
    const url = "https://onefootball.com/en/competition/premier-league-9/table";
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const table: string[] = [];

        $("[class*='standings__teamName']").each((index, element) => {
            table.push($(element).text().trim());
        });

        const logos = $("[class*='EntityLogo_entityLogoImage']")
        const srcUrls = logos.map((_, el) => $(el).attr('src')).get();

        return { table, srcUrls } ;
    } catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

// This is used at the beginning of each season
// async function scrapeAllStandings() {
//     const url = "https://www.transfermarkt.us/premier-league/spieltag/wettbewerb/GB1/plus/?saison_id=2024&spieltag="

//     for (let i = 1; i <= 31; i++) {
//         const { data } = await axios.get(url + i);
//         const $ = cheerio.load(data);

//         const table = [];
//         $("[class*='no-border-links hauptlink']").each((index, element) => {
//             table.push($(element).text().trim());
//         });

//         console.log(table, i)
    
        
//         await LiveTable.findOneAndUpdate(
//             { currentRound: i },
//             {
//                 ranking: table.map(team => shortNameToFullName[team]),
//                 season: process.env.SEASON,
//                 currentRound: i,
//                 lastUpdated: new Date().getTime(),
//                 isWeekComplete: true
//                 // TODO: isWeekComplete and use this on register to determine which week they started
//             },
//             { new: true, upsert: true }
//         );
//     }
// }

function isSameDate(dateString: string): boolean {
  const input = new Date(dateString);
  const now = new Date();

  return (
    input.getUTCFullYear() === now.getUTCFullYear() &&
    input.getUTCMonth() === now.getUTCMonth() &&
    input.getUTCDate() === now.getUTCDate()
  );
}

/**
 * Gameweek of fixtures I want to grab
 * @param gameWeek 
 */
async function scrapeFixtures(gameWeek) {
    const url = "https://onefootball.com/en/competition/premier-league-9/fixtures"

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const gameWeekFromSite = $($("[class*='SectionHeader_subtitle']")[0]).text().trim().split(" ")[1]
    let matchCardListToGrab = 0;
    if (gameWeekFromSite < gameWeek) {
        matchCardListToGrab = 1
    }

    const matches: any[] = [];

    const matchCardList = $("[class*='MatchCardsList_matches']").eq(matchCardListToGrab);
    matchCardList.find("li a[class*='MatchCard_matchCard']").each((_, el) => {
        const match = $(el);

        const home = match.find(".SimpleMatchCardTeam_simpleMatchCardTeam__name__7Ud8D").first().text().trim();
        const away = match.find(".SimpleMatchCardTeam_simpleMatchCardTeam__name__7Ud8D").last().text().trim();

        // Extract schedule
        const dateTimeEl = match.find("time").first();
        const isoDate = dateTimeEl.attr("datetime") || null; // full ISO 8601 timestamp
        const humanTime = match.find("time").last().text().trim(); // e.g "10:00"

        matches.push({
            homeTeam: home,
            awayTeam: away,
            dateTime: isoDate,
            time: humanTime,
        });
    });

    const existingFixtures = await Fixture.find({ week: gameWeek });

    if (gameWeekFromSite != gameWeek) {
        console.log(`gameWeekFromSite ${gameWeekFromSite} differs from gameWeek ${gameWeek}`)
    }

    if (existingFixtures.length > 0) {
        console.log(`Gameweek ${gameWeek} fixtures already stored.`);
        return matches.some(match => isSameDate(match.dateTime))
    }

    if (matches.length === 0) {
        console.log("No fixtures scraped — cannot create fallback fixtures.");
        return;
    }

    const shuffled = matches.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    console.log("No fixtures found in DB → creating 3 random fixtures");

    await Promise.all(
        selected.map(m =>
            Fixture.create({
                homeTeam: m.homeTeam,
                awayTeam: m.awayTeam,
                dateTime: m.dateTime,
                week: gameWeek
            })
        )
    );

    return matches.some(match => isSameDate(match.dateTime))

}

interface MatchResult {
  homeTeam: string;
  homeScore: number;
  awayTeam: string;
  awayScore: number;
}

async function updateFixtureScores(elements: string[], gameWeek: string) {
    const matches: MatchResult[] = elements
  .filter((text) => text.includes("Full time"))
  .map((text) => {
    // Remove "TodayFull time" / "YesterdayFull time" at the end
    const cleanText = text.replace(/(Today|Yesterday)Full time$/, "");

    // Match the pattern: HomeTeamScoreAwayTeamScore
    // This assumes scores are always numbers
    const match = cleanText.match(/^(.+?)(\d+)(.+?)(\d+)$/);

    if (!match) {
      console.warn("Could not parse:", text);
      return null;
    }

    const [, homeTeam, homeScore, awayTeam, awayScore] = match;

    return {
      homeTeam: homeTeam.trim(),
      homeScore: parseInt(homeScore, 10),
      awayTeam: awayTeam.trim(),
      awayScore: parseInt(awayScore, 10),
    } as MatchResult;
  })
  .filter(Boolean) as MatchResult[];

    for (const match of matches) {
    // Find the fixture by homeTeam, awayTeam and week
    const fixture = await Fixture.findOne({
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      week: gameWeek,
    });

    if (!fixture) {
      continue;
    }

    // Update the scores
    fixture.homeScore = match.homeScore;
    fixture.awayScore = match.awayScore;

    await fixture.save();
  }
    
}

/**
 * Scrapes the results page to determine the game week being played, if the week is complete, and if there are games today
 * @returns 
 */
async function scrapeResults(): Promise<{ gameWeek: string, isWeekComplete: boolean, isGamesToday: boolean}> {
    const url = "https://onefootball.com/en/competition/premier-league-9/results"
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data)

        const gameWeek = $($("[class*='SectionHeader_subtitle']")[0]).text().trim().split(" ")[1]
        
        const matchCardList = $("[class*='MatchCardsList_matches']").first();
        const infoMessages = matchCardList.find("[class*='MatchCard_matchCard']");

        const isWeekComplete = infoMessages
            .map((_, el) => {
                return $(el).text().trim()
            })
            .get()
            .filter(text => text.includes('Full time')).length == infoMessages.length;
        
        updateFixtureScores(infoMessages.map((_, el) =>$(el).text().trim()).get(), gameWeek)
        
        // TODO: narrow this down to check if there are unplayed games today. Even further, find the times.
        const isGamesToday = infoMessages
            .map((_, el) => $(el).text().trim())
            .get()
            .filter(text => text.includes("Today") || text.includes("Tomorrow")).length > 0

        console.log(gameWeek, isWeekComplete, isGamesToday)
        return { isWeekComplete, gameWeek, isGamesToday: isGamesToday && !isWeekComplete}

    } catch (error) {
        console.log(`Error: ${error}`);
        throw error;
    }
}


const ONE_SECOND_IN_MILLIS = 1000
const ONE_MINUTE_IN_MILLIS = 60 * ONE_SECOND_IN_MILLIS
const ONE_HOUR_IN_MILLIS = 60 * ONE_MINUTE_IN_MILLIS

let currentInterval = ONE_HOUR_IN_MILLIS

const hardCodedLogos: Map<string, string> = new Map([
    ["Watford FC", "https://image-service.onefootball.com/transform?w=128&dpr=2&image=https://images.onefootball.com/icons/teams/164/580.png"],
    ["Queens Park Rangers", "https://image-service.onefootball.com/transform?w=128&dpr=2&image=https://images.onefootball.com/icons/teams/164/582.png"]
]);

async function runScheduledTask() {
    try {
        const { table, srcUrls } = await scrapeStandings();
        const { gameWeek, isWeekComplete, isGamesToday } = await scrapeResults();
        const isGamesTodayFixtures = await scrapeFixtures(parseInt(gameWeek) + 1)

        // Read existing LiveTable document before updating
        const existingLiveTable = await LiveTable.findOne({ currentRound: gameWeek });
        const previousIsWeekComplete = existingLiveTable?.isWeekComplete ?? false;
        
        // Once new live week starts, clear the points. 
        if (!existingLiveTable) {
            console.log("New week beginning")
            await resetAllUserPoints()
        }

        await LiveTable.findOneAndUpdate(
            { currentRound: gameWeek },
            {
                ranking: table,
                season: process.env.SEASON,
                currentRound: parseInt(gameWeek),
                lastUpdated: new Date().getTime(),
                isWeekComplete: isWeekComplete
            },
            { new: true, upsert: true }
        );
        
        // If week just completed (changed from false to true), trigger push notifications
        if (!previousIsWeekComplete && isWeekComplete) {
            console.log(`Game week ${gameWeek} just completed, triggering push notifications`);
            await calculatePointsForWeek(gameWeek)
            await sendPushNotificationsToAllUsers(gameWeek);
        }

        const teamLogosMap = new Map<string, string>();
        table.forEach((teamName, index) => {
            if (srcUrls[index]) {
                teamLogosMap.set(teamName, srcUrls[index]);
            }
        });

        const mergedLogosMap = new Map([
            ...teamLogosMap,
            ...hardCodedLogos
        ]);

        await TeamLogos.findOneAndUpdate(
            { },
            { logos: mergedLogosMap },
            { new: true, upsert: true }
        );

        // If games being played today, update every 5 minutes
        if (isGamesToday || isGamesTodayFixtures) {
            currentInterval = 5 * ONE_MINUTE_IN_MILLIS
        } else {
            currentInterval = 6 * ONE_HOUR_IN_MILLIS;
            console.log('No games today, querying again in six hours')
        }
 
        // Dispatch async updates for total points for each user
        // This is used for leaderboards. Viewing individual tables is done in the client, since its super small computationally
        const userRankings = await UserRanking.find({});
        await Promise.all(
            userRankings.map(async (userRanking) => {
                try {
                    await updatePointsService(userRanking, table); 
                } catch (err) {
                    console.error(`Failed to update user ${userRanking.username}:`, err);
                }
            })
        );

        await assignOverallRankService();
        await assignFavoriteTeamRankService();
        await assignFriendRankService();
        await assignTopLevelStatsService();
    
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Scheduled task error: ${error.message}`);
            currentInterval = ONE_MINUTE_IN_MILLIS;
        }
    }

    setTimeout(runScheduledTask, currentInterval);
}

runScheduledTask();