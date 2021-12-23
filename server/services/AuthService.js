const User = require('../models/UserModel.js');
const dbo = require("../db/conn");


class AuthService {

    static async signup(username, password, name){


        let conn = dbo.getDb();

        let myobj = {
            name: name,
            username: username,
            password: password,
        };

        // conn.collection("userclasses").insertOne(myobj, function (err, res) {
        //     if (err) throw err;
        //     console.log(res)
        // });
        return await User.create({name, username, password});
    }

    static async signin(username, password){
        let conn = dbo.getDb();
        //conn.collection("userclasses").findOne({username:username}, function (err, res) {
        //  console.log(res)
        //});

        const user = await User.findOne({username: username}).exec();
        
        console.log("USER", user)

        if (user.password === password) {
            return user;
        } else {
            console.log('error')
        }
   
    }
}

module.exports = AuthService