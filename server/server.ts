import express from "express";
import cors from "cors";
import { connectDb } from "./database";
import authenticatedRoutes from "./middleware/authenticated-routes.middleware"
import authRoutes from "./routes/authRoutes"
import axios from "axios";
import cheerio from "cheerio"

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

const PORT = 9000;
app.listen(PORT, () => {console.log(`Server is running on port: ${PORT}`)})


// Function to scrape the web page
async function scrapeStandings() {
    const url = "https://onefootball.com/en/competition/premier-league-9/table";
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const table = [];

        $("[class*='standings__teamName']").each((index, element) => {
            table.push($(element).text().trim());
        });

        return table;
    } catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

// Define a route to manually trigger the script and return the result
app.get('/run-script', async (req, res) => {
    try {
        const standings = await scrapeStandings();
        res.json(standings);
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

// Schedule the task to run every 10 seconds using setInterval
// setInterval(async () => {
//     try {
//         const standings = await scrapeStandings();
//         console.log(`Scraped standings: ${JSON.stringify(standings, null, 2)}`);
//         // Handle the result (e.g., save to a database or a file)
//     } catch (error) {
//         console.error(`Scheduled task error: ${error.message}`);
//     }
// }, 10000);  // 10 seconds