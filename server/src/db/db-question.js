const { mongoose } = require('./db-connection')
const { questionSchema } = require("./models/question.js")
const { ServerError, UserError, DatabaseError, newError } = require('../express-classes/error')
const dbAuth = require('./db-auth')
const aux = require('../aux')
const file = require('../file')
const preview_images = require('../preview_images')

const fields = require('./init/fields.json')
const VALID_TOPICS = Object.keys(fields["Mathematics"]["topic"]) //.concat(Object.keys(fields["Computer Science"]["topic"]))

const LIMITED_ACCOUNT_QN_LIMIT = 5
const ACCOUNT_CAN_SET_QN = ['admin', 'active', 'limited'] 

const MODE = process.env.NODE_ENV.trim()

// https://forum.freecodecamp.org/t/cant-export-require-a-module-mongoose-model-typeerror-user-is-not-a-constructor/452317/6
// Exporting the schemas rather than the models works better for some reason.
questionSchema.index({ question: "text" })
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

                // Validate question inputs

        aux.validateQuestionInputs(nQ)
        nQ['sourceYear'] = (nQ['sourceYear'] == '') ? null : parseInt(nQ['sourceYear'])

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
        nQ['lastModified'] = Date.now()

                // Insert the question

        var qnRaw = await Question.insertMany([nQ])        // Returns a copy of the saved documents
        if (qnRaw.length != 1) {
            throw new DatabaseError(errorString, `insertMany() successfully inserted ${qnRaw.length} documents, which is unexpected!`)
        }
        console.log('Question inserted!')

                // Parse IDs to displayIDs before passing to web

        const q = qnRaw[0].toObject()

                // Compile question latex into image

        const qnCompile = await file.buildPreview(q['question'], userID, i)
        if (qnCompile) {
            throw new DatabaseError(errorString, 'Something went wrong during the compilation!')
        }

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

async function getQuestions(dataDict, page, userID) {
    
    const errorString = 'db-question/getQuestions: Failed to find question:'

    try {
        console.log("Finding questions...")
        var [filters, qnText] = parseSearchFields(dataDict)
    } catch(err) {
        newError(err, 'db-question/getQuestions: Failed to parse search fields:')
    }

    try {
        // page: {skip, display}
        // Stores the current page, not the target page
        var newSkip = page.skip
        switch(page.direction) {
            case "prev":
                newSkip -= page.display
                if (newSkip < 0) {
                    newSkip = 0
                }
            break
            case "next":
                newSkip += page.display
            break
            case "new":
                newSkip = 0
            break
        }
        
        var qnsAll

        if (MODE == 'development') {

            // We cannot use Mongo Atlas Search on the developmental database, so we stick to the 'basic' version:
            
            var searchFilter = filters
            if (qnText) {
                searchFilter = [{ "$text": { "$search": qnText } }].concat(filters)
            }
            console.log(searchFilter)
            qnsAll = await Question.find({ "$and": searchFilter }).skip(newSkip).limit(page.display).lean()
            
        } else if (MODE == 'production') {
            
            var query = []
            var searchFilter = [{
                "in": { "path": "topic", "value": VALID_TOPICS }
            }].concat(filters)

            if (qnText) {
                query.push({
                    "$search": {
                        "index": "question-search",
                        "compound": {
                            "must": searchFilter,
                            "should": [{
                                "text": { "query": qnText, "path": "question" },
                            }]
                        }
                    }
                })
            } else {
                query.push({
                    "$search": {
                        "index": "question-search",
                        "compound": {
                            "must": searchFilter
                        }
                    }
                })
            }
            
            query.push({ $skip: newSkip }) 
            query.push({ $limit: page.display })
            qnsAll = await Question.aggregate(query)
        }
    } catch(err) {
        newError(err, `db-question/getQuestions: Failed to build search query in ${MODE} mode:`)
    }

    try {
        if (page.direction == "prev") {
            qnsAll = qnsAll.reverse()
        }

                // Only return questions for which user has viewing permission.
                // Parse question IDs to displayIDs before passing to web
        var u = 'public'
        if (userID != 'public') {
            u = await dbAuth.findUserInfoUsingID(userID)
            if (!u) {
                throw new DatabaseError(errorString, 'Failed to get user info!')
            }
        }

        const res = formatQnsReturned(qnsAll, userID, page.display, newSkip)
        return res

    } catch(err) {
        newError(err, 'db-question/getQuestions: Failed to find question:')
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

            const res1 = await Question.deleteOne(dQ)        // Returns {deletedCount: 1}
            if (!res1) {
                throw new DatabaseError(errorString, 'deleteOne() method failed!')
            }
            const res2 = await preview_images.deletePreview(dQ.id)
            const c = await dbAuth.setUserQuestions(owner, 'remove', dQ.id)
            if (!c) {
                throw new DatabaseError(errorString, 'Failed to set user\'s personal question array!')
            }
            return res1  
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

                    // Compile question latex into image

            const question = dataDict['question']
            const qnCompile = await file.buildPreview(question, userID, id)
            if (qnCompile) {
                throw new DatabaseError(errorString, 'Something went wrong during the compilation!')
            }

                    // Edit the question

            dataDict['lastModified'] = Date.now()

            const qs = await Question.findOneAndUpdate(qID, dataDict, {new: true})
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

    const errorString = 'db-question/getQuestionPerms: Failed to get question permissions:'
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

function parseSearchFields(qn) {
    const qnText = qn['question']
    var filters = []
    if (MODE == 'production') {
        for (var key of ['category', 'topic', 'subtopic', 'difficulty', 'sourceName', 'tags']) {
            if (qn[key].length == 0) { delete qn[key] }
            else { 
                filters.push({ "in": { "path": key, "value": qn[key] } }) 
            }
        }
        delete qn['question']
        for (var key of ['sourceYear']) {
            if (qn[key] == '') { delete qn[key] } 
            else { filters.push({ "equals": { "path": key, "value": qn[key] } }) }
        }
    } else if (MODE == 'development') {
        for (var key of ['category', 'topic', 'subtopic', 'difficulty', 'sourceName', 'tags']) {
            if (qn[key].length == 0) { delete qn[key] }
            else { filters.push({ [key]: { "$all": qn[key] } })}
        }
        delete qn['question']
        for (var key of ['sourceYear']) {
            if (qn[key] == '') { delete qn[key] } 
            else { filters.push({ [key]: { "$eq": qn[key] } }) }
        }
    }
    
    return [filters, qnText]
}

function formatQnsReturned(qns, userID, display, newSkip) {
    const res = {qns: []}
    qns.forEach((qn) => {
        delete qn['_id']
        qn['sourceYear'] = (qn['sourceYear'] == null) ? "" : qn['sourceYear'].toString()
        switch(userID) {
            case 'public':
                if (qn.userPerms.canAccessPublic) {
                    delete qn.userPerms
                    res["qns"].push(qn)
                }
            break
            default:
                if (
                    qn.userPerms.canAccessPublic ||
                    qn.userPerms.owner == userID ||
                    qn.userPerms.canModifyUsers.indexOf(userID) >= 0 ||
                    qn.userPerms.canReadUsers.indexOf(userID) >= 0 ||
                    u.accountStatus == 'admin'
                ) {
                    delete qn.userPerms
                    res["qns"].push(qn)
                }
            break
        }
    })
    res.page = { skip: newSkip, display: display }
    return res
}

module.exports = {
    newQuestion, getQuestions, deleteQuestion, saveQuestion, setQuestionPerms, getQuestionPerms
}