import { Fixture } from "../models/fantasy/fixtureModel"

interface MatchResult {
  homeTeam: string;
  homeScore: number;
  awayTeam: string;
  awayScore: number;
}

export async function updateFixtureScores(elements: string[], gameWeek: string) {
  const matches: MatchResult[] = elements
    .map((text) => {
      // Match the pattern: TeamNameDigitTeamNameDigit...
      const match = text.match(/^([\w .&]+?)(\d)([\w .&]+?)(\d).*$/);

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
