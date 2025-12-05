import express from "express";
import cors from "cors";
import { connectDb } from "./database";
import authenticatedRoutes from "./middleware/authenticated-routes.middleware";
import authRoutes from "./routes/authRoutes";
import { LiveTable } from "./models/liveTableModel";
import { UserRanking } from "./models/userRankingModel";
import { TeamLogos } from "./models/teamLogosModel";
import { updatePointsService } from "./services/rankingService";
import {
  assignFavoriteTeamRankService,
  assignFriendRankService,
  assignOverallRankService,
  assignTopLevelStatsService,
} from "./services/rankSnapshotService";
import { privacyHtml } from "./privacyPolicy";
import { support } from "./support";
import {
  sendPushNotificationsToAllUsers,
} from "./services/pushNotificationService";
import { calculatePointsForWeek, resetAllUserPoints } from "./jobs/awardPoints";
import { scrapeFixtures } from "./scraping/fixtures"
import { scrapeResults } from "./scraping/results"
import { runPreMatchGameweekNotificationJob } from "./jobs/preGameWeekNotifs"
import { scrapeStandings } from "./scraping/standings"

const app = express();

app.use(cors());
app.use(express.json());

connectDb()
  .then(() => {
    console.log("Connected to MongoDB instance");
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

app.use("/auth", authRoutes);
app.use("/api", authenticatedRoutes);
app.get("/privacy", (req, res) => {
  res.send(privacyHtml);
});
app.get("/support", (req, res) => {
  res.send(support);
});

const PORT = 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port: ${PORT}`);
});
app.get("/", (req, res) => {
  res.send("Hello from League Lock");
});


const ONE_SECOND_IN_MILLIS = 1000;
const ONE_MINUTE_IN_MILLIS = 60 * ONE_SECOND_IN_MILLIS;
const ONE_HOUR_IN_MILLIS = 60 * ONE_MINUTE_IN_MILLIS;

const hardCodedLogos: Map<string, string> = new Map([
  [
    "Watford FC",
    "https://image-service.onefootball.com/transform?w=128&dpr=2&image=https://images.onefootball.com/icons/teams/164/580.png",
  ],
  [
    "Queens Park Rangers",
    "https://image-service.onefootball.com/transform?w=128&dpr=2&image=https://images.onefootball.com/icons/teams/164/582.png",
  ],
]);

async function runScheduledTask() {
   await calculatePointsForWeek('14');
  try {
    const { table, srcUrls } = await scrapeStandings();
    const { gameWeek, isWeekComplete } = await scrapeResults();
    await scrapeFixtures(parseInt(gameWeek) + 1);

    // Read existing LiveTable document before updating
    const existingLiveTable = await LiveTable.findOne({
      currentRound: gameWeek,
    });
    const previousIsWeekComplete = existingLiveTable?.isWeekComplete ?? false;

    // Once new live week starts, clear the points.
    if (!existingLiveTable) {
      console.log("New week beginning");
      await resetAllUserPoints();
    }

    await LiveTable.findOneAndUpdate(
      { currentRound: gameWeek },
      {
        ranking: table,
        season: process.env.SEASON,
        currentRound: parseInt(gameWeek),
        lastUpdated: new Date().getTime(),
        isWeekComplete: isWeekComplete,
      },
      { new: true, upsert: true }
    );

    // If week just completed (changed from false to true), trigger push notifications
    if (!previousIsWeekComplete && isWeekComplete) {
      console.log(
        `Game week ${gameWeek} just completed, triggering push notifications`
      );
      await calculatePointsForWeek(gameWeek);
      await sendPushNotificationsToAllUsers(gameWeek);
    }

    runPreMatchGameweekNotificationJob(parseInt(gameWeek) + 1);

    const teamLogosMap = new Map<string, string>();
    table.forEach((teamName, index) => {
      if (srcUrls[index]) {
        teamLogosMap.set(teamName, srcUrls[index]);
      }
    });

    const mergedLogosMap = new Map([...teamLogosMap, ...hardCodedLogos]);

    await TeamLogos.findOneAndUpdate(
      {},
      { logos: mergedLogosMap },
      { new: true, upsert: true }
    );

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
    }
  }

  setTimeout(runScheduledTask, 5 * ONE_MINUTE_IN_MILLIS);
}

runScheduledTask();
