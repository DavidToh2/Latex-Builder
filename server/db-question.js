const aux = require('./aux/aux')
const async = require('async')
const { mongoose } = require('./db-connection')
const { questionSchema } = require("./models/question.js")
const { ServerError, UserError, DatabaseError, newError } = require('./express-classes/error')
const dbAuth = require('./db-auth')

const LIMITED_ACCOUNT_QN_LIMIT = 5
const ACCOUNT_CAN_SET_QN = ['admin', 'active', 'limited']

// https://forum.freecodecamp.org/t/cant-export-require-a-module-mongoose-model-typeerror-user-is-not-a-constructor/452317/6
// Exporting the schemas rather than the models works better for some reason.
const questionDB = mongoose.connection.useDb('questions', { useCache: true} )
const Question = questionDB.model("questions", questionSchema)


async function newQuestion(nQ, userID) {

    const errorString = "Failed to set new question:"

    try {
        console.log("Setting new question...")

                // Only allow users with sufficient account access to set questions
        
        if (userID == 'public') {
            throw new UserError(errorString, 'You need to be logged in to set new questions!')
        }

        const user = await dbAuth.findUserInfoUsingID(userID)
        if (!user) {
            throw new DatabaseError
        }
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

        nQ['userPerms']['owner'] = userID
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
        aux.parseID(q, 'server')
        qn.push(q)

                // Add the question ID to our user's personal questions[] array

        const c = await dbAuth.setUserQuestions(userID, 'add', q.id)
        if (!c) {
            throw new DatabaseError(errorString, 'Failed to set user\'s personal question array!')
        }

        return qns
    } catch(err) {
        newError(err, errorString)
    }
}

        // Returns all questions viewable by user.

