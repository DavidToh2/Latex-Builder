const mongoose = require('mongoose')
const { userPerms } = require('./user')

const Schema = mongoose.Schema
 
const questionSchema = new Schema( {

    id: {
        type: String,
        required: [true, 'Missing ID!']
    },
    question: {
        type: String,
        required: [true, 'Missing question!']
    },
    
    // Question filters

    category: {
        type: [String],
        required: [true, 'Missing category!'],
        validate: [arrayNonEmpty, 'Missing category data!']
    },
    topic: {
        type: [String],
        required: [true, 'Missing topic!'],
        validate: [arrayNonEmpty, 'Missing topic data!']
    },
    subtopic: {
        type: [String],
        required: [true, 'Missing subtopic!'],
    },
    difficulty: {
        type: [String]
    },
    sourceName: {
        type: [String]
    },
    sourceYear: {
        type: Number,
        min: [1800, 'Source year must be after 1800!']
    },
    // Question filters: tags
    tags: [String],

    // Images
    images: [String],

    // Solution and Images

    solution: [String],
    solutionImages: [[String]],

    // User permission and modification data

    lastModified: Number,
    userPerms: {
        type: userPerms,
        required: true
    }
}
)

const latexSchema = new Schema( {
    id: String,
    text: String
})
const latexHeadingSchema = new Schema( {
    id: String,
    type: {
        type: String,
        enum: ['section', 'subsection', 'subsubsection'],
        required: true
    },
    text: String
})
const latexEnumSchema = new Schema( {
    id: String,
    behaviour: {
        type: String,
        enum: ['start', 'end'],
        required: true
    },
    type: {
        type: String,
        enum: ['numeric', 'alphabetic', 'roman', 'bullet', 'dash']
    },
    template: String,
    options: String
})
const qnRefSchema = new Schema( {
    id: String,
    displayOptions: [String]
})

const worksheetElementSchema = new Schema( {
    type: {
        type: String,
        enum: ['qn', 'latex', 'latexHeading', 'latexEnum']
    },
    qn: qnRefSchema,
    latex: latexSchema,
    latexHeading: latexHeadingSchema,
    latexEnum: latexEnumSchema
})

function arrayNonEmpty(arr) {
    return (arr.length > 0)
}

module.exports = {
    questionSchema: questionSchema,
    worksheetElementSchema: worksheetElementSchema
}

