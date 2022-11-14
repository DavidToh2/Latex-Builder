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
    console.log('initialising question addition\n');
    responseString.push('initialising question addition');
    var boo = newQuestion(
        12345678, "test", ["Algebra"], "Junior (A)", undefined, "hello", undefined, undefined
    )
    if (boo) {
        console.log('successfully added to database\n');
        responseString.push('successfully added to database');
        var boo2 = findQuestion({question: "test"}, ["hash"])
        if (boo2) {
            console.log('question found!\n');
            responseString.push('question found!');
        }
    }

    res.send(responseString.join(" "));
})

module.exports = router;
