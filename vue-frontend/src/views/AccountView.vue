<script setup lang="ts">

import LoginForm from '@/components/Login/LoginForm.vue'
import SignupForm from '@/components/Login/SignupForm.vue'
import Account from '@/components/Login/Account.vue'

import { useUserStore } from '@/stores/userStore';
import { ref } from 'vue'

import Popup from '@/components/Common/Popup/Popup.vue'

const displayPopup = ref(false)
const popupMessage = ref('')

const UserStore = useUserStore()
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
function pageStatusLogin() {
    console.log("pageStatusLogin")
    isLoggedIn.value = true
}

function pageStatusSignupToggle() {
    popup("Signup successful!")
    
    console.log("pageStatusSignupToggle")
    const t : boolean = isSigningUp.value
    isSigningUp.value = !t
}

function pageStatusLogout() {
    console.log("pageStatusLogout")
    isLoggedIn.value = false
    popupMessage.value = "Logged out!"
    displayPopup.value = true
}

</script>

<template>
    <div class="viewport">
        <div id="login-form-container" v-if="!isLoggedIn">

            <div class="login-container" v-if="!isSigningUp">
                <div id="login-title">
                    Sign into Latex Builder
                </div>
                <LoginForm @login-success="pageStatusLogin" @login-error="popup"/>
                <div id="login-signup-prompt"> 
                    Or, <div class="btn-textlink" v-on:click="pageStatusSignupToggle">sign up</div> if you don't have an account
                </div>
            </div>

            <div class="login-container" v-else>
                <div id="login-title">
                    Create an Account
                </div>
                <SignupForm @signup-success="pageStatusSignupToggle" @signup-error="popup"/>
                <div id="signup-login-prompt"> 
                    Or, <div class="btn-textlink" v-on:click="pageStatusSignupToggle">log in</div> if you already have an account
                </div>
            </div>

            <Popup :isActive="displayPopup" @close="closePopup">
                <template #popup-content>
                    <span v-html="popupMessage"></span>
                </template>
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