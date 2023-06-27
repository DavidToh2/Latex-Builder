const express = require('express');
const router = express.Router();
const { newQuestion, getQuestions, deleteQuestion, saveQuestion } = require('./../db-function')
const { ResponseBody, ResponseError } = require('../express-classes/response')

const stringToArrayFields = ['category', 'topic', 'subtopic', 'difficulty', 'sourceName', 'tags']
const stringToNumberFields = ['sourceYear']

router.post('/get', async function(req, res, next) {                  // FIND / GET QUESTIONS BASED ON DATADICT

    try {
        console.log("Search parameters:")
        const reqData = parseWebToServer(req.body)
        console.log(reqData)

        const fQ = await getQuestions(reqData)

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

        const nQ = await newQuestion(reqData)

        const response = new ResponseBody(reqData['fn'])
        response.status = 0
        response.body = nQ
        console.log(response)

        res.json(response)
    } catch(err) {
        next(err)
    }
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

        // Local error handler

router.use(function(err, req, res, next) {
    const response = new ResponseError()
    response.status = -1
    response.fn = `${req.body['fn']}-Error`
    response.error = err
    console.log(response)

    res.status(502)
    res.json(response)
})

module.exports = router