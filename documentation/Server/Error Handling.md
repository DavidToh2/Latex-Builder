# Introduction

This file documents the format used by the backend server for error handling.

- [Introduction](#introduction)
- [Error Types and Formats](#error-types-and-formats)
  - [User Errors](#user-errors)
  - [Server and Database Errors](#server-and-database-errors)
- [Error Handling](#error-handling)
  - [Local Error Handlers](#local-error-handlers)
  - [Global Error Handlers](#global-error-handlers)


# Error Types and Formats

There are four types of errors that the server should be able to catch:

| Error Type              | Example Causes                                                                                                                                                                                                     | Error Handler        | Rationale                                                                                                                                                                                                                                                             | HTML Code     | Response Status |
|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|-----------------|
| Network/Resource Errors | Incorrect requests to **unavailable routes/files**, or **misconfigured CORS**                                                                                                                                      | Global Error Handler | <li>Network errors should immediately terminate the request chain and bypass all the available routes, so should be globally handled.</li> <li>Network errors should (obviously) return a HTTP Error.</li>                                                            | Network Error |                 |
| Code Errors             | **Mistakes in source code**                                                                                                                                                                                        |                      |                                                                                                                                                                                                                                                                       |               |                 |
| Database Errors         | <li>Errors caused by **Mongoose misbehaving**, such as insertion, search or deletion errors</li> <li>**Unexpected data behaviour**, such as misconfigured JSON or impossible scenarios (e.g. duplicate users)</li> | Local Error Handler  | <li>Details regarding database errors should be passed onto the end user, to inform them regarding the internal error. (May be changed in production)</li> <li>Database errors should return a HTTP Error, as the back-end has failed to function as expected.</li>   | 200           | -1              |
| User Errors             | **Illegal user behaviour**, such as login email having two '@'s, user already signed up, mistakes in LaTeX                                                                                                         | Local Error Handler  | <li>Details regarding user errors should be passed onto the end user, so that they can amend the error.</li> <li>User errors are functionally identical to failed requests, and are part and parcel of normal app functions, so should return a normal response.</li> | 200 (OK)      | 1               |

## User Errors

User errors are caused by illegal user behaviour or invalid requests, and typically are expected as part of normal app operations. These errors should thus be formatted similarly to regular server responses.

User errors are formatted as a `ResponseBody()`:
```js
    const response = new ResponseBody()
    response.status = 1
    response.fn = // function of request
    response.body = {
        name: 'UserError'
        message: // Error message, typically application defined
        cause: // Error cause, typically error output from underlying function
        status: // Error status (currently unused)
    }
```
## Server and Database Errors

Server and Database errors are caused by unexpected and abnormal software behaviour, and should be reported as such.

They are formatted as a `ResponseError()`:
```js
    const response = new ResponseError()
    response.status = -1
    response.fn = // function of request
    response.error = {
        name: 'ServerError' | 'DatabaseError'
        message: // Error message, typically application defined
        cause: // Error cause, typically error output from underlying function
        status: // Error status (currently unused)
    }
```
The small semantic difference leaves the door open for other error-handling methods for these errors.

# Error Handling

Error handlers are identified as using callback functions with these four variables:
```
router.use(function(err, req, res, next) {
	// Error handler here
})
```

## Local Error Handlers

A local error handler is implemented at the end of the `app.js` stack, and will specifically catch application-defined errors.
```js
if (err instanceof UserError) {
    // ...
    res.json(response)
} else if (err instanceof DatabaseError || err instanceof ServerError) {
    // ...
    res.status(502)
    res.json(response)
}
```

## Global Error Handlers

Global error handlers are implemented at the bottom of the `app.js` file. They serve to catch network and code errors, as well as uncaught application errors.