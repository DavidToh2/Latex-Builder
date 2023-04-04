var express = require('express');
var router = express.Router();
var { newQuestion, findQuestions, deleteQuestion, saveQuestion } = require('../db')


var stringToArrayFields = ['category', 'topic', 'subtopic', 'difficulty', 'sourceName', 'tags']
var stringToNumberFields = ['sourceYear']

router.use((req, res, next) => {                        // MIDDLEWARE FUNCTION GETS CALLED ON EVERY QUERY
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "*")
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE")
    next()
})

router.post('/get', async function(req, res, next) {                  // FIND / GET QUESTIONS BASED ON DATADICT

    try {
        console.log("Search parameters:")
        const dataDict = parseWebToServer(req.body)
        console.log(req.body)

        const fQ = await findQuestions(dataDict)
        console.log("Found the following questions:")
        console.log(fQ)

        res.json(fQ)

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
        const dataDict = parseWebToServer(req.body)
        console.log(dataDict)

        const nQ = await newQuestion(dataDict)      
        console.log("The following question has been set:")
        console.log(nQ)

        res.json(nQ)
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

        const r = await saveQuestion(displayID, reqData)
        console.log("The following question has been saved:")
        console.log(r)

        res.json(r)
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

        const d = await deleteQuestion(displayID)
        console.log("Number of deleted questions:")
        console.log(d)

        res.json(d)
        
    } catch(err) {
        next(err)
    }
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