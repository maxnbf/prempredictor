import cheerio from "cheerio";
import axios from "axios";

export async function scrapeStandings(): Promise<{
  table: string[];
  srcUrls: string[];
}> {
  const url = "https://onefootball.com/en/competition/premier-league-9/table";
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const table: string[] = [];

    $("[class*='standings__teamName']").each((index, element) => {
      table.push($(element).text().trim());
    });

    const logos = $("[class*='EntityLogo_entityLogoImage']");
    const srcUrls = logos.map((_, el) => $(el).attr("src")).get();

    return { table, srcUrls };
  } catch (error) {
    console.error(`Error: ${error}`);
    throw error;
  }
}

// This is used at the beginning of each season to gather all the teams?
// async function scrapeAllStandings() {
//     const url = "https://www.transfermarkt.us/premier-league/spieltag/wettbewerb/GB1/plus/?saison_id=2024&spieltag="

//     for (let i = 1; i <= 31; i++) {
//         const { data } = await axios.get(url + i);
//         const $ = cheerio.load(data);

//         const table = [];
//         $("[class*='no-border-links hauptlink']").each((index, element) => {
//             table.push($(element).text().trim());
//         });

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