var express = require('express');
var router = express.Router();
var { newQuestion, getAllQuestions, findQuestions, findQuestionByID, deleteQuestions, deleteQuestionByID, saveQuestion } = require('../db')

    // Copies the received information into a response sent back to the server


router.use((req, res, next) => {                        // MIDDLEWARE FUNCTION GETS CALLED ON EVERY QUERY
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "*")
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE")
    next()
})

router.post('/', function(req, res) {

    console.log("Request received!")
    res.json(req.body)

})


module.exports = router