<script setup lang="ts">

import LoginForm from '@/components/Login/LoginForm.vue'
import SignupForm from '@/components/Login/SignupForm.vue'
import Account from '@/components/Login/Account.vue'
import Popup from '@/components/Common/Popup/Popup.vue'

import { useUserStore } from '@/stores/userStore';
import { useQuestionStore } from '@/stores/questionStore';
import { ref, onActivated } from 'vue'
import { authGetUserInfo, isAuth } from '@/post/postAuth';

import type { userData } from '@/types/UserTypes'
import type { UserError, ServerError } from '@/types/ErrorTypes'
import { formatErrorMessage } from '@/types/ErrorTypes'

const displayPopup = ref(false)
const popupMessage = ref('')

const UserStore = useUserStore()
const QuestionStore = useQuestionStore()
const c = UserStore.getAuthStatus() as boolean

const isLoggedIn = ref(c)
const isSigningUp = ref(false)


function popup(msg : string) {
    popupMessage.value = msg
    displayPopup.value = true
}

function closePopup() {
    popupMessage.value = ''
    displayPopup.value = false
}
function loginSuccess() {
    popup("Login successful!")
    pageStatusLogin()
}
function pageStatusLogin() {
    isLoggedIn.value = true
}

function signupSuccess() {
    popup("Signup successful!")
    pageStatusSignupToggle()
}
function pageStatusSignupToggle() {
    const t : boolean = isSigningUp.value
    isSigningUp.value = !t
}

function pageStatusLogout() {
    isLoggedIn.value = false
    QuestionStore.resetBuild()
    QuestionStore.resetContribute()
    QuestionStore.resetDatabase()

    popupMessage.value = "Logged out!"
    displayPopup.value = true
}

onActivated(async () => {
    if (await isAuth()) {
        const responsejson = await authGetUserInfo()
        if (responsejson.status == -1) {
            // Error occured
            const error = responsejson.error as ServerError
            const errormsg = formatErrorMessage(error)
            console.log(errormsg)
        } else if (responsejson.status == 1) {
            // Failure
            const error = responsejson.body as UserError
            const errorMsg = error.cause
            console.log(errorMsg)
        } else if (responsejson.status == 0) {
            const ud = responsejson.body as userData
            UserStore.setAuthStatus(true)
            UserStore.setUserData(ud)
        }
    }
})

</script>

<template>
    <div class="viewport">
        <div id="login-form-container" v-if="!isLoggedIn">

            <div class="login-container" v-if="!isSigningUp">
                <div id="login-title">
                    Sign into Latex Builder
                </div>
                <LoginForm @login-success="loginSuccess" @login-error="popup"/>
                <div id="login-signup-prompt"> 
                    Or, <div class="btn-textlink" v-on:click="pageStatusSignupToggle">sign up</div> if you don't have an account
                </div>
            </div>

            <div class="login-container" v-else>
                <div id="login-title">
                    Create an Account
                </div>
                <SignupForm @signup-success="signupSuccess" @signup-error="popup"/>
                <div id="signup-login-prompt"> 
                    Or, <div class="btn-textlink" v-on:click="pageStatusSignupToggle">log in</div> if you already have an account
                </div>
            </div>

            <Popup :isActive="displayPopup" @close="closePopup">
                <span v-html="popupMessage"></span>
            </Popup>

        </div>

        <Account @logout="pageStatusLogout" v-else/>
    </div>

</template>

<style scoped>

#login-form-container {
    width: 300px;
    align-self: center;
    margin-top: 50px;
    margin-bottom: 20px;

    display: flex;
    flex-direction: column;
}

.login-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    gap: 10px;
}

#login-title {
    font-size: 26px;
}
</style>