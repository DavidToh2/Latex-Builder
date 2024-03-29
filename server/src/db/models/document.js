const mongoose = require('mongoose')
// const { userPerms } = require('./user')
// const { worksheetElementSchema } = require('./question')

const Schema = mongoose.Schema

const Title = new Schema( {
    title: String, 
    author: String,
    date: String
})

const PageDimensions = new Schema( {
    top: String,
    left: String,
    bottom: String,
    right: String
})
const PageMarginSettings = new Schema( {
    left: String,
    middle: String,
    right: String,
    thickness: String
})
const PageNumberSettings = new Schema( {
    display: "header" | "footer" | "none",
    position: "LORE" | "middle" | "ROLE"
})
const Page = new Schema( {
    dimensions: PageDimensions,
    header: PageMarginSettings,
    footer: PageMarginSettings,
    pageNumber: PageNumberSettings
})

const Text = new Schema( {
    paragraphIndent: String,
    paragraphSpacing: String
})

const TemplateSchema = new Schema( {
    templateName: String,
    templateDescription: String,
    documentClass: {
        type: String,
        required: true
    },
    packages: [String],
    setup: String,
    page: Page,
    text: Text,
    preamble: String
})

// const DocumentSchema = new Schema( {
//     documentID: {
//         type: String,
//         required: true
//     },
//     documentName: {
//         type: String,
//         required: true
//     },
//     template: String,
//     title: {
//         type: Title,
//         required: true
//     },
//     packages: [String],
//     setup: String,
//     page: Page,
//     body: {
//         type: [worksheetElementSchema],
//         required: true
//     },
//     userPerms: {
//         type: userPerms,
//         required: true
//     }
// })

module.exports = { 
    TemplateSchema: TemplateSchema
}