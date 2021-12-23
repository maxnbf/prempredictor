const express = require("express");
const app = express();
const db = 'mongodb+srv://maxnbf:1Q9rE7GMgdUEdebH@cluster0.o2zvb.mongodb.net/premdatabase?retryWrites=true&w=majority'
const port = process.env.PORT || 5000;
const appRoute = require("./api/app.route");
const mongoose  = require("mongoose");
require("dotenv").config()


const cors = require("cors");


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