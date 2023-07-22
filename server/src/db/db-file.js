const { mongoose } = require('./db-connection')
const { TemplateSchema, DocumentSchema } = require('./models/document')

const { UserError, DatabaseError, newError, ServerError } = require('../express-classes/error')
const initTemplates = require('./init/initTemplates.json')

const templateDB = mongoose.connection.useDb('templates', { useCache: true })
// const documentDB = mongoose.connection.useDb('documents', { useCache: true })

const DocumentTemplates = templateDB.model('templates', TemplateSchema)

initTemplates.forEach((template, index) => {
    DocumentTemplates.findOneAndUpdate({ templateName: template.templateName }, template, { upsert: true })
    .then((insertedTemplate) => {
        console.log("Inserted a template!")
    })
    .catch((error) => {
        console.log("Error initialising templates:")
        console.log(error)
    })
})
    

async function addTemplate(data) {

    const errorString = "Failed to add new document template!"
    try {
        const t = await DocumentTemplates.insertMany([data])
        return t
    } catch(err) {
        newError(err, errorString)
    }
}

async function getTemplate(tName) {

    const errorString = "Failed to get new document template!"
    try {
        if (!tName) {
            throw new ServerError(errorString, 'Template name not present!')
        }
        const d = {
            templateName: tName
        }
        const t = await DocumentTemplates.find(d).lean()
        if (t.length == 0) {
            throw new UserError(errorString, 'Failed to find template!')
        } else {
            return t[0]
        }
    } catch(err) {
        newError(err, errorString)
    }
}

module.exports = {
    addTemplate, getTemplate
}