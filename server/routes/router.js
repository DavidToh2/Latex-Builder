var express = require('express');
var router = express.Router();
var { newQuestion, findQuestions, findQuestionByID, deleteQuestionByID, saveQuestion } = require('../db')


var stringToArrayFields = ['category', 'topic', 'subtopic', 'tags']
var stringToNumberFields = ['sourceYear']

router.use((req, res, next) => {                        // MIDDLEWARE FUNCTION GETS CALLED ON EVERY QUERY
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "*")
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE")
    next()
})

router.post('/get', async function(req, res) {                  // FIND / GET QUESTIONS BASED ON DATADICT

    console.log("Getting questions with the following parameters:")
    var dataDict = parseWebToServer(req.body)
    console.log(req.body)
    var fQ = await findQuestions(dataDict)
    console.log("Found the following questions:")
    console.log(fQ)
    res.json(fQ)

    /* res.json does the following:
        res.header("Content-Type", "application/json")
        res.send(JSON.stringify(data))
    */
})

router.post('/set/new', function(req, res) {              // SET NEW QUESTION

    console.log("Setting new question...")
    var dataDict = parseWebToServer(req.body)
    console.log(req.body)
    var nQ = newQuestion(dataDict)
    console.log(nQ)     
    res.header("Content-Type", "text/plain")
    res.send(nQ)
})

router.post('/set/update', function(req, res) {           // UPDATE EXISTING QUESTION

    console.log("Updating existing question")
    const reqData = req.body
    res.header("Content-Type", "text/plain")
    res.send(saveQuestion(reqData.id, reqData.dataDict))
})

router.post('/delete/id', function(req, res) {

    console.log("Deleting question")
    const reqData = req.body
    res.send(deleteQuestionByID(reqData.id))
})

function parseWebToServer(dataDict) {
    for (const f of stringToArrayFields) {
        if (dataDict.hasOwnProperty(f)) {
            dataDict[f] = dataDict[f].split(', ')
        }
    }
    for (const f of stringToNumberFields) {
        if (dataDict.hasOwnProperty(f)) {
            dataDict[f] = Number(dataDict[f])
        }
    }
    return dataDict
}

module.exports = router