const { mongoose } = require('./db-connection')
const { DocumentSchema } = require('./models/document')

const { UserError, DatabaseError, newError } = require('./express-classes/error')

const documentDB = mongoose.connection.useDb('templates', { useCache: true })

const DocumentTemplates = documentDB.model('templates', DocumentSchema)

async function addTemplate(data) {

    const errorString = "Failed to add new document template!"
    try {
        const t = await DocumentTemplates.insertMany([data])
        return t
    } catch(err) {
        newError(err, errorString)
    }
}

async function getTemplate(data) {

    const errorString = "Failed to get new document template!"
    try {
        const t = await DocumentTemplates.find(data).lean()
        if (t.length == 0) {
            throw new UserError(errorString, 'Failed to find template!')
        } else {
            return t[0]
        }
    } catch(err) {
        newError(err, errorString)
    }
}