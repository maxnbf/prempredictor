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

const def =  ['Arsenal', 'Aston Villa', 'Brentford', 'Brighton', 'Burnley', 'Chelsea', 'Crystal Palace', 'Everton', 'Leeds', 'Leicester', 'Liverpool', 'Manchester City', 'Manchester United', 'Newcastle', 'Norwich', 'Southampton', 'Tottenham', 'Watford', 'West Ham', 'Wolverhampton Wanderers'];

// perform action at 6pm EST 11pm UTC every day
const job = schedule.scheduleJob(rule, async function(){

    //gets all instances of LiveTable model, returns an array with either 
    ///no items (server starting for first time that season) or with one item
    // (the live ranking currently)
    const live = await LiveTable.find().exec()
    if (live.length === 0) {
        LiveTable.create({table: def})
    } else {

        const options = {
          method: 'GET',
          url: 'https://heisenbug-premier-league-live-scores-v1.p.rapidapi.com/api/premierleague/table',
          headers: {
            'x-rapidapi-host': 'heisenbug-premier-league-live-scores-v1.p.rapidapi.com',
            'x-rapidapi-key': '1c57e02111msh788bcae97a8aa2bp1fe287jsnb14f5e2f0780',
            useQueryString: true
          }
        };
  

        request(options, function (error, response, body) {
          if (error) throw new Error(error);
        
           let r = JSON.parse(body)
           r = r["records"]
           let live_ranking = []
           r.map((team) => live_ranking.push(team.team))

           console.log('LIVE_RANKING', live_ranking)
           live[0].table = live_ranking
           live[0].save()
        });
    }

    //updates and saves points for each ranking
    const usersRankings = await Ranking.find().exec()
    usersRankings.map(ranking => RankingService.updatePoints(ranking, def))

    
});



