var express = require('express');
var router = express.Router();
var { newQuestion, findQuestions, findQuestionByID, deleteQuestionByID, saveQuestion } = require('../db')


var stringToArrayFields = ['category', 'topic', 'subtopic', 'tags']
var stringToNumberFields = ['sourceYear']

router.use((req, res, next) => {                        // MIDDLEWARE FUNCTION GETS CALLED ON EVERY QUERY
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "*")
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE")
    res.header("content-type", "text/plain")
    next()
})

router.post('/get', function(req, res) {                  // FIND / GET QUESTIONS BASED ON DATADICT

    // console.log("Request received!")

    var dataDict = parseWebToServer(req.body)
    res.json(findQuestions(dataDict))

    /* res.json does the following:
        res.header("Content-Type", "application/json")
        res.send(JSON.stringify(data))
    */
})

router.post('/set/new', function(req, res) {              // SET NEW QUESTION

    console.log("Setting new question...")
    console.log(req.body)
    var dataDict = parseWebToServer(req.body)
    res.send(newQuestion(dataDict))
})

router.post('/set/update', function(req, res) {           // UPDATE EXISTING QUESTION

    console.log("Updating existing question")
    const reqData = req.body
    res.send(saveQuestion(reqData.id, reqData.dataDict))
})

router.post('/delete/id', function(req, res) {

    console.log("Deleting question")
    const reqData = req.body
    res.send(deleteQuestionByID(reqData.id))
})

function parseWebToServer(dataDict) {
    for (const f of stringToArrayFields) {
        dataDict[f] = dataDict[f].split(', ')
    }
    for (const f of stringToNumberFields) {
        dataDict[f] = Number(dataDict[f])
    }
    return dataDict
}

module.exports = router