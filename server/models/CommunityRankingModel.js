const mongoose = require('mongoose');

const TeamPoints = new mongoose.Schema({
    team: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    }
}, { autoCreate: true})

const CommunityRanking = new mongoose.Schema({
    table: {
        type: [TeamPoints],
        required: true
    }, 

}, { autoCreate: true})

const CommunityRanking = mongoose.model('CommunityRanking', CommunityRanking);

module.exports = CommunityRanking
