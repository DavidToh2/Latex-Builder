<script setup lang="ts">

import { ref, computed } from 'vue'

import { authLogin } from '@/post/postAuth'
import type { userData } from '@/types/UserTypes'
import type { UserError, ServerError } from '@/types/ErrorTypes'
import { formatErrorMessage } from '@/types/ErrorTypes'

import { useUserStore } from '@/stores/userStore'
const UserStore = useUserStore()

const loginFail = ref(false)
const loginFailMessage = ref('')

async function loginUser() {
    const f = document.querySelector('form#login-form') as HTMLFormElement
    const responsejson = await authLogin(f)
    if (responsejson.status == -1) {
	    // Error occured

	    const error = responsejson.error as ServerError
        const errorMsg = formatErrorMessage(error)
        emits('login-error', errorMsg)

    } else if (responsejson.status == 1) {
        // Failure

	    const error = responsejson.body as UserError
        const errorMsg = error.cause
        loginFailure(errorMsg)

    } else {
        // Success
        
        loginFailure('')

        const data = responsejson.body as userData
        UserStore.setUserData(data)
        UserStore.setAuthStatus(true)

        emits('login-success')
    }
}

function loginFailure(msg : string) {
    if (msg) {
        loginFail.value = true
        loginFailMessage.value = msg
    } else {
        loginFail.value = false
        loginFailMessage.value = ''
    }
}

function turnOffLoginFailure() {
    loginFail.value = false
}

const emits = defineEmits<{
    (e: 'login-success'): void
    (e: 'login-error', error: string): void
}>()

const pwdDisplay = ref(false)
const pwdInputType = computed<string>(() => {
    if (pwdDisplay.value) {return "text"} else {return "password"}
})

</script>

<template>
    <form id="login-form" @submit.prevent="loginUser" autocomplete="off" @click="turnOffLoginFailure">

        <div class="err-text" v-if="loginFail">{{ loginFailMessage }}</div>

        <label for="login-user-input">Username or Email Address</label>
        <input id="login-user-input" name="username" class="input-sm" autocomplete="off">
        <label for="login-password-input">Password</label>
        <input id="login-password-input" name="password" class="input-sm" :type="pwdInputType" autocomplete="off">

        <div style="display: flex; flex-direction: row; gap: 10px;">
            <label for="login-show-password" style="font-size: 12px">Show password:</label>
            <input type="checkbox" v-model="pwdDisplay">
        </div> 

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