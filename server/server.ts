// Main server file for League Lock - a fantasy football prediction app
// This server handles API routes, scheduled data scraping, and real-time updates

// Import external libraries:
// - express: Web framework for Node.js (handles HTTP requests/responses)
// - cors: Allows cross-origin requests (so web/mobile apps can talk to this server)
import express from "express";
import cors from "cors";

// Import our own modules:
// - Database connection function
import { connectDb } from "./database";
// - Middleware that checks if users are logged in before accessing certain routes
import authenticatedRoutes from "./middleware/authenticated-routes.middleware";
// - Routes for authentication (login, register, etc.)
import authRoutes from "./routes/authRoutes";

// Database models (represent data structures in MongoDB):
// - LiveTable: Current league standings
import { LiveTable } from "./models/liveTableModel";
// - UserRanking: User's prediction table and points
import { UserRanking } from "./models/userRankingModel";
// - TeamLogos: URLs for team logos
import { TeamLogos } from "./models/teamLogosModel";

// Services for business logic:
// - Ranking calculations and point updates
import { updatePointsService } from "./services/rankingService";
import {
  assignFavoriteTeamRankService,
  assignFriendRankService,
  assignOverallRankService,
  assignTopLevelStatsService,
} from "./services/rankSnapshotService";

// Static content:
// - Privacy policy HTML
import { privacyHtml } from "./privacyPolicy";
// - Support page HTML
import { support } from "./support";

// Notification services:
// - Send push notifications to users
import {
  sendPushNotificationsToAllUsers,
  sendPushNotificationToUser,
} from "./services/pushNotificationService";

// Background jobs:
// - Calculate weekly points and reset points at start of new week
import { calculatePointsForWeek, resetAllUserPoints } from "./jobs/awardPoints";

// Web scraping functions (get live data from football websites):
import { scrapeFixtures } from "./scraping/fixtures"
import { scrapeResults } from "./scraping/results"
import { runPreMatchGameweekNotificationJob } from "./jobs/preGameWeekNotifs"
import { scrapeStandings } from "./scraping/standings"

// Create the main Express application object
// This is like the "brain" of our server - it handles all incoming requests
const app = express();

// Set up middleware (functions that run on every request):
// - cors(): Allows web browsers and mobile apps to make requests to this server
// - express.json(): Parses incoming JSON data from requests into JavaScript objects
app.use(cors());
app.use(express.json());

// Connect to the database (MongoDB)
// This is asynchronous - it returns a Promise
// If connection succeeds, log success message
// If it fails, log the error and exit the program (can't run without database)
connectDb()
  .then(() => {
    console.log("Connected to MongoDB instance");
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

// Set up API routes (URL endpoints that the app can respond to):
// - /auth/* : Authentication routes (login, register, logout) - no login required
app.use("/auth", authRoutes);
// - /api/* : Protected routes that require user to be logged in first
app.use("/api", authenticatedRoutes);

// Static pages (simple HTML pages that don't need authentication):
// - /privacy : Shows the privacy policy
app.get("/privacy", (req, res) => {
  res.send(privacyHtml);
});
// - /support : Shows the support/contact page
app.get("/support", (req, res) => {
  res.send(support);
});

// Start the server:
// - PORT 8080: The network port the server will listen on
// - "0.0.0.0": Listen on all network interfaces (not just localhost)
// - Callback function runs when server successfully starts
const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port: ${PORT}`);
});

// Basic health check route:
// - / : Root URL - just returns a simple welcome message
// - Useful for checking if the server is running
app.get("/", (req, res) => {
  res.send("Hello from League Lock");
});

// ==========================================
// SCHEDULED TASKS (CORE BUSINESS LOGIC)
// ==========================================

// Time constants (used for scheduling):
// - Convert between different time units for the scheduled task timing
const ONE_SECOND_IN_MILLIS = 1000;
const ONE_MINUTE_IN_MILLIS = 60 * ONE_SECOND_IN_MILLIS;
const ONE_HOUR_IN_MILLIS = 60 * ONE_MINUTE_IN_MILLIS;

// Fallback team logos:
// - Some teams might not have logos available from web scraping
// - This Map provides hardcoded logo URLs for specific teams
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

// MAIN SCHEDULED TASK - This runs every 5 minutes to keep the app updated with live football data
// This is the "heart" of the app - it scrapes live data and updates everything automatically
async function runScheduledTask() {
  try {
    // STEP 1: Scrape live data from football websites
    // - scrapeStandings(): Gets current league table and team logo URLs
    // - scrapeResults(): Gets current game week number and whether the week is complete
    // - scrapeFixtures(): Gets upcoming fixtures for next game week
    const { table, srcUrls } = await scrapeStandings();
    const { gameWeek, isWeekComplete } = await scrapeResults();
    await scrapeFixtures(parseInt(gameWeek) + 1);

    // STEP 2: Check if this is a new game week
    // - Read existing LiveTable document from database to see what we had before
    // - Check if the week completion status changed (important for notifications)
    const existingLiveTable = await LiveTable.findOne({
      currentRound: gameWeek,
    });
    const previousIsWeekComplete = existingLiveTable?.isWeekComplete ?? false;

    // If this is the first time we've seen this game week (new week started):
    // - Reset all user points back to 0 for the new week
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
