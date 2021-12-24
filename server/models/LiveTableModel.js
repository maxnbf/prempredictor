const mongoose = require('mongoose');


const LiveTableSchema = new mongoose.Schema({
    table: {
        type: Array,
        required: true
    }
}, { autoCreate: true})

const LiveTable = mongoose.model('LiveTable', LiveTableSchema);

module.exports = LiveTable
