import express from "express";
import cors from "cors";
import { connectDb } from "./database";
import authenticatedRoutes from "./middleware/authenticated-routes.middleware"
import authRoutes from "./routes/authRoutes"
import axios from "axios";
import cheerio from "cheerio"
import { LiveTable } from "./models/liveTableModel";
import { UserRanking } from "./models/userRankingModel";
import { TeamLogos } from "./models/teamLogosModel";
import { updatePointsService } from "./services/rankingService";
import { assignFavoriteTeamRankService, assignFriendRankService, assignOverallRankService, assignTopLevelStatsService } from "./services/rankSnapshotService";

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

const PORT = 8080;
app.listen(PORT, '0.0.0.0', () => {console.log(`Server is running on port: ${PORT}`)})

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

        console.log(table, srcUrls)
        return { table, srcUrls } ;
    } catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

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

async function scrapeFixtures(): Promise<{ gameWeek: string, isWeekComplete: boolean, isGamesToday: boolean}> {
    const url = "https://onefootball.com/en/competition/premier-league-9/results"
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data)

        const gameWeek = $($("[class*='SectionHeader_subtitle']")[0]).text().trim().split(" ")[1]
        
        const matchCardList = $("[class*='MatchCardsList_matches']").first();
        const infoMessages = matchCardList.find("[class*='SimpleMatchCard_simpleMatchCard']");

        const isWeekComplete = infoMessages
            .map((_, el) => $(el).text().trim())
            .get()
            .filter(text => text.includes('Full time')).length > 0;
        
        // TODO: narrow this down to check if there are unplayed games today. Even further, find the times.
        const isGamesToday = infoMessages
            .map((_, el) => $(el).text().trim())
            .get()
            .filter(text => text.includes("Today")).length > 0

        console.log(gameWeek, isWeekComplete, isGamesToday)
        return { isWeekComplete, gameWeek, isGamesToday}

    } catch (error) {
        console.log(`Error: ${error}`);
        throw error;
    }
}


//https://www.api-football.com/documentation-v3#tag/Fixtures/operation/get-fixtures
// can use get /fixture/rounds to get the dates of each round. then based on the dates i can know what round im in, track
// current round in the data base. and use that to update points. can use /fixtures?round=X to get fixtures for a round and when
// theyre all compelte, trigger the async process to update everyones score for that week. 
// async function getStandingsApi() {
//     const axios = require('axios');

//     const apiKey = process.env.API_KEY;

//     // Define the API endpoint URL for Premier League standings
//     //const apiUrl = 'https://v3.football.api-sports.io/standings?league=39&season=2022';
//     const apiUrl = 'https://v3.football.api-sports.io/fixtures?league=39&season=2022';

//     // Set up the API request headers
//     const headers = {
//         'x-apisports-key': apiKey,
//         'Accept': 'application/json',
//     };

//     try {
//         const response = await axios.get(apiUrl, { headers });
//         //console.log("Standing RES", response.data.response[0].league.standings[0].map(team => team.team));console.log("Standing RES", response.data.response[0].league.standings[0].map(team => team.team));
//         console.log("Fixture RES", response.data.response[100]);
//     } catch (error) {
//         console.error('Error fetching standings:', error);
//     }
// }

const ONE_SECOND_IN_MILLIS = 1000
const ONE_MINUTE_IN_MILLIS = 60 * ONE_SECOND_IN_MILLIS
const ONE_HOUR_IN_MILLIS = 60 * ONE_MINUTE_IN_MILLIS

let currentInterval = ONE_HOUR_IN_MILLIS
async function runScheduledTask() {
    try {
        const { table, srcUrls } = await scrapeStandings();
        const { gameWeek, isWeekComplete, isGamesToday } = await scrapeFixtures();
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

        const teamLogosMap = new Map<string, string>();
        table.forEach((teamName, index) => {
            if (srcUrls[index]) {
                teamLogosMap.set(teamName, srcUrls[index]);
            }
        });

        await TeamLogos.findOneAndUpdate(
            { },
            { logos: teamLogosMap },
            { new: true, upsert: true }
        );

        // If games being played today, update every 5 minutes
        if (isGamesToday) {
            currentInterval = 5 * ONE_MINUTE_IN_MILLIS
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
    
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Scheduled task error: ${error.message}`);
            currentInterval = 60 * 1000;
        }
    }

    setTimeout(runScheduledTask, currentInterval);
}

runScheduledTask();