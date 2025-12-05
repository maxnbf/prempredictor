import { Fixture } from "../models/fantasy/fixtureModel"
import { UserPoints } from "../models/fantasy/userPointsModel"
import { sendPushNotificationToUser } from "../services/pushNotificationService"

export async function runPreMatchGameweekNotificationJob(gameWeek: number) {
  console.log(`Running pre-match notification job for gameweek ${gameWeek}`);

  // 1. Fetch all fixtures for the given gameweek
  const fixtures = await Fixture.find({ week: gameWeek });

  if (fixtures.length === 0) {
    console.log(`No fixtures found for gameweek ${gameWeek}`);
    return;
  }

  // 2. Ensure ALL fixtures have notified = false before sending anything
  const alreadyNotified = fixtures.every((fix) => fix.notified === true);

  if (alreadyNotified) {
    console.log(`Gameweek ${gameWeek} has already been notified.`);
    return;
  }

  // 3. Find the EARLIEST fixture time
  const earliestFixture = fixtures.reduce((earliest, current) => {
    return new Date(current.dateTime) < new Date(earliest.dateTime)
      ? current
      : earliest;
  });

  const earliestTime = new Date(earliestFixture.dateTime);
  const nowUtc = new Date();
  const diffMs = earliestTime.getTime() - nowUtc.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  console.log(`Earliest fixture begins in ${diffHours.toFixed(2)} hours`);

  // 4. Only notify if the earliest fixture is within 24 hours
  if (diffHours > 24) {
    console.log(
      `Gameweek ${gameWeek} is not within 24 hours — no notifications sent.`
    );
    return;
  }

  // 5. Get all users who have points > 0
  const usersWithPoints = await UserPoints.find({ points: { $gt: 0 } });

  if (usersWithPoints.length === 0) {
    console.log("No users with points > 0 — skipping push notifications.");
    return;
  }

  // Reuse your existing Expo function
  console.log(`Sending notifications to ${usersWithPoints.length} users...`);

  await Promise.all(
    usersWithPoints.map((userPoint) =>
      sendPushNotificationToUser(
        userPoint.username,
        `Gameweek ${gameWeek} kicks off soon!`,
        `Your first match starts in less than 24 hours. Finalize your picks!`,
        { gameWeek }
      )
    )
  );

  // 6. Mark all fixtures for this gameweek as notified
  await Fixture.updateMany({ week: gameWeek }, { $set: { notified: true } });

  console.log(
    `Gameweek ${gameWeek} pre-match notifications sent and fixtures updated.`
  );
}
