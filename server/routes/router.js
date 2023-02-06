var express = require('express');
var router = express.Router();
var { newQuestion, getAllQuestions, findQuestions, findQuestionByID, deleteQuestions, deleteQuestionByID, saveQuestion } = require('../db')


var stringToArrayFields = ['category', 'topic', 'subtopic', 'tags']
var stringToNumberFields = ['sourceYear']

router.post('/get', function(req, res, next) {                  // FIND / GET QUESTIONS BASED ON DATADICT

    // console.log("Request received!")

    var dataDict = parseWebToServer(req.body)

    res.json(findQuestions(dataDict))

    /* res.json does the following:
        res.header("Content-Type", "application/json")
        res.send(JSON.stringify(data))
    */
})

router.post('/set/new', function(req, res, next) {              // SET NEW QUESTION

    console.log("Setting new question")
    res.send(newQuestion(req.body))
})

router.post('/set/update', function(req, res, next) {           // UPDATE EXISTING QUESTION

    console.log("Updating existing question")
    const reqData = req.body
    res.send(saveQuestion(reqData.id, reqData.dataDict))
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