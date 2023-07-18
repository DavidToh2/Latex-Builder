const aux = require('../aux')
const async = require('async')
const { mongoose } = require('./db-connection')
const { questionSchema } = require("./models/question.js")
const { ServerError, UserError, DatabaseError, newError } = require('../express-classes/error')
const dbAuth = require('./db-auth')

const LIMITED_ACCOUNT_QN_LIMIT = 5
const ACCOUNT_CAN_SET_QN = ['admin', 'active', 'limited']

// https://forum.freecodecamp.org/t/cant-export-require-a-module-mongoose-model-typeerror-user-is-not-a-constructor/452317/6
// Exporting the schemas rather than the models works better for some reason.
const questionDB = mongoose.connection.useDb('questions', { useCache: true} )
const Question = questionDB.model("questions", questionSchema)

const emptyUserPerms = {
    owner: '',
    canModifyUsers: [],
    canModifyGroups: [],
    canReadUsers: [],
    canReadGroups: [],
    canAccessPublic: true
}

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

        nQ['userPerms'] = emptyUserPerms
        nQ['userPerms']['owner'] = userID
        nQ['lastModified'] = new Date()

                // Insert the question

        var qnRaw = await Question.insertMany([nQ])        // Returns a copy of the saved documents
        if (qnRaw.length != 1) {
            throw new DatabaseError(errorString, `insertMany() successfully inserted ${qnRaw.length} documents, which is unexpected!`)
        }
        console.log('Question inserted!')

                // Parse IDs to displayIDs before passing to web

        var q = qnRaw[0].toObject()

                // Add the question ID to our user's personal questions[] array

        delete q['_id']
        const c = await dbAuth.setUserQuestions(userID, 'add', q.id)
        if (!c) {
            throw new DatabaseError(errorString, 'Failed to set user\'s personal question array!')
        }

        return q
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
        var u = 'public'
        if (userID != 'public') {
            u = await dbAuth.findUserInfoUsingID(userID)
            if (!u) {
                throw new DatabaseError(errorString, 'Failed to get user info!')
            }
        }

        qnsAll.forEach((qn) => {
            delete qn['_id']
            switch(userID) {
                case 'public':
                    if (qn.userPerms.canAccessPublic) {
                        delete qn.userPerms
                        qns.push(qn)
                    }
                break
                default:
                    if (
                        qn.userPerms.owner == userID ||
                        qn.userPerms.canModifyUsers.indexOf(userID) >= 0 ||
                        qn.userPerms.canReadUsers.indexOf(userID) >= 0 ||
                        u.accountStatus == 'admin'
                    ) {
                        delete qn.userPerms
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

async function deleteQuestion(id, userID) {

    const errorString = `Failed to delete question with ID ${id}!`

    try {
        console.log(`Deleting question with displayID ${id}`)

                // Only allow the owner (or admins) to delete questions

        if (userID == 'public') {
            throw new UserError(errorString, 'You need to be logged in to delete questions!')
        }
        const u = await dbAuth.findUserInfoUsingID(userID)
        if (!u) {
            throw new DatabaseError(errorString, 'Failed to get user info!')
        }
                // Get the question object to check for user permissions

        var dQ = {'id': id}
        const q = await Question.findOne(dQ).lean()
        if (!q) {
            throw new DatabaseError(errorString, 'Question ID not found!')
        }

                // Find the question's owner

        const owner = q.userPerms.owner
        const ownername = await dbAuth.findUsernameUsingID(owner)
        if (!ownername) {
            throw new DatabaseError(errorString, `Owner no longer exists!`)
        }

        if (owner == userID || u.accountStatus == 'admin') {

                    // If owner or admin, delete the question and remove from owner's question array

            const res = await Question.deleteOne(dQ)        // Returns {deletedCount: 1}
            if (!res) {
                throw new DatabaseError(errorString, 'deleteOne() method failed!')
            }
            const c = await dbAuth.setUserQuestions(owner, 'remove', dQ.id)
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

async function saveQuestion(id, dataDict, userID) {

    const errorString = `Failed to save question with ID ${id}:`

    try {
        console.log(`Saving question with displayID ${id}`)

                // Get the question document (no lean(): it's updated directly!)

        var qID = {'id': id}            
        var q = await Question.findOne(qID)
        if (!q) {
            throw new DatabaseError(errorString, `Question with id ${id} not found!`)
        }

        delete dataDict['id']       // Prevent changing question id

                // Check user perms

        if (userID == 'public') {
            throw new UserError(errorString, 'You need to be logged in to make changes to questions!')
        }

        const u = await dbAuth.findUserInfoUsingID(userID)
        if (!u) {
            throw new DatabaseError(errorString, 'Failed to get user info!')
        }
        if (
            q.userPerms.owner == userID ||
            q.userPerms.canModifyUsers.indexOf(userID) >= 0 ||
            u.accountStatus == 'admin'
        ) {

                    // Edit the question

            dataDict['lastModified'] = new Date()

            const qs = await q.updateOne(dataDict)
            if (!qs) {
                throw new DatabaseError(errorString, 'Failed to update question!')
            }

            console.log(`Saved question with ID ${id}`)
            delete qs['_id']
            return qs  
        } else {
            throw new UserError(errorString, 'You do not have sufficient permissions to make changes to this question!')
        }     
    } catch(err) {
        newError(err, errorString)
    }
}

async function setQuestionPerms(id, data, userID) {

    const errorString = 'Failed to set question permissions:'

    try {
        console.log(`Setting permissions for question with displayID ${id}`)

                // Get the question document (no lean(): it's updated directly!)

        var qID = {'id': id}           
        var q = await Question.findOne(qID)
        if (!q) {
            throw new DatabaseError(errorString, `Question with displayID ${id} not found!`)
        }

                // Check user perms

        if (userID == 'public') {
            throw new UserError(errorString, 'You must be logged in to modify this question\'s user permissions!')
        }

        const u = await dbAuth.findUserInfoUsingID(userID)
        if (!u) {
            throw new DatabaseError(errorString, 'Failed to get user info!')
        }
        if (q.userPerms.owner == userID || u.accountStatus == 'admin') {
                    
                    // Parse desired actions

            const type = data['type']
            const action = data['action']
            const targetName = data['name']
            console.log(`To ${action} ${targetName} to/from ${type}`)

                    // Set permissions

            var r

            if (action == 'add') {
                switch(type) {
                    case 'modifyUsers':
                        const u1 = await dbAuth.findUserIDUsingUsername(targetName)
                        if (u1) {
                            r = await q.updateOne({$push: { 'userPerms.canModifyUsers': u1 }})
                        }
                    break
                    case 'modifyGroups':
                        const u2 = await dbAuth.findGroupUsingName(targetName)
                        if (u2) {
                            r = await q.updateOne({$push: { 'userPerms.canModifyGroups': targetName }})
                        }
                    break
                    case 'readUsers':
                        const u3 = await dbAuth.findUserIDUsingUsername(targetName)
                        if (u3) {
                            r = await q.updateOne({$push: { 'userPerms.canReadUsers': u3 }})
                        }
                    break
                    case 'readGroups':
                        const u4 = await dbAuth.findGroupUsingName(targetName)
                        if (u4) {
                            r = await q.updateOne({$push: { 'userPerms.canReadGroups': targetName }})
                        }
                    break
                    case 'public':
                        r = await q.updateOne({ 'userPerms.canAccessPublic': true })
                    break
                }
            } else if (action == 'remove') {
                switch(type) {
                    case 'modifyUsers':
                        const u5 = await dbAuth.findUserIDUsingUsername(targetName)
                        if (u5) {
                            r = await q.updateOne({$pull: { 'userPerms.canModifyUsers': u5 }})
                        }
                    break
                    case 'modifyGroups':
                        const u6 = await dbAuth.findGroupUsingName(targetName)
                        if (u6) {
                            r = await q.updateOne({$pull: { 'userPerms.canModifyGroups': targetName }})
                        }
                    break
                    case 'readUsers':
                        const u7 = await dbAuth.findUserIDUsingUsername(targetName)
                        if (u7) {
                            r = await q.updateOne({$pull: { 'userPerms.canReadUsers': u7 }})
                        }
                    break
                    case 'readGroups':
                        const u8 = await dbAuth.findGroupUsingName(targetName)
                        if (u8) {
                            r = await q.updateOne({$pull: { 'userPerms.canReadGroups': targetName }})
                        }
                    break
                    case 'public':
                        r = await q.updateOne({ 'userPerms.canAccessPublic': false })
                    break
                }
            }

            if (r) {
                delete r['_id']
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

async function getQuestionPerms(id, userID) {

    const errorString = 'db-question/getQuestions: Failed to get question permissions:'
    try {
        console.log("Fetching question permissions...")

        var qID = {'id': id} 

        const q = await Question.findOne(qID, 'userPerms').lean()
        const qnPerms = q.userPerms
        if (!qnPerms) {
            throw new DatabaseError(errorString, 'Question.findOne() method failed!')
        }

                // Only return questions for which user has viewing permission.

        var qp = {}

        switch(userID) {
            case 'public':
                if (qnPerms.canReadPublic || qnPerms.canModifyPublic) {
                    qp = qnPerms
                } else {
                    throw new UserError(errorString, 'You need to be logged in to view this question\'s user permissions!')
                }
            break
            default:
                        // Get user object to check account status
                const u = await dbAuth.findUserInfoUsingID(userID)
                if (!u) {
                    throw new DatabaseError(errorString, 'Failed to get user info!')
                }
                if (
                    qnPerms.owner == userID ||
                    qnPerms.canModifyUsers.indexOf(userID) >= 0 ||
                    qnPerms.canReadUsers.indexOf(userID) >= 0 ||
                    u.accountStatus == 'admin'
                ) {
                    qp = qnPerms
                } else {
                    throw new UserError(errorString, 'You do not have sufficient permissions to view this question\'s user permissions!')
                }
            break
        }
        const result = await aux.parseUserPerms(qp)
        if (result) {
            delete qp['_id']
            return qp
        } else {
            throw new ServerError(errorString, `Failed to parse userIDs into usernames!`)
        }

    } catch(err) {
        newError(err, errorString)
    }
}

async function newID() {

    const errorString = `db-question/newID: Failed to assign new ID:`
    try {
        // console.log("Querying database for new ID...")
        const usedIDs = await Question.distinct('id')
        // console.log(usedIDs)
        i = 1
        while (usedIDs.includes(String(i))) {
            i++
        }
        return String(i)
    } catch(err) {
        newError(err, errorString)
    }
}

module.exports = {
    newQuestion, getQuestions, deleteQuestion, saveQuestion, setQuestionPerms, getQuestionPerms
}