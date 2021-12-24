const express = require("express");
const app = express();
const db = 'mongodb+srv://maxnbf:1Q9rE7GMgdUEdebH@cluster0.o2zvb.mongodb.net/premdatabase?retryWrites=true&w=majority'
const port = process.env.PORT || 5000;
const appRoute = require("./api/app.route");
const schedule = require('node-schedule');
const mongoose  = require("mongoose");
require("dotenv").config()


const cors = require("cors");
const LiveTable = require("./models/LiveTableModel");
const Ranking = require("./models/RankingModel");
const { map } = require("./routes/RankingRoutes");
const RankingService = require("./services/RankingService");


app.use(cors());


app.use(
  express.urlencoded({ extended: true })
);
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, token"
  );
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
  next();
});



//DB Config

mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
})

//API endpoints
app.use("/api", appRoute);


//Listener
app.listen(port, () => {
  // perform a database connection when server starts

  console.log(`Server is running on port: ${port}`);
});


const rule = new schedule.RecurrenceRule();
rule.hour = 23;
rule.tz = 'Etc/UTC';

let i = 0;

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

const def =  ['Arsenal', 'Aston Villa', 'Brentford', 'Brighton and Hove Albion', 'Burnley', 'Chelsea', 'Crystal Palace', 'Everton', 'Leeds', 'Leicester', 'Liverpool', 'Manchester City', 'Manchester United', 'Newcastle', 'Norwich', 'Southampton', 'Tottenham Hotspurs', 'Watford', 'West Ham', 'Wolves'];
// const job = schedule.scheduleJob('20 * * * * *', async function(){
//     //write the livetable to the database
//     const live = await LiveTable.find().exec()
//     if (live.length === 0) {
//         LiveTable.create({table: def})
//     } else {
//         live[0].table = shuffle(def)
//         live[0].save()
//     }

//     //updates and saves points for each ranking
//     const usersRankings = await Ranking.find().exec()
//     usersRankings.map(ranking => RankingService.updatePoints(ranking, def))
// });



// perform action at 6pm EST 11pm UTC every day
// const job = schedule.scheduleJob(rule, function(){
//   console.log('A new day has begun in the UTC timezone!');
// });