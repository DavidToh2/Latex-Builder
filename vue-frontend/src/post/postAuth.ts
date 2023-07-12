import { postForm, postJSON } from './post'
import { BASE_URL } from './post'
import type { userData } from '@/types/UserTypes'

/*
        AUTHENTICATION FUNCTIONS
        User data stored in Pinia Store
        User ID stored in session data (to allow us to use req.session.uID)
        Session ID stored in session data

        login(): Logs user in
        signup(): Signs user up
        logout(): Logs user out
*/


export async function authSignup(f : HTMLFormElement) {
    const response = await postForm(f, `${BASE_URL}/auth/signup`, 'auth-signup') as Response
    const responsejson = await response.json()
    return responsejson
}
export async function authLogin(f : HTMLFormElement) {
    const response = await postForm(f, `${BASE_URL}/auth/login`, 'auth-login') as Response
    const responsejson = await response.json()
    return responsejson
}
export async function authLogout() {
    var j = { fn: 'auth-logout' }
    const response = await postJSON(j, `${BASE_URL}/auth/logout`) as Response
    const responsejson = await response.json()
    return responsejson
}
export async function isAuth() {
    var j = { fn: 'auth-check' }
    const response = await postJSON(j, `${BASE_URL}/auth/check`) as Response
    const responsejson = await response.json()
    const authStatus = responsejson['isAuth'] as Number
    return authStatus
}
export async function authGetUserInfo() {
    var j = { fn: 'auth-get' }
    const response = await postJSON(j, `${BASE_URL}/auth/get`) as Response
    const responsejson = await response.json()
    return responsejson
}
export async function searchUser(u : string) {
    var j = { fn: 'check-user', username: u }
    const response = await postJSON(j, `${BASE_URL}/auth/search/user`)
    const responsejson = await response.json()
    return responsejson
}
export async function searchGroup(u : string) {
    var j = { fn: 'check-group', groupname: u }
    const response = await postJSON(j, `${BASE_URL}/auth/search/group`)
    const responsejson = await response.json()
    return responsejson
}