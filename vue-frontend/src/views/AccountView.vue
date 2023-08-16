<script setup lang="ts">

import LoginForm from '@/components/Login/LoginForm.vue'
import SignupForm from '@/components/Login/SignupForm.vue'
import Account from '@/components/Login/Account.vue'

import { useUserStore } from '@/stores/userStore';
import { useQuestionStore } from '@/stores/questionStore';
import { ref, onActivated } from 'vue'

const UserStore = useUserStore()
const c = UserStore.getAuthStatus() as boolean

const isLoggedIn = ref(c)
const isSigningUp = ref(false)


function popup(msg : string) {
    UserStore.openPopup(msg)
}

        // Login

async function loginSuccess() {
    popup("Login successful!")
    pageStatusLogin()
}
function pageStatusLogin() {
    isLoggedIn.value = true
}

        // Signup

function signupSuccess() {
    popup("Signup successful!")
    pageStatusSignupToggle()
}
function pageStatusSignupToggle() {
    const t : boolean = isSigningUp.value
    isSigningUp.value = !t
}

        // Logout

function pageStatusLogout() {
    isLoggedIn.value = false
    popup("Logged out!")
}

        // Password change

function pageStatusPasswordChange(b : boolean) {
    if (b) {
        popup("Password successfully changed! Please re-login to your account.")
        isLoggedIn.value = false
    }
}

        // User data change

        // User deleted

function pageStatusUserDeleted() {
    isLoggedIn.value = false
    popup("Your user has been deleted. We hope to see you again!")
}

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

        </div>

        <Account @logout="pageStatusLogout" 
            @change-password="pageStatusPasswordChange"
            @delete-user="pageStatusUserDeleted"
            v-else/>
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