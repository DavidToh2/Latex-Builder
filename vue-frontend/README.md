# Introduction

This document serves to detail the features developed for the Latex Builder front-end webpage.

# Request Format

Requests are formatted using `post.ts`, which implements the functions `post()`, `postJSON()` and `postForm()` in the front-end. Front-end requests are made using the format
```
await fetch(url, {
	method,
	headers: {
		content-type: 'text/html' OR 'text-plain'
	},
	body: JSON.stringify(jsonObject)
	// body includes 'fn' entry, describing purpose of request
})
```

# Authentication

## User Store

The local user store stores user data, as well as authentication status, about the currently logged-in user.

- To modify user data, use the member function `setUserData()`. 
- To modify authentication status, use the member function `setAuthStatus()`.

**NOTE: Pinia Store data has not been refresh-proofed. Consider using localStorage or sessionStorage instead**
https://github.com/prazdevs/pinia-plugin-persistedstate

## Authentication Checks (Frontend)

When the user updates the page, whether by navigation or by reload, a **Navigation Guard** automatically sends a POST request to the backend to update the user authentication status in the User Store.

```
router.beforeEach(async (to, from) => {
	const userStore = useUserStore()
	if (await isAuth()) {
		userStore.setAuthStatus(true)
	} else {
		userStore.setAuthStatus(false)
	}
	return true
})
```

This allows components to simply access the User Store to determine what to load, instead of having to individually make requests to the backend.

The backend checks the user authentication status by checking for the presence of a Session Cookie with corresponding, valid UserID stored. In order to allow the POST request to send these cookies, add the option `credentials: 'include'` in the fetch API.