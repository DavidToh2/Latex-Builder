// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/skeleton_website
		
		// Import all relevant JS modules

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

		// Import routing modules

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();                              	// Initialise the app

		// Initialise viewing engine using app.set()

app.set('views', path.join(__dirname, 'views'));	// Set template storage folder
app.set('view engine', 'pug');						// Set view engine name

		// Add middleware libraries using app.use()

app.use(logger('dev'));		
app.use(express.json());		// The following two libraries allow us to populate request bodies
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));	// allows us to serve static (i.e. unchanged) files from the /public directory.

		// The following two lines map our application URLs to the routing modules.
		// Overall URL: [the stuff below]/[the stuff in the router module]

app.use('/', indexRouter);			
app.use('/users', usersRouter);


		// Error handlers

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
