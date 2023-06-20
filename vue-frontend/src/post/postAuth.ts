import type { userData } from '@/types/Types'
import { postForm, postJSON } from '@/post/post'
import { BASE_URL } from '@/post/post'

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
    const response = await postForm(f, `http://${BASE_URL}/auth/signup`, 'auth-signup') as Response
    const responsejson = await response.json()
    return responsejson
}
export async function authLogin(f : HTMLFormElement) {
    const response = await postForm(f, `http://${BASE_URL}/auth/login`, 'auth-login') as Response
    const responsejson = await response.json() as userData
    // Fetches user data
    return responsejson
}
export async function authLogout() {
    var j = { fn: 'auth-logout' }
    const response = await postJSON(j, `http://${BASE_URL}/auth/logout`) as Response
    const responsejson = await response.json()
    return responsejson
}
export async function isAuth() {
    var j = { fn: 'auth-check' }
    const response = await postJSON(j, `http://${BASE_URL}/auth/check`) as Response
    const responsejson = await response.json()
    return responsejson['isAuth'] as boolean
}