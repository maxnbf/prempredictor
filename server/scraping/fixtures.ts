import axios from "axios";
import cheerio from "cheerio";
import { Fixture } from "../models/fantasy/fixtureModel"
/**
 * Gameweek of fixtures I want to grab
 * @param gameWeek
 */
export async function scrapeFixtures(gameWeek: number) {
  const url =
    "https://onefootball.com/en/competition/premier-league-9/fixtures";

  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const gameWeekFromSite = $($("[class*='SectionHeader_subtitle']")[0])
    .text()
    .trim()
    .split(" ")[1];
  let matchCardListToGrab = 0;
  if (parseInt(gameWeekFromSite) < gameWeek) {
    matchCardListToGrab = 1;
  }

  const matches: any[] = [];

  const matchCardList = $("[class*='MatchCardsList_matches']").eq(
    matchCardListToGrab
  );
  matchCardList.find("li a[class*='MatchCard_matchCard']").each((_, el) => {
    const match = $(el);

    const home = match
      .find(".SimpleMatchCardTeam_simpleMatchCardTeam__name__7Ud8D")
      .first()
      .text()
      .trim();
    const away = match
      .find(".SimpleMatchCardTeam_simpleMatchCardTeam__name__7Ud8D")
      .last()
      .text()
      .trim();

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

  if (gameWeekFromSite != gameWeek.toString()) {
    console.log(
      `gameWeekFromSite ${gameWeekFromSite} differs from gameWeek ${gameWeek}`
    );
  }

  if (existingFixtures.length > 0) {
    console.log(`Gameweek ${gameWeek} fixtures already stored.`);
    return matches.some((match) => isSameDate(match.dateTime));
  }

  if (matches.length === 0) {
    console.log("No fixtures scraped — cannot create fallback fixtures.");
    return;
  }

  const shuffled = matches.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);

  console.log("No fixtures found in DB → creating 3 random fixtures");

  await Promise.all(
    selected.map((m) =>
      Fixture.create({
        homeTeam: m.homeTeam,
        awayTeam: m.awayTeam,
        dateTime: m.dateTime,
        week: gameWeek,
      })
    )
  );

  return matches.some((match) => isSameDate(match.dateTime));
}

function isSameDate(dateString: string): boolean {
  const input = new Date(dateString);
  const now = new Date();

  return (
    input.getUTCFullYear() === now.getUTCFullYear() &&
    input.getUTCMonth() === now.getUTCMonth() &&
    input.getUTCDate() === now.getUTCDate()
  );
}