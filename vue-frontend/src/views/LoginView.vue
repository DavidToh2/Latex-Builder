<script setup lang="ts">

import LoginForm from '@/components/Login/LoginForm.vue'
import SignupForm from '@/components/Login/SignupForm.vue'

</script>

<template>
    <div id="login-form-container">
        <div id="login-title">
            Sign into Latex Builder
        </div>
        <div id="login-container">
            <LoginForm />
        </div>
        <div id="signup-prompt"> 
            Or, sign up if you don't have an account
        </div>
        <div id="signup-container">
            <SignupForm />
        </div>
    </div>

    <div id="user-homepage">
        Welcome, user!
    </div>

</template>

<style scoped>

#login-form-container {
    width: 300px;
}

#login-title {
    align-self: center;
    margin-top: 50px;
    margin-bottom: 20px;
    font-size: 26px;
}

#login-container {
    display: flex;
    width: 100%;
    justify-content: center;
}

#signup-prompt {
    margin: 20px 0px;
}

</style>