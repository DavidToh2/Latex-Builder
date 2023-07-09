const express = require('express');
const router = express.Router();
const { newQuestion, getQuestions, deleteQuestion, saveQuestion } = require('../db-question')
const { ResponseBody, ResponseError } = require('../express-classes/response')
const { UserError, DatabaseError, ServerError } = require('../express-classes/error')

const stringToArrayFields = ['category', 'topic', 'subtopic', 'difficulty', 'sourceName', 'tags']
const stringToNumberFields = ['sourceYear']

router.post('/get', async function(req, res, next) {                  // FIND / GET QUESTIONS BASED ON DATADICT

    try {
        console.log("Search parameters:")
        const reqData = parseWebToServer(req.body)
        console.log(reqData)

        var user = 'public'
        if (req.session.uID) {
            user = req.session.uID
        }

        const fQ = await getQuestions(reqData, user)

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

        const nQ = await newQuestion(reqData)
        response.status = 0
        response.body = nQ
        console.log(response)

        res.json(response)
    } catch(err) {
        next(err)
    }
})
router.post('/set/new', function(req, res, next) {
    const err = new UserError("Not logged in!", "You must be logged in to create questions!")
    next(err)
})

router.post('/set/update/:displayID', async function(req, res, next) {           // UPDATE EXISTING QUESTION

    try {
        console.log("Input parameters:")
        const reqData = parseWebToServer(req.body)
        console.log(reqData)
        const displayID = req.params['displayID']

        const sQ = await saveQuestion(displayID, reqData)
        
        const response = new ResponseBody(reqData['fn'])
        response.status = 0
        response.body = sQ
        console.log(response)

        res.json(response)
    } catch(err) {
        next(err)
    }
})

router.post('/delete/:displayID', async function(req, res, next) {

    try {    
        console.log("Input parameters:")
        const reqData = req.body
        console.log(reqData)
        const displayID = req.params['displayID']

        const dQ = await deleteQuestion(displayID)
        
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
    return reqData
}

module.exports = router