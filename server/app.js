// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/skeleton_website
		
		// Import all relevant JS modules

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

		// Import routing modules

var dbrouter = require('./routes/dbrouter')
var filerouter = require('./routes/filerouter')

var app = express();                              	// Initialise the app

		// Add middleware libraries using app.use()

app.use(logger('dev'));		
app.use(express.json());		// The following two libraries allow us to populate request bodies
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));	// allows us to serve static (i.e. unchanged) files from the /public directory.

		// The following two lines map our application URLs to the routing modules.
		// Overall URL: [the stuff below]/[the stuff in the router module]

app.use('/database', dbrouter)
app.use('/file', filerouter)


		// Error handlers

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// render the error page
	res.status(err.status || 500);
	res.send(err.message);
});

module.exports = app;