async function getQuestions(dataDict, userID) {
    
    const errorString = 'db-question/getQuestions: Failed to find question:'
    try {
        console.log("Finding questions...")
        const qnsAll = await Question.find(dataDict).lean()

        const qns = []

                // Only return questions for which user has viewing permission.
                // Parse question IDs to displayIDs before passing to web

        var user = 'public'
        if (userID != 'public') {
            u = await dbAuth.findUserInfoUsingID(userID)
            user = u.username
        }

        qnsAll.forEach((qn) => {
            switch(user) {
                case 'public':
                    if (qn.userPerms.canReadPublic || qn.userPerms.canModifyPublic) {
                        aux.parseID(qn, 'server')
                        qns.push(qn)
                    }
                break
                default:
                    if (
                        qn.userPerms.owner == user ||
                        qn.userPerms.canModifyUsers.indexOf(user) >= 0 ||
                        qn.userPerms.canReadUsers.indexOf(user) >= 0 ||
                        u.accountStatus == 'admin'
                    ) {
                        aux.parseID(qn, 'server')
                        aux.parseUserPerms(qn)
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

async function deleteQuestion(i, userID) {

    const errorString = `Failed to delete question with ID ${i}!`

    try {
        console.log(`Deleting question with displayID ${i}`)

                // Only allow the owner (or admins) to delete questions

        if (userID == 'public') {
            throw new UserError(errorString, 'You need to be logged in to delete questions!')
        }
        const u = await dbAuth.findUserInfoUsingID(userID)
        const user = u.username

                // Get the question object to check for user permissions

        var dQ = {'displayID': i}
        aux.parseID(dQ, 'web')
        const q = await Question.findOne(dQ).lean()
        if (!q) {
            throw new DatabaseError(errorString, 'Question ID not found!')
        }

                // Find the question's owner

        const owner = q.userPerms.owner
        const ownerID = await dbAuth.findUserIDUsingUsername(owner)
        if (!ownerID) {
            throw new DatabaseError(errorString, `Owner ${owner} no longer exists!`)
        }

        if (owner == user || u.accountStatus == 'admin') {

                    // If owner or admin, delete the question and remove from owner's question array

            const res = await Question.deleteOne(dQ)        // Returns {deletedCount: 1}
            if (!res) {
                throw new DatabaseError(errorString, 'deleteOne() method failed!')
            }
            const c = await dbAuth.setUserQuestions(ownerID, 'remove', dQ.id)
            if (!c) {
                throw new DatabaseError(errorString, 'Failed to set user\'s personal question array!')
            }
            return res  
        } else {
            throw new UserError(errorString, 'You must be the question\'s owner to delete it!')
        }

    } catch(err) {
        newError(err, errorString)
    }
}

async function saveQuestion(i, dataDict, userID) {

    const errorString = `Failed to save question with ID ${i}:`

    try {
        console.log(`Saving question with displayID ${i}`)

                // Get the question document (no lean(): it's updated directly!)

        var qID = {'displayID': i}
        aux.parseID(qID, 'web')             
        var q = await Question.findOne(qID)
        if (!q) {
            throw new DatabaseError(errorString, `Question with displayID ${i} not found!`)
        }

                // Check user perms

        if (userID == 'public') {
            throw new UserError(errorString, 'You need to be logged in to make changes to questions!')
        }

        const u = await findUserInfoUsingID(userID)
        const user = u.username
        if (
            q.userPerms.owner == user ||
            q.userPerms.canModifyUsers.indexOf(user) >= 0 ||
            u.accountStatus == 'admin'
        ) {

                    // Edit the question

            const qs = q.update(dataDict, function(err, qn) {
                if (err) {
                    throw new DatabaseError(errorString, err.message)
                } else {
                    return qn
                }
            })
            if (!qs) {
                throw new DatabaseError(errorString, 'Failed to update question!')
            }

            console.log(`Saved question with ID ${i}`)
            return qs  
        } else {
            throw new UserError(errorString, 'You do not have sufficient permissions to make changes to this question!')
        }     
    } catch(err) {
        newError(err, errorString)
    }
}

async function setQuestionPerms(dispID, data, userID) {

    const errorString = 'Failed to set question permissions:'

    try {
        console.log(`Setting permissions for question with displayID ${dispID}`)

                // Get the question document (no lean(): it's updated directly!)

        var qID = {'displayID': i}
        aux.parseID(qID, 'web')             
        var q = await Question.findOne(qID)
        if (!q) {
            throw new DatabaseError(errorString, `Question with displayID ${i} not found!`)
        }

                // Check user perms

        if (userID == 'public') {
            throw new UserError(errorString, 'You must be logged in to modify this question\'s user permissions!')
        }

        const u = await findUserInfoUsingID(userID)
        const user = u.username
        if (q.userPerms.owner == user || u.accountStatus == 'admin') {
                    
                    // Parse desired actions

            const type = data['type']
            const action = data['action']
            const targetName = data['name']
            console.log(`To ${action} ${targetName} to/from ${type}`)
            const callback = ((err, qn) => {
                if (err) { throw new DatabaseError(errorString, err.message) }
                else { return qn }
            })
            var r = 0

            if (action == 'add') {
                switch(type) {
                    case 'modifyUsers':
                        const u1 = await dbAuth.findUserIDUsingUsername(targetName)
                        if (u1) {
                            r = q.update({$push: { 'userPerms.canModifyUsers': u1 }}, callback)
                        }
                    break
                    case 'modifyGroups':
                        const u2 = await dbAuth.findGroupUsingName(targetName)
                        if (u2) {
                            r = q.update({$push: { 'userPerms.canModifyGroups': targetName }}, callback)
                        }
                    break
                    case 'readUsers':
                        const u3 = await dbAuth.findUserIDUsingUsername(targetName)
                        if (u3) {
                            r = q.update({$push: { 'userPerms.canReadUsers': u3 }}, callback)
                        }
                    break
                    case 'readGroups':
                        const u4 = await dbAuth.findGroupUsingName(targetName)
                        if (u4) {
                            r = q.update({$push: { 'userPerms.canReadGroups': targetName }}, callback)
                        }
                    break
                    case 'public':
                        r = q.update({ 'userPerms.canAccessPublic': true }, callback)
                    break
                }
            } else if (action == 'remove') {
                switch(type) {
                    case 'modifyUsers':
                        const u5 = await dbAuth.findUserIDUsingUsername(targetName)
                        if (u5) {
                            r = q.update({$pull: { 'userPerms.canModifyUsers': u5 }}, callback)
                        }
                    break
                    case 'modifyGroups':
                        const u6 = await dbAuth.findGroupUsingName(targetName)
                        if (u6) {
                            r = q.update({$pull: { 'userPerms.canModifyGroups': targetName }}, callback)
                        }
                    break
                    case 'readUsers':
                        const u7 = await dbAuth.findUserIDUsingUsername(targetName)
                        if (u7) {
                            r = q.update({$pull: { 'userPerms.canReadUsers': u7 }}, callback)
                        }
                    break
                    case 'readGroups':
                        const u8 = await dbAuth.findGroupUsingName(targetName)
                        if (u8) {
                            r = q.update({$pull: { 'userPerms.canReadGroups': targetName }}, callback)
                        }
                    break
                    case 'public':
                        r = q.update({ 'userPerms.canAccessPublic': false }, callback)
                    break
                }
            }

            if (r) {
                return r        // Should return question with updated permissions
            } else {
                throw new DatabaseError(errorString, `Failed to modify user permissions for question ${dispID}!`)
            }

        } else {
            throw new UserError(errorString, 'You must be the owner to modify this question\'s user permissions!')
        }

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

module.exports = {
    newQuestion, getQuestions, deleteQuestion, saveQuestion, setQuestionPerms
}