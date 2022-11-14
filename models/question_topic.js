const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const topicData = new Schema( {
    topic: {
        type: [String],
        enum: ['Algebra', 'Combinatorics', 'Geometry', 'Number Theory', 'Others'],
        required: [true, 'Missing topic!']
    },
    subTopic: {
        type: String,
        lowercase: true
    },
    subSubTopic: {
        type: String,
        lowercase: true
    },
})

module.exports = mongoose.model("topics", topicData);