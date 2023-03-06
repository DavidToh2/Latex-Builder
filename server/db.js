
var { newID, deleteID, parseID } = require('./ids/id')
var mongoose = require('mongoose')
var async = require('async')

const mongoURI = "mongodb://questiondb/questions"
const options = { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
    authSource: 'admin'
};

mongoose.connect(mongoURI, options)
.then(() => console.log("Connection success!"))
.catch((error) => console.log(error));

var db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"))

const { questionSchema } = require("./models/question.js")

// https://forum.freecodecamp.org/t/cant-export-require-a-module-mongoose-model-typeerror-user-is-not-a-constructor/452317/6
// Exporting the schemas rather than the models works better for some reason.

const Question = mongoose.model("questions", questionSchema);

async function newQuestion(nQ) {
    try {
        console.log("Setting new question...")
        const i = await newID()
        if (!i) {
            throw new Error('Unable to assign new ID!')
        }

        nQ['id'] = i
        console.log(`The new id is ${i}`)

        const qns = await Question.insertMany([nQ])         // Returns a copy of the saved documents
        if (!qns) {
            throw new Error('insertMany() method failed!')
        }
        return qns
    }
    catch(err) {
        dbError(err, "db/newQuestion: Failed to save!")
        return
    }
}

// Question.find({}) returns all questions.

async function findQuestions(dataDict) {   
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
        dbError(err, "db/findQuestions: Failed to find question!")
        return
    }
}

async function deleteQuestion(i) {

    try {
        console.log(`Deleting question with displayID ${i}`)
        var dQ = [{'displayID': i}]
        dQ = parseID(dQ, 'web')             // Parse displayID to ID before searching database

        const d = await deleteID(dQ['id'])
        if (!d) {
            throw new Error('Unable to delete ID!')
        }

        const res = await Question.deleteOne(dQ)        // Returns {deletedCount: 1}
        if (!res) {
            throw new Error('deleteOne() method failed!')
        }

        return res      
    }
    catch {
        dbError(err, `db/deleteQuestion: Failed to delete question with ID ${i}!`)
        return
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
        
        var qs = await q.save()         // Returns a copy of the saved question
        if (!qs) {
            throw new Error('save() method failed!')
        }

        console.log(`Saved question with ID ${i}`)
        return qs       
    }
    catch(err) {
        dbError(err, `db/saveQuestion: Failed to save question with ID ${i}`)
        return
    }
}

function dbError(err, errorMsg) {
    console.log(err, errorMsg)
    console.log(err)
}

module.exports = {
    newQuestion, findQuestions, deleteQuestion, saveQuestion
}