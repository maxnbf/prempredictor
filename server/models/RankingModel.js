const mongoose = require('mongoose');


const RankingSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    ranking: {
        type: Array,
        required: true
    }
}, { autoCreate: true})

const Ranking = mongoose.model('Ranking', RankingSchema);

module.exports = Ranking
