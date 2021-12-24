const mongoose = require('mongoose');


const RankingSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    ranking: {
        type: Array,
        required: true
    },
    points: {
        type: Array,
        required: true
    },
    total_points: {
        type: Number,
        required: true
    }
}, { autoCreate: true})

const Ranking = mongoose.model('Ranking', RankingSchema);

module.exports = Ranking
