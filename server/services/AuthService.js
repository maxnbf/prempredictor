const User = require('../models/UserModel.js');


class AuthService {
    static async signup(username, password, name){
        return await User.create({name:name, username:username, password:password});
    }

    static async signin(username, password){
        const user = await User.findOne({username: username});

        if (!(await user.comparePassword(password))) {
            console.log('ERROR wrong password');
            return;
        }
        return user.createJwt();
    }
}

module.exports = AuthService