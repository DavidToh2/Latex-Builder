<script setup lang="ts">

import LoginForm from '@/components/Login/LoginForm.vue'
import SignupForm from '@/components/Login/SignupForm.vue'
import Account from '@/components/Login/Account.vue'

import { useUserStore } from '@/stores/userStore';
import { getCurrentInstance, ref } from 'vue'
import type { ComponentInternalInstance, ComponentPublicInstance } from 'vue';

const UserStore = useUserStore()
const c = UserStore.getAuthStatus() as boolean

const isLoggedIn = ref(c)
const isSigningUp = ref(false)

function pageStatusLogin() {
    isLoggedIn.value = true
}
function pageStatusLogout() {
    isLoggedIn.value = false
}
function pageStatusSignupToggle() {
    const t : boolean = isSigningUp.value
    isSigningUp.value = !t
}

</script>

<template>
    <div id="login-form-container" v-if="!isLoggedIn">

        <div class="login-container" v-if="!isSigningUp">
            <div id="login-title">
                Sign into Latex Builder
            </div>
            <LoginForm @login="pageStatusLogin"/>
            <div id="login-signup-prompt"> 
                Or, <div class="btn-textlink" v-on:click="pageStatusSignupToggle">sign up</div> if you don't have an account
            </div>
        </div>

        <div class="login-container" v-else>
            <div id="login-title">
                Create an Account
            </div>
            <SignupForm />
            <div id="signup-login-prompt"> 
                Or, <div class="btn-textlink" v-on:click="pageStatusSignupToggle">log in</div> if you already have an account
            </div>
        </div>
    </div>

    <Account @logout="pageStatusLogout" v-else/>

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