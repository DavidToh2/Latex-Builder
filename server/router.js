var express = require('express');
var router = express.Router();
var { newQuestion, getAllQuestions, findQuestions, findQuestionByID, deleteQuestions, deleteQuestionByID, saveQuestion } = require('./db')


router.post('/', function(req, res, next) {

    console.log("Request received!")
    res.json(getAllQuestions())

    /* res.json does the following:
        res.header("Content-Type", "application/json")
        res.send(JSON.stringify(data))
    */
})

router.post('/set/new', function(req, res, next) {

    console.log("Setting new question")
    res.send(newQuestion(req.body))
})

router.post('/set/update', function(req, res, next) {

    console.log("Updating existing question")
    const reqData = req.body
    res.send(saveQuestion(reqData.id, reqData.dataDict))
})

/* ncategory, 
nquestion, 
ntopicData, 
nsubtopicData, 
ndifficulty, 
nimages, 
nsolution, 
nsolutionImages, 
nsourceName, 
nsourceYear, 
nTags */

module.exports = router;