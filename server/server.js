const express = require("express");
const app = express();
const db = 'mongodb+srv://maxnbf:1Q9rE7GMgdUEdebH@cluster0.o2zvb.mongodb.net/premdatabase?retryWrites=true&w=majority'
const port = process.env.PORT || 5000;
const appRoute = require("./api/app.route");
const schedule = require('node-schedule');
const mongoose  = require("mongoose");
const request = require('request');

require("dotenv").config()


const cors = require("cors");
const LiveTable = require("./models/LiveTableModel");
const Ranking = require("./models/RankingModel");
const RankingService = require("./services/RankingService");
const AutomatedService = require("./services/AutomatedService");
const User = require("./models/UserModel");

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

const def =  ['Arsenal', 'Aston Villa', 'Brentford', 'Brighton', 'Burnley', 'Chelsea', 'Crystal Palace', 'Everton', 'Leeds', 'Leicester', 'Liverpool', 'Manchester City', 'Manchester United', 'Newcastle United', 'Norwich', 'Southampton', 'Tottenham', 'Watford', 'West Ham', 'Wolverhampton Wanderers'];

// // perform action at 6pm EST 11pm UTC every day
// const job = schedule.scheduleJob(rule, async function(){
//     //gets all instances of LiveTable model, returns an array with either 
//     ///no items (server starting for first time that season) or with one item
//     // (the live ranking currently)
//     AutomatedService.updateLiveTable()

//     console.log('HELLO')
    
// });

/*
  THIS DOES EVERY MINUTE DURNG THE HOUR, just want once on the hour

*/

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


// const job = schedule.scheduleJob("05 * * * * *", async function(){
//   console.log('JOB DONE')
//   let i; 
//   for (i = 4; i < 100; i++) {
//     let name = `testuser${i}`
//     let r = Math.floor(Math.random() * 20)


//     let user = await User.create({name: name, username: name, password: name})
//     let def2 = def;
//     shuffle(def2)
//     await RankingService.makeRanking(user._id, name, def2, def[r])
//   }
//   console.log('JOB REALLY DONE')
// });