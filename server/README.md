# Introduction

This document serves to detail the features developed for the Latex Builder server.

- [Introduction](#introduction)
- [Introduction to Express](#introduction-to-express)
	- [Response Format](#response-format)
- [CORS](#cors)
	- [Networking Procedure](#networking-procedure)
- [Error Handling](#error-handling)
	- [Local Error Handlers](#local-error-handlers)
	- [Global Error Handlers](#global-error-handlers)
- [Authentication and Login Systems](#authentication-and-login-systems)
	- [Session Store](#session-store)
	- [Logging In](#logging-in)
	- [Authentication Check (Backend)](#authentication-check-backend)
- [Scripting Latex](#scripting-latex)

# Introduction to Express

ExpressJS uses a system of middlewares, which are functions that "pass on control" to other functions. Based on their positions in the codebase, all middleware functions are arranged in a "running sequence/chain" from first to last

When a request is received, it will be passed through the chain of middlewares, from the start all the way to the end. 
- Routes matching the request parameters are triggered and run.
- All `router.use()` middleware is run.

The `next()` callback passes control onto the next triggered middleware.

## Response Format

The request format is documented in the front-end. Routers should pass the request bodies wholesale to database functions.

Responses should be formatted according to the following specifications, defined under the `ResponseBody` and `ResponseError` classes respectively:
```
response: {
	fn: [what is the nature of the response?],
	// Usually, this will be equal to req.body['fn'] or req.body['fn']-error.

	status: [0 for success, 1 for user failure, -1 for server error]

	// if success, body field will be present
	body: {
		[data here]
	},

	// if error, error field will be present
	error: {
		type: [user error or database error],
		desc: [string describing error (high-level)],
		cause: [string describing error (low-level)]
	}
}
res.json(response)
```
Responses should be formatted by the database functions, not the router functions.

Responses will be passed verbatim from the higher-level post functions directly to the Vue components for preprocessing. Vue components can access the response state like so:
```
if (responsejson.status == -1) {
	// Error occured
	const error = responsejson.error

} else if (responsejson.status == 1) {
	// Failure

} else {
	// Success
	const data = responsejson.body
}
```

# CORS

Cross-Origin Resource Sharing is a mechanism that prevents external webpages from accessing your website or server's resources. We need to configure CORS to allow our front-end to communicate with our server.

In `app.js`,

1. Set an array of allowed origins.
2. Check if the request is coming from an allowed origin. If it is, set the `Access-Control-Allow-Origin`, `-Headers` and `-Methods` headers in your response object.
3. The response can only be sent if the request parameters adhere to the restrictions imposed by the three headers above.
4. To allow session cookies to be received and set by the server, set the `Access-Control-Allow-Credentials` header as well.

## Networking Procedure

We describe the procedure by which the front-end fetches a resource, or submits data, to the back-end.

1. The front-end initiates a **pre-flight request** using the `OPTIONS` method.
2. The back-end identifies the OPTIONS method as a pre-flight request, and sends back a `200 OK` response.
3. The front-end sends the main resource request or submission using the `POST` method.

# Error Handling

There are four types of errors that the server should be able to catch:

| Error Type              | Example Causes                                                                                                                                                                                                     | Error Handler        | Rationale                                                                                                                                                                                                                                                             | HTML Code     | Response Status |
|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|-----------------|
| Network/Resource Errors | Incorrect requests to **unavailable routes/files**, or **misconfigured CORS**                                                                                                                                      | Global Error Handler | <li>Network errors should immediately terminate the request chain and bypass all the available routes, so should be globally handled.</li> <li>Network errors should (obviously) return a HTTP Error.</li>                                                            | Network Error |                 |
| Code Errors             | **Mistakes in source code**                                                                                                                                                                                        |                      |                                                                                                                                                                                                                                                                       |               |                 |
| Database Errors         | <li>Errors caused by **Mongoose misbehaving**, such as insertion, search or deletion errors</li> <li>**Unexpected data behaviour**, such as misconfigured JSON or impossible scenarios (e.g. duplicate users)</li> | Local Error Handler  | <li>Details regarding database errors should be passed onto the end user, to inform them regarding the internal error. (May be changed in production)</li> <li>Database errors should return a HTTP Error, as the back-end has failed to function as expected.</li>   | 200           | -1              |
| User Errors             | **Illegal user behaviour**, such as login email having two '@'s, user already signed up, mistakes in LaTeX                                                                                                         | Local Error Handler  | <li>Details regarding user errors should be passed onto the end user, so that they can amend the error.</li> <li>User errors are functionally identical to failed requests, and are part and parcel of normal app functions, so should return a normal response.</li> | 200 (OK)      | 1               |

Error handlers are identified as using callback functions with these four variables:
```
router.use(function(err, req, res, next) {
	// Error handler here
})
```

## Local Error Handlers

Local error handlers are implemented at the bottom of every individual router.
```
router.use(function(err) {
	// If user error, return normal response containing user error and failed response code
	if (err instanceof UserError) {
		const response = new ResponseBody()
		response.status = 1
		response.fn = `${req.body['fn']}-UserError`
		response.body = [error here]
	}

	// If database error or unknown (runtime) error, return error
	else {
		const response = new ResponseError()
		response.status = -1
		response.fn = `${req.body['fn']}-Error`
		response.error = [error here]
	}
})
```

## Global Error Handlers

Global error handlers are implemented at the bottom of the `app.js` file. They serve to catch network errors.

# Authentication and Login Systems

We use `express-session`, built-in middleware that implements a session management system, using a **Store**. We use `connect-mongo` for the SessionStore, which will be attached to our main database.

JSON Web Tokens (JWTs) are a more modern form of session authentication that are arguably more secure, as the tokens are not stored on the server (i.e. are stateless) and can be encrypted and decrypted by the server as necessary.

## Session Store

The following cookies will be stored in the user's session storage:
```
Session ID: [generated by express-session]
User ID: [sent by server upon successful login]
```

Session data is stored in the server's SessionStore in this format. The session ID is hashed using the secret in our `.env` folder.
```
{ Encrypted Session ID, { Attached Session Data } }
```

The SessionStore is set up in `app.js`.

## Logging In

Sessions are first initialised on login. The session token is regenerated, creating a new session token, and the user ID is directly stored in the session data.

```
const nU = await authenticateUser(userData)
if (nU) {
	response.status = 0
	req.session.regenerate((err) => {if(err) next(err)})
	req.session.uID = nU['id']
}
```

Other user data, such as username and social info, are directly sent back via the response to be stored in the local UserStore. For more information, refer to the frontend documentation.
```
	response.body['username'] = nU['username']
	response.body['socialInfo'] = nU['socialInfo']
```

## Authentication Check (Backend)

We can access the SessionStore simply by invoking `req.session`. This will fetch our current user's session ID (stored in the user's session data), check it against our SessionStore, then (if present) fetch all other session data.

This allows us to authenticate users simply by checking the SessionStore for session data (i.e. `req.session.uID`) corresponding to their current session ID.
```
db-auth.js:
function isAuthenticated() {
	if (req.session.uID) next()
	else next('route')		// skips to the next route definition
}
```

Routers can use this function as a callback:
```
router.post(route1, isAuthenticated, <function to execute if authenticated>)
router.post(route1, <function to execute if unauthenticated>)
```

[Documentation for `express-session`](https://www.npmjs.com/package/express-session?activeTab=readme)

[Documentation for `connect-mongo`](https://www.npmjs.com/package/connect-mongo)

[How session tokens and session validation work (StackExchange)](https://security.stackexchange.com/questions/255762/is-this-a-right-technique-to-create-and-validate-session-tokens)

[Express session middleware](https://stackoverflow.com/questions/73049959/express-session-middleware-to-check-authentication)

[Using `express-session` and MongoDB to manage sessions](https://developer.okta.com/blog/2021/06/07/session-mgmt-node)

# Scripting Latex

Drive. To implement ability to:
- upload .tex and .pdf files
- view .pdf files
- remove files

Latex compiler. To implement ability to:
- collate build into a .tex file, and:
	- export as .tex file
	- compile into .pdf, then export as .pdf. The file will not be saved
	- compile into .pdf, then save both .tex and .pdf in drive