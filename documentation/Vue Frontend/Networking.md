# Introduction

This document details the formats used in the front-end's networking.

## Request Format

All requests are handled by the helper files `postAuth.ts`, `postFile.ts` and `postQn.ts`, which implement separate helper functions for every single possible use-case requiring server communication.
- `postAuth.ts`: login, logout, signup and authentication
- `postFile.ts`: getting PDF and images
- `postQn.ts`: setting, getting, and deleting question and question permissions

Requests are formatted using `post.ts`, which implements the functions `post()`, `postJSON()` and `postGetFile()` in the front-end. Front-end requests are made using the format
```js
await fetch(url, {
	method,
	headers: {
		'Content-Type': 'text/html' OR 'application/json';
        'Accept': // response data types
	},
	body: JSON.stringify(jsonObject)
	// body includes 'fn' entry, describing purpose of request
})
```

## Response Handling

Exact response format can be found in the [Server Networking](../server/network-requests.md) documentation.

On receipt of a response, `post.ts` will pass the response data back to the helper functions, which then parse the response data back into `JSON` or `BLOB` (for files) format, before passing the data back to the components that requested said data.

Components will generally handle response data as such:
- Check the response's status code.
  - If status code is -1, then server or database error occured. Format the error message to include all error information, then display a popup.
  - If status code is 1, then user-caused error occured. Only display the error cause in the popup.
  - If status code is 0, carry on with regular functions.
```js
const responsejson = await questionSave(active, active.id)
if (responsejson.status == -1) {
    // Error occured
    const error = responsejson.error as ServerError
    const errormsg = formatErrorMessage(error)
    UserStore.openPopup(errormsg)
} else if (responsejson.status == 1) {
    // Failure
    const error = responsejson.body as UserError
    const errormsg = error.cause
    UserStore.openPopup(errormsg)
} else {
    // Success logic here
}
```
- For file requests, components will check the response's data type instead.
  - If the response is a `BLOB`, then the request was successful.
  - If the response is a `JSON` object, then an error was returned. The component will proceed to check the response's status code.
```js
const svgResponse = await getImage('preview')
if (svgResponse instanceof Blob) {
    // Success
} else {
    if (svgResponse.status == -1) {
        // Error occured
    } else if (svgResponse.status == 1) {
        // Failure
    }
}
```

While this response handling procedure is highly reusable, it has been implemented manually in all components in order to allow for flexibility in how different components handle errors. 

For example, in `SingupForm.vue`, the errors are displayed as red text above the signup form, instead of in a popup.
