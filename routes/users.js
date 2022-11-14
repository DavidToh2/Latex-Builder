var express = require('express')
var {newQuestion, findQuestion} = require('../db.js')
var router = express.Router()

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource noooo')
})

router.get('/newQn', function(req, res, next) {
	// res.render('index', { title: 'cool'})
    var responseString = [];
    responseString.push('initialising question addition');
    var boo = newQuestion(
        12345678, "test", ["Algebra"], "Junior (A)", undefined, "hello", undefined, undefined
    )
    if (boo) {
        responseString.push('successfully added to database');
        var boo2 = findQuestion({question: "test"}, ["hash"])
        if (boo2) {
            responseString.push('question found!');
        }
    }

    res.send(responseString.join(" "));
})

module.exports = router;
