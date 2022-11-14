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

const questionSchema = new Schema( {
    hash: {
        type: Number,
        unique: true,
        min: 0,
        max: 99999999,
        required: [true, 'Missing hash!']
    },
    question: {
        type: String,
        required: [true, 'Missing question!']
    },
    topicData: {
        type: topicData,
        required: [true, 'Missing topic data!']
    },

    difficulty: {
        type: String,
        enum: ['Primary', 'Junior (A)', 'Junior (B)', 'Junior (C)', 'Senior', 'Open', 'National', 'Unknown'],
        required: [true, 'Missing difficulty!']
    },
    images: [String],

    solution: {
        type: String
    },
    solutionImages: [String],
    sourceData: {
        type: sourceData
    }
})

module.exports = {
    topicData: topicData,
    sourceData: sourceData,
    questionSchema: questionSchema
}

