const { MongoClient } = require("mongodb");
// const Db = process.env.ATLAS_URI;
const Db = 'mongodb+srv://maxnbf:1Q9rE7GMgdUEdebH@cluster0.o2zvb.mongodb.net/premdatabase?retryWrites=true&w=majority'
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
 
var _db;
 
module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      // Verify we got a good "db" object
      if (db)
      {
        _db = db.db("premdatabase");
        console.log("Successfully connected to MongoDB."); 
      }
      return callback(err);
         });
  },
 
  getDb: function () {
    return _db;
  },
};