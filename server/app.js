// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/skeleton_website
		
		// Import all relevant JS modules

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const session = require('express-session');
const MongoStore = require('connect-mongo');
const { mongoose, mongoURI } = require('./src/db/db-connection')

		// Import routing files

const dbrouter = require('./routes/db-router')
const filerouter = require('./routes/file-router')
const authrouter = require('./routes/auth-router');
const { UserError, DatabaseError, ServerError } = require('./src/express-classes/error');
const { ResponseBody, ResponseError } = require('./src/express-classes/response');

	

		// Initialise the app

const app = express();

// (async() => {

		// Add middleware libraries using app.use()

app.use(logger('dev'));		
app.use(express.json());		// The following two libraries allow us to populate request bodies
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));	// allows us to serve static (i.e. unchanged) files from the /public directory.

		// Session configuration

console.log(`MongoURI is ${mongoURI}`)


mongoose.connection.once('open', () => {
	const sessionOptions = {
		secret: process.env.COOKIE_SECRET,
		resave: true,
		saveUninitialized: false,
		cookie: {
			secure: false,
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24
		},
		store: MongoStore.create({
			client: mongoose.connection.getClient(),
			dbName: 'sessions',
			autoRemove: 'interval',
			autoRemoveInterval: 10
		})
	}
	app.use(session(sessionOptions))
	console.log("Initialised session store!")

		// CORS Control

	const allowedOrigins = ['placeholder']
	if ((process.env.NODE_ENV.trim() == 'development') || (process.env.NODE_ENV.trim() == 'production')) {
		allowedOrigins.push('http://localhost:5173')
	}
	app.use('/*', (req, res, next) => {
		const origin = req.get('origin')
		if (allowedOrigins.includes(origin)) {
			res.header("Access-Control-Allow-Origin", origin)
			res.header("Access-Control-Allow-Headers", "Content-Type")
			res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE")
			res.header("Access-Control-Allow-Credentials", true)
		}
		if (req.method == "OPTIONS") {
			return res.status(200).end()
		}
		next()
	})

			// The following two lines map our application URLs to the routing modules.
			// Overall URL: [the stuff below]/[the stuff in the router module]

	app.use('/database', dbrouter)
	app.use('/file', filerouter)
	app.use('/auth', authrouter)

	console.log("Routes mounted!")

			// Error handlers

	app.use(function(err, req, res, next) {

		console.log("Application error handler:")
		console.log(err)

		if (err instanceof UserError) {
			const response = new ResponseBody()
			response.status = 1
			response.fn = `${req.body['fn']}-UserError`
			response.body = {
				name: err.name,
				message: err.message,
				cause: err.cause,
				status: err.status
			}

			res.json(response)
		} else if (err instanceof DatabaseError || err instanceof ServerError) {
			const response = new ResponseError()
			response.status = -1
			response.fn = `${req.body['fn']}-ServerError`
			response.error = {
				name: err.name,
				message: err.message,
				cause: err.cause,
				status: err.status
			}

			res.status(502)
			res.json(response)
		}
	})

	// Catch 404 and forward to error handler
	app.use(function (req, res, next) {
		next(createError(404));
	})

	// Network/Resource Error Handler
	app.use(function (err, req, res, next) {
		// render the error page
		console.log("Global error handler:")
		console.log(err)
		res.status(err.status || 500)
		res.send(err.message)
	})

	console.log("Initialisation complete!")
})

// })

module.exports = app
