var express = require('express');
var router = express.Router();
var { newQuestion, getAllQuestions, findQuestions, findQuestionByID, deleteQuestions, deleteQuestionByID, saveQuestion } = require('../db')

    // Copies the received information into a response sent back to the server

router.post('/', function(req, res, next) {

    console.log("Request received!")
    res.json(req.body)

})


module.exports = router