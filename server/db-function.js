
const { parseID } = require('./ids/id')
const async = require('async')
const { mongoose } = require('./db-connection')
const { questionSchema } = require("./models/question.js")

// https://forum.freecodecamp.org/t/cant-export-require-a-module-mongoose-model-typeerror-user-is-not-a-constructor/452317/6
// Exporting the schemas rather than the models works better for some reason.

const questionDB = mongoose.connection.useDb('questions', { useCache: true} )

const Question = questionDB.model("questions", questionSchema);

async function newQuestion(nQ) {
    try {
        console.log("Setting new question...")
        const i = await newID()
        if (!i) {
            throw new Error('Unable to assign new ID!')
        }

        nQ['id'] = i
        console.log(`The new id is ${i}`)

        var qnsRaw = await Question.insertMany([nQ])        // Returns a copy of the saved documents
        if (!qnsRaw) {
            throw new Error('insertMany() method failed!')
        }

        console.log('Questions inserted!')

        // Parses IDs to displayIDs before passing to web
        
        var qns = []
        for (var j=0; j<qnsRaw.length; j++) {
            var q = qnsRaw[j].toObject()
            q = parseID(q, 'server')
            qns.push(q)
        }

        return qns
    }
    catch(err) {
        dbError(err, "db/newQuestion: Failed to save!")
        return 0
    }
}

// Question.find({}) returns all questions.

async function getQuestions(dataDict) {   
    try {
        console.log("Finding questions...")
        const qns = await Question.find(dataDict).lean()

        // Parses IDs to displayIDs before passing to web
        qns.forEach((qn) => {
            qn = parseID(qn, 'server')
        })

        return qns
    }
    catch(err) {
        dbError(err, "db/getQuestions: Failed to find question!")
    }
}

async function deleteQuestion(i) {

    try {
        console.log(`Deleting question with displayID ${i}`)
        var dQ = {'displayID': i}
        dQ = parseID(dQ, 'web')

        const res = await Question.deleteOne(dQ)        // Returns {deletedCount: 1}
        if (!res) {
            throw new Error('deleteOne() method failed!')
        }

        return res      
    }
    catch {
        dbError(err, `db/deleteQuestion: Failed to delete question with ID ${i}!`)
    }
}

async function saveQuestion(i, dataDict) {

    try {
        console.log(`Saving question with displayID ${i}`)
        var qID = {'displayID': i}
        qID = parseID(qID, 'web')             // Parse displayID to ID before searching database

        var q = await Question.findOne(qID)
        if (!qID) {
            throw new Error('Question not found!')
        }

        for (const [key, value] of Object.entries(dataDict)) {
            q[key] = value
        }
        
        const qs = await q.save()         // Returns a copy of the saved question
        if (!qs) {
            throw new Error('save() method failed!')
        }

        console.log(`Saved question with ID ${i}`)
        return qs       
    }
    catch(err) {
        dbError(err, `db/saveQuestion: Failed to save question with ID ${i}`)
    }
}

async function newID() {
    try {
        console.log("Querying database for new ID...")

        const usedIDs = await Question.distinct('id')
        console.log(usedIDs)

        i = 1
        while (usedIDs.includes(i)) {
            i++
        }

        return i

    } catch(err) {
        dbError(err, `Failed to find new ID`)
    }
}

function dbError(err, errorMsg) {
    throw new Error(`Database error: ${errorMsg}`, { cause: err } )
}

module.exports = {
    newQuestion, getQuestions, deleteQuestion, saveQuestion
}