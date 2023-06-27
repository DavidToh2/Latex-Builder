<script setup lang="ts">

import { authLogin } from '@/post/postAuth'

async function loginUser() {
    const f = document.querySelector('form#login-form') as HTMLFormElement
    const responsejson = await authLogin(f)
    if (responsejson.status == -1) {
	    // Error occured
	    const error = responsejson.error
        console.log(error)
    } else if (responsejson.status == 1) {
        // Failure
        console.log("Login failed!")
    } else {
        // Success
        const data = responsejson.body
        console.log(data)
    }
}

</script>

<template>
    <form id="login-form" @submit.prevent="loginUser">
        <label for="login-user-input">Username or Email Address</label>
        <input id="login-user-input" name="username" class="input-sm">
        <label for="login-password-input">Password</label>
        <input id="login-password-input" name="password" class="input-sm">

        <input id="login-submit" type="submit" class="btn" value="Sign in">
    </form>

</template>

<style scoped>

#login-form {
    border: 1px solid var(--colour-border);
    background-color: var(--colour-background-soft);
    border-radius: 3px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 20px;
    width: 100%;
}
</style>