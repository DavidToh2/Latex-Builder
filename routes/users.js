var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log("Hello")
    res.send('respond with a resource noooo')
})

router.get('/cool', function(req, res, next) {
	res.render('index', { title: 'cool'})
})

module.exports = router;
