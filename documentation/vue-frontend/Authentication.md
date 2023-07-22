# Introduction

This document describes how authentication state is handled and stored in the front-end.

## User Store

The local user store stores user data, as well as authentication status, about the currently logged-in user.

- To modify user data, use the member function `setUserData()`. 
- To modify authentication status, use the member function `setAuthStatus()`.

The [Pinia-plugin-persistedState](https://github.com/prazdevs/pinia-plugin-persistedstate) plugin is used to persist user data across multiple sessions. This plugin can be activated by adding the following lines of code:
```js
// main.ts
pinia.use(piniaPluginPersistedState)

// userStore.ts
export const useUserStore = defineStore('userStore', () => {
    // store settings here
}, {
    persist: true
})
```

## Authentication Checks (Frontend)

When the page is first mounted, a POST request is sent to the backend that populates user data as well as authentication status, based on any available session cookies on the user's browser.

If the user is logged in and the session cookie has not expired, their authentication status is set.

```js
onMounted(async() => {
	if (await isAuth()) {
		UserStore.setAuthStatus(true)
		await populateUserInfo()
	} else {
		UserStore.clearUserData()
		UserStore.setAuthStatus(false)
	}
})
```

This allows components to simply access the User Store to determine what to load, instead of having to individually make requests to the backend.

```js
if (!UserStore.getAuthStatus()) {
    UserStore.openPopup("You need to be logged in to contribute questions!")
}
```

The backend checks the user authentication status by checking for the presence of a Session Cookie with corresponding, valid UserID stored. In order to allow the POST request to send these cookies, add the option `credentials: 'include'` in the fetch API.