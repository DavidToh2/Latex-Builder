const { parseID } = require('./ids/id')
const async = require('async')
const { mongoose } = require('./db-connection')
const { questionSchema } = require("./models/question.js")
const { ServerError, UserError, DatabaseError, newError } = require('./express-classes/error')
const { findUserInfoUsingID, setUserQuestions } = require('./db-auth')

const LIMITED_ACCOUNT_QN_LIMIT = 5
const ACCOUNT_CAN_SET_QN = ['admin', 'active', 'limited']

// https://forum.freecodecamp.org/t/cant-export-require-a-module-mongoose-model-typeerror-user-is-not-a-constructor/452317/6
// Exporting the schemas rather than the models works better for some reason.

const questionDB = mongoose.connection.useDb('questions', { useCache: true} )

const Question = questionDB.model("questions", questionSchema);

async function newQuestion(nQ, uID) {

    const errorString = "db/newQuestion: Failed to save question:"

    try {
        console.log("Setting new question...")

                // Only allow users with sufficient account access to set questions

        const user = await findUserInfoUsingID(uID)
        if (ACCOUNT_CAN_SET_QN.indexOf(user.accountStatus) < 0) {
            throw new UserError(errorString, 'Your account does not have sufficient privileges to set new questions!')
        }
        if (user.accountStatus == 'limited' && user.questions.length >= LIMITED_ACCOUNT_QN_LIMIT) {
            throw new UserError(errorString, `You have reached your account limit of ${user.questions.length} questions!`)
        }

                // Assign new ID

        const i = await newID()
        if (!i) {
            throw new DatabaseError(errorString, 'Unable to assign new ID!')
        }
        nQ['id'] = i
        console.log(`The new id is ${i}`)

                // Set owner and last modified date

        nQ['userPerms']['owner'] = uID
        nQ['lastModified'] = Date.now()

                // Insert the question

        var qnRaw = await Question.insertMany([nQ])        // Returns a copy of the saved documents
        if (qnRaw.length != 1) {
            throw new DatabaseError(errorString, `insertMany() successfully inserted ${qnRaw.length} documents, which is unexpected!`)
        }
        console.log('Question inserted!')

                // Parse IDs to displayIDs before passing to web
        
        var qn = []

        var q = qnRaw[j].toObject()
        q = parseID(q, 'server')
        qn.push(q)

                // Add the question ID to our user's personal questions[] array

        const c = setUserQuestions(uID, 'add', q.id)
        if (!c) {
            throw new DatabaseError(errorString, 'Failed to set user\'s personal question array!')
        }

        return qns
    } catch(err) {
        newError(err, errorString)
    }
}

// Returns all questions viewable by user.

async function getQuestions(dataDict, user) {
    
    const errorString = 'db-question/getQuestions: Failed to find question:'
    try {
        console.log("Finding questions...")
        const qnsAll = await Question.find(dataDict).lean()

        const qns = []

        // Only return questions for which user has viewing permission.
        // Parse question IDs to displayIDs before passing to web

        qnsAll.forEach((qn) => {
            switch(user) {
                case 'public':
                    if (qn.userPerms.canReadPublic || qn.userPerms.canModifyPublic) {
                        qn = parseID(qn, 'server')
                        qns.push(qn)
                    }
                break
                default:
                    if (
                        qn.userPerms.owner == user ||
                        qn.userPerms.canModifyUsers.indexOf(user) >= 0 ||
                        qn.userPerms.canReadUsers.indexOf(user) >= 0
                    ) {
                        qn = parseID(qn, 'server')
                        qns.push(qn)
                    }
                break
            }
        })

        return qns
    } catch(err) {
        newError(err, errorString)
    }
}

async function deleteQuestion(i) {

    const errorString = `db-question/deleteQuestion: Failed to delete question with ID ${i}!`

    try {
        console.log(`Deleting question with displayID ${i}`)
        var dQ = {'displayID': i}
        dQ = parseID(dQ, 'web')

        const res = await Question.deleteOne(dQ)        // Returns {deletedCount: 1}
        if (!res) {
            throw new DatabaseError('deleteOne() method failed!')
        }

        return res      
    } catch(err) {
        newError(err, errorString)
    }
}

async function saveQuestion(i, dataDict) {

    const errorString = `db-question/saveQuestion: Failed to save question with ID ${i}:`

    try {
        console.log(`Saving question with displayID ${i}`)
        var qID = {'displayID': i}
        qID = parseID(qID, 'web')             // Parse displayID to ID before searching database

        var q = await Question.findOne(qID)
        if (!qID) {
            throw new DatabaseError(errorString, 'Question ID not found!')
        }

        for (const [key, value] of Object.entries(dataDict)) {
            q[key] = value
        }
        
        const qs = await q.save()         // Returns a copy of the saved question
        if (!qs) {
            throw new DatabaseError(errorString, 'save() method failed!')
        }

        console.log(`Saved question with ID ${i}`)
        return qs       
    } catch(err) {
        newError(err, errorString)
    }
}

async function newID() {

    const errorString = `db-question/newID: Failed to assign new ID:`
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
        newError(err, errorString)
    }
}

function filterQuestions(qnArray, uID, perms) {
    
    const result = []

    qnArray.forEach((qn, index) => {
        switch(perms) {
            case 'owner':

            case 'modify':

            case 'read':

            break
        }
    })
}

module.exports = {
    newQuestion, getQuestions, deleteQuestion, saveQuestion
}