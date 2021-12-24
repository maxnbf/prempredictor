const jwt = require("jsonwebtoken");
const Ranking = require("../models/RankingModel.js");
const User = require('../models/UserModel.js');

class AuthService {
    static async signup(username, password, name){
        return await User.create({name, username, password})
    }

    static async signin(username, password) {
        const user = await User.findOne({username: username}).exec();
        if (user) {
            if (user.password === password) {
                let token = this.createJwt(user)
                return token

            } else {
                console.log('error?')
                return new Error('user not found')
            }
        }
        
        return new Error('wrong password')
        
   
    }

    static async createJwt(user) {
        const token = await jwt.sign(
            { _id: user._id, username: user.username },
            'F3A9ADFEB65702D5E9536E2ACA22572DF144C9069ED167C07150C1F122F9D847',
            { algorithm: "HS256" },
            { expiresIn: "10d" }
        );


        return {token, user}
    }
}

module.exports = AuthService