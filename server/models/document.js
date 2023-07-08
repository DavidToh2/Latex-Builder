const mongoose = require('mongoose')

const Schema = mongoose.Schema

const TemplateSchema = new Schema( {
    templateName: String,
    documentClass: {
        type: String,
        required: true
    },
    packages: {
        type: [String],
        required: true
    },
    setup: {
        type: String,
        required: true
    }
})
const Title = new Schema( {
    title: {
        type: String
    },
    author: {
        type: String
    },
    date: {
        type: String
    }
})
const DocumentSchema = new Schema( {

    name: String,

    preamble: {
        type: TemplateSchema,
        required: true
    },
    title: {
        type: Title,
        required: true
    },
    body: {
        type: String
    }
})

module.exports = { 
    TemplateSchema: TemplateSchema,
    DocumentSchema: DocumentSchema
}