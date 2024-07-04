# Introduction

- [Introduction](#introduction)
- [Express](#express)
	- [Response Format](#response-format)
- [CORS](#cors)
	- [Network Request Procedure](#network-request-procedure)
	- [CORS does not protect against external scripts](#cors-does-not-protect-against-external-scripts)


# Express

ExpressJS uses a system of middlewares, which are functions that "pass on control" to other functions. Based on their positions in the codebase, all middleware functions are arranged in a "running sequence/chain" from first to last. For our app, the "running sequence" looks like this:

```js
	app.use('/*', (req, res, next) => {
		// CORS validation
	})
	app.use('/database', dbrouter)
	app.use('/file', filerouter)
	app.use('/auth', authrouter)
	// ...
```

When a request is received, it will be passed through the chain of middlewares, from the start all the way to the end. Every single middleware will be checked, and:
- Routes matching the request parameters are triggered and run.
- All `router.use()` middleware is run.
- The `next()` callback passes control onto the next triggered middleware.
- The process terminates when some middleware `send()`s the `res`ponse back to the client.

Authentication middleware specifications are described in [Authentication](./Authentication.md).

## Response Format

The request format is documented in the front-end. Routers should pass the request bodies wholesale to database functions.

Responses should be formatted according to the following specifications, defined under the `ResponseBody` and `ResponseError` classes respectively:
```js
response: {
	fn: // What is the purpose of the response?
	// Usually, this will be equal to req.body['fn'] or req.body['fn']-error.

	status: // 0 for success, 1 for user failure, -1 for server error

	// if success, body field will be present
	body: {
		[data here]
	},

	// if error, error field will be present
	error: {
		name:
		message:
		cause:
		status:
	}
}
res.json(response)
```
Responses should be formatted by the database functions, not the router functions.

Responses will be passed verbatim from the higher-level post functions directly to the Vue components for preprocessing. Vue components can access the response state like so:
```js
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

Cross-Origin Resource Sharing is a mechanism that prevents external webpages, or scripts, from accessing your website or server's resources. The CORS standard is enforced for all webpage or script requests invoked using `fetch()` or `XMLHttpRequest`.

Since our entire app is reliant on the functions in `post`, which use `fetch()`, we need to configure CORS to allow our front-end to communicate with our server. In `app.js`,

1. Set an array of allowed origins.
2. Check if the request is coming from an allowed origin. If it is, set the `Access-Control-Allow-Origin`, `-Headers` and `-Methods` headers in your response object.
3. The response will only be sent if the request parameters adhere to the restrictions imposed by the three headers above. (I think this check is automatically done by Express and our browser.)
4. To allow session cookies to be received and set by the server, set the `Access-Control-Allow-Credentials` header as well.

The aforementioned headers are necessary for every single request/response under the CORS standard.

```js
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
```

In the front-end,

1. The `Content-Type` must be set.
2. Set an array of `Allowed` content-types for the response payload. For example, `'Accept': 'application/pdf, image/png, image/svg+xml'`

## Network Request Procedure

We describe the procedure by which the front-end fetches a resource, or submits data, to the back-end.

**Part 1: pre-flight checks**

1. The front-end initiates a pre-flight request using the `OPTIONS` method.
   - The pre-flight request contains the relevant `Access-Control-Request-Headers`, `-Methods`, and the `Origin` headers. 
2. The back-end identifies the OPTIONS method as a pre-flight request, and sends back a `200 OK` response. 
   - The `Access-Control-Allow-` versions of the headers are sent back if and only if the origin is permitted.
3. The browser checks if the webpage, or script, sending the request satisfies the allowed conditions listed above. 
   - The browser only allows the main request to be sent if all the checks are passed.
   
**Part 2: resource request**

4. The front-end sends the main resource request or submission using the `POST` method.
5. The routing middleware `isAuthenticated` checks for the presence of a valid user ID in the session cookie, and if so, validates that the user is authenticated.
6. Backend functions are called.
7. The back-end sends the response payload according to the format described above.

[Pre-flight Request Tutorial](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request)

## CORS does not protect against external scripts

**CORS does not protect against third party programmes (like `curl`) or scripts outside browsers accessing your API!** For example, the command

```sh
curl -d "{'id': 1}" https://server.towelet.app/database/get
```

will be successfully processed by the server.