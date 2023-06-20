const mongoose = require('mongoose')

const Schema = mongoose.Schema

const question_userPerms = new Schema( {
    owner: {
        type: String,
        required: [true, 'Question is missing owner']
    },
    contributingUsers: {
        type: [String]
    },
    contributingGroups: {
        type: [String]
    }
})

const questionSchema = new Schema( {

    id: {
        type: Number,
        required: [true, 'Missing ID!']
    },
    question: {
        type: String,
        required: [true, 'Missing question!']
    },
    
    // Question filters

    category: {
        type: [String],
        required: [true, 'Missing category!']
    },
    topic: {
        type: [String],
        required: [true, 'Missing topic data!']
    },
    subtopic: {
        type: [String]
    },
    difficulty: {
        type: [String],
        required: [true, 'Missing difficulty!']
    },
    sourceName: {
        type: [String],
        uppercase: true
    },
    sourceYear: {
        type: Number,
        min: 1800
    },
    // Question filters: tags
    tags: {
        type: [String]
    },

    // Images
    images: [String],

    // Solution and Images

    solution: {
        type: String
    },
    solutionImages: [String],

    // User permission and modification data

    lastModified: {
        type: Date
    },
    userPerms: {
        type: question_userPerms
    }
}
)

module.exports = {
    questionSchema: questionSchema
}

