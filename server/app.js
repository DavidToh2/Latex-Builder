// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/skeleton_website
		
		// Import all relevant JS modules

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const session = require('express-session');
const MongoStore = require('connect-mongo');
const { mongoose } = require('./db-connection')

		// Import routing files

const dbrouter = require('./routes/db-router')
const filerouter = require('./routes/file-router')
const authrouter = require('./routes/auth-router')

		// Initialise the app

const app = express();

		// Add middleware libraries using app.use()

app.use(logger('dev'));		
app.use(express.json());		// The following two libraries allow us to populate request bodies
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));	// allows us to serve static (i.e. unchanged) files from the /public directory.

		// Session configuration

const sessionOptions = {
	secret: process.env.COOKIE_SECRET,
	resave: true,
	saveUninitialized: false,
	cookie: {
		secure: true,
		httpOnly: true,
		maxAge: 1000 * 60 * 60 * 24
	},
	store: MongoStore.create({
		client: mongoose.connection.getClient(),
		dbName: 'sessions',
		autoRemove: 'interval',
		autoRemoveInterval: 10
	})
};
app.use(session(sessionOptions))

		// CORS Control

const allowedOrigins = ['placeholder']
if (process.env.NODE_ENV == 'development') {
	allowedOrigins.push('http://localhost:5173')
}
app.use(function(req, res, next) {
	const origin = req.get('origin')
	if (allowedOrigins.includes(origin)) {
		res.header("Access-Control-Allow-Origin", origin)
		res.header("Access-Control-Allow-Headers", "Content-Type")
		res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE")
	}
	next()
})

		// The following two lines map our application URLs to the routing modules.
		// Overall URL: [the stuff below]/[the stuff in the router module]

app.use('/database', dbrouter)
app.use('/file', filerouter)
app.use('/auth', authrouter)

		// Error handlers

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// render the error page
	console.log(err.message)
	console.log(err.cause)
	res.status(err.status || 500);
	res.send(err.message);
});

module.exports = app;
