import axios from "axios";
import cheerio from "cheerio"
import { updateFixtureScores } from "../jobs/updateFixtures"
/**
 * Scrapes the results page to determine the game week being played, if the week is complete, and if there are games today
 * @returns
 */
export async function scrapeResults(): Promise<{
  gameWeek: string;
  isWeekComplete: boolean;
  isGamesToday: boolean;
}> {
  const url = "https://onefootball.com/en/competition/premier-league-9/results";
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const gameWeek = $($("[class*='SectionHeader_subtitle']")[0])
      .text()
      .trim()
      .split(" ")[1];

    const matchCardList = $("[class*='MatchCardsList_matches']").first();
    const infoMessages = matchCardList.find("[class*='MatchCard_matchCard']");

    const isWeekComplete =
      infoMessages
        .map((_, el) => {
          return $(el).text().trim();
        })
        .get()
        .filter((text) => text.includes("Full time")).length ==
      infoMessages.length;

    updateFixtureScores(
      infoMessages.map((_, el) => $(el).text().trim()).get(),
      gameWeek
    );

    // TODO: narrow this down to check if there are unplayed games today. Even further, find the times.
    const isGamesToday =
      infoMessages
        .map((_, el) => $(el).text().trim())
        .get()
        .filter((text) => text.includes("Today") || text.includes("Tomorrow"))
        .length > 0;

    console.log(gameWeek, isWeekComplete, isGamesToday);
    return {
      isWeekComplete,
      gameWeek,
      isGamesToday: isGamesToday && !isWeekComplete,
    };
  } catch (error) {
    console.log(`Error: ${error}`);
    throw error;
  }
}