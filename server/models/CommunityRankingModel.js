const mongoose = require('mongoose');

const TeamPoints = new mongoose.Schema({
    team: {
        type: String,
        required: true
    },
    ranking: {
        type: Number,
        required: true
    }
}, { autoCreate: true})

const CommunityRankingSchema = new mongoose.Schema({
    teams: {
        type: [TeamPoints],
        required: true
    },
    num_rankings: {
        type: Number,
        required: true
    } 
}, { autoCreate: true})

const CommunityRanking = mongoose.model('CommunityRanking', CommunityRankingSchema);

module.exports = CommunityRanking
