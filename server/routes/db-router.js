const express = require('express');
const router = express.Router();
const dbQuestion = require('../db-question')
const { ResponseBody, ResponseError } = require('../express-classes/response')
const { UserError, DatabaseError, ServerError } = require('../express-classes/error')

const stringToArrayFields = ['category', 'topic', 'subtopic', 'difficulty', 'sourceName', 'tags']
const stringToNumberFields = ['sourceYear']

router.post('/get', async function(req, res, next) {                  // FIND / GET QUESTIONS BASED ON DATADICT

    try {
        console.log("Search parameters:")
        const reqData = parseWebToServer(req.body)
        console.log(reqData)

        var userID = 'public'
        if (req.session.uID) {
            userID = req.session.uID
        }

        const fQ = await dbQuestion.getQuestions(reqData, userID)

        const response = new ResponseBody(reqData['fn'])
        if (fQ.length == 0) {
            response.status = 1
        } else {
            response.status = 0
        }
        response.body = fQ
        console.log(response)

        res.json(response)

    } catch(err) {
        next(err)
    }
    
    /* res.json does the following:
        res.header("Content-Type", "application/json")
        res.send(JSON.stringify(data))
    */
})

router.post('/set/new', async function(req, res, next) {              // SET NEW QUESTION

    try {
        console.log("Input parameters:")
        const reqData = parseWebToServer(req.body)
        console.log(reqData)

        const response = new ResponseBody(reqData['fn'])

        var userID = 'public'
        if (req.session.uID) {
            userID = req.session.uID
        }

        const nQ = await dbQuestion.newQuestion(reqData, userID)
        response.status = 0
        response.body = nQ
        console.log(response)

        res.json(response)
    } catch(err) {
        next(err)
    }
})

router.post('/set/update/:ID', async function(req, res, next) {           // UPDATE EXISTING QUESTION

    try {
        console.log("Input parameters:")
        const reqData = parseWebToServer(req.body)
        console.log(reqData)
        const ID = req.params['ID']

        var userID = 'public'
        if (req.session.uID) {
            userID = req.session.uID
        }

        const sQ = await dbQuestion.saveQuestion(ID, reqData, userID)
        
        const response = new ResponseBody(reqData['fn'])
        response.status = 0
        response.body = sQ
        console.log(response)

        res.json(response)
    } catch(err) {
        next(err)
    }
})

router.post('/set/perms/:ID', async function(req, res, next) {
    try {
        console.log("Action parameters:")
        const reqData = req.body
        console.log(reqData)
        const ID = req.params['ID']

        var userID = 'public'
        if (req.session.uID) {
            userID = req.session.uID
        }

        const sQ = await dbQuestion.setQuestionPerms(ID, reqData, userID)
        
        const response = new ResponseBody(reqData['fn'])
        response.status = 0
        response.body = sQ
        console.log(response)

        res.json(response)
    } catch(err) {
        next(err)
    }
})

router.post('/get/perms/:ID', async function(req, res, next) {                  // FIND / GET QUESTION PERMS

    try {
        const reqData = req.body
        console.log("Target question:")
        const ID = req.params['ID']

        var userID = 'public'
        if (req.session.uID) {
            userID = req.session.uID
        }

        const fQ = await dbQuestion.getQuestionPerms(ID, userID)

        const response = new ResponseBody(reqData['fn'])
        response.status = 0
        response.body = fQ

        res.json(response)

    } catch(err) {
        next(err)
    }
})

router.post('/delete/:ID', async function(req, res, next) {

    try {    
        console.log("Input parameters:")
        const reqData = req.body
        console.log(reqData)
        const ID = req.params['ID']

        var userID = 'public'
        if (req.session.uID) {
            userID = req.session.uID
        }

        const dQ = await dbQuestion.deleteQuestion(ID, userID)
        
        const response = new ResponseBody(reqData['fn'])
        response.status = 0
        response.body = dQ
        console.log(response)

        res.json(dQ)
        
    } catch(err) {
        next(err)
    }
})

function parseWebToServer(reqData) {
    console.log("Parsing web to server...")
    console.log(reqData)
    for (const f of stringToArrayFields) {
        if (reqData.hasOwnProperty(f)) {
            reqData[f] = reqData[f].split(', ')
        }
    }
    for (const f of stringToNumberFields) {
        if (reqData.hasOwnProperty(f)) {
            reqData[f] = Number(reqData[f])
        }
    }
    console.log(reqData)
    return reqData
}

module.exports = router