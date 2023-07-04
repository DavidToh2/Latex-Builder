const { mongoose } = require('./db-connection')
const { DocumentSchema } = require('./models/document')

const { UserError, DatabaseError, newError } = require('./express-classes/error')

const documentDB = mongoose.connection.useDb('templates', { useCache: true })

const DocumentTemplates = documentDB.model('templates', DocumentSchema)

async function addTemplate(data) {

    const errorString = "Failed to add new document template!"
    try {
        const t = await DocumentTemplates.insertMany([data])
    } catch(err) {
        newError(err, errorString)
    }
}

async function buildDocument(data, templateName = "default") {

}

function documentOutput(documentClass, packages, setup, title, author, date, body) {
    
}