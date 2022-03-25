const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }, 
    favorite_team: {
        type: String,
        required: false
    }
}, { autoCreate: true})

const User = mongoose.model('User', UserSchema);

module.exports = User
