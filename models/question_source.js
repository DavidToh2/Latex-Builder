const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sourceData = new Schema( {
    sourceName: {
        type: String,
        uppercase: true
    },
    sourceYear: {
        type: Number,
        min: 1800
    }

})

module.exports = mongoose.model("sources", sourceData);