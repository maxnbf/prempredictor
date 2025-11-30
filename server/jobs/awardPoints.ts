import { Fixture } from "../models/fantasy/fixtureModel";
import { FixturePrediction } from "../models/fantasy/fixturePredictionModel";
import { UserPoints } from "../models/fantasy/userPointsModel";

export async function calculatePointsForWeek(week: string) {
  // 1. Get all fixtures for the week
  const fixtures = await Fixture.find({ week });

  if (!fixtures.length) {
    console.log(`No fixtures found for week ${week}`);
    return;
  }

  const fixtureIds = fixtures.map((f) => f._id);

  // 2. Get all predictions for these fixtures
  const predictions = await FixturePrediction.find({
    fixture: { $in: fixtureIds },
  });

  // 3. Calculate points for each prediction
  const userPointsMap: Record<string, number> = {}; // username -> points earned this week

  predictions.forEach((pred) => {
    const fixture = fixtures.find((f) => pred.fixture == f._id);
    if (!fixture) return;

    const actualHome = fixture.homeScore;
    const actualAway = fixture.awayScore;

    // Skip if fixture scores are not yet available
    if (actualHome === undefined || actualAway === undefined) return;

    const predictedHome = pred.homeScore;
    const predictedAway = pred.awayScore;

    let points = 0;

    // Exact score
    if (predictedHome === actualHome && predictedAway === actualAway) {
      points = 3;
    } else {
      // Correct result (winner/draw)
      const actualResult =
        actualHome > actualAway
          ? "HOME"
          : actualHome < actualAway
          ? "AWAY"
          : "DRAW";
      const predictedResult =
        predictedHome > predictedAway
          ? "HOME"
          : predictedHome < predictedAway
          ? "AWAY"
          : "DRAW";

      if (actualResult === predictedResult) {
        points = 1;
      }
    }

    if (points > 0) {
      if (!userPointsMap[pred.username]) {
        userPointsMap[pred.username] = 0;
      }
      userPointsMap[pred.username] += points;
    }
  });

  // 4. Update user points in the database
  for (const username of Object.keys(userPointsMap)) {
    await UserPoints.findOneAndUpdate(
      { username },
      { $inc: { points: userPointsMap[username] } },
      { upsert: true, new: true }
    );
  }

  console.log(`Points calculated and updated for week ${week}`);
}

export async function resetAllUserPoints() {
  try {
    // Update all documents in the UserPoints collection
    const result = await UserPoints.updateMany({}, { $set: { points: 0 } });
    console.log(`Successfully reset points for ${result.modifiedCount} users.`);
  } catch (error) {
    console.error("Error resetting user points:", error);
    throw error;
  }
}