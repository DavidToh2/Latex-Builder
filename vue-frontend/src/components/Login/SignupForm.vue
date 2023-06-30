<script setup lang="ts">

import { authSignup } from '@/post/postAuth'
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'

async function signupUser() {
    const f = document.querySelector('form#signup-form') as HTMLFormElement
    const p1 = f.querySelector('input[name="password"]') as HTMLInputElement
    const p2 = f.querySelector('input[name="password-2"]') as HTMLInputElement
    if (p1.value == p2.value) {
        const responsejson = await authSignup(f)
        if (responsejson.status == -1) {
            // Error occured
            const error = responsejson.error
            console.log(error)

        } else if (responsejson.status == 1) {
            // Failure

        } else {
            // Success
            const data = responsejson.body
            console.log(data)
        }
    }
}

const pwdDisplay = ref(false)

const pwdInputType = computed<string>(() => {
    if (pwdDisplay.value) {return "text"} else {return "password"}
})


</script>

<template>
    <form id="signup-form" method="post" @submit.prevent="signupUser">
        <label for="signup-user-input">Username</label>
        <input id="signup-user-input" name="username" class="input-sm" pattern="[\w\-_]+">

        <label for="signup-user-input">Email</label>
        <input id="signup-user-input" name="email" class="input-sm" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$">

        <label for="signup-password-input" id="signup-password-input-prompt" class="tooltip" style="border-bottom: 2px dotted black">Password</label>
        <input :type="pwdInputType" id="signup-password-input" name="password" class="input-sm" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}">
        
        <label for="signup-password-input">Retype password</label>
        <input :type="pwdInputType" id="signup-password-input-2" name="password-2" class="input-sm" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}">

        <div style="display: flex; flex-direction: row; gap: 10px;">
            <label for="signup-show-password" style="font-size: 12px">Show password:</label>
            <input type="checkbox" v-model="pwdDisplay">
        </div>

        <input id="signup-submit" type="submit" class="btn" value="Sign up">
    </form>

</template>

<style scoped>

#signup-form {
    border: 1px solid var(--colour-border);
    background-color: var(--colour-background-soft);
    border-radius: 3px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 20px;
    width: 100%;
}

#signup-form > label {
    width: fit-content;
}

#signup-password-input-prompt::after {
    content: "(Must contain at least one uppercase letter, one lowercase letter and one number, and a total of at least 8 characters)";
    position: absolute;
    width: 250px;
    font-size: var(--font-size-sm1);
    z-index: 10;
    display: none;
}

#signup-password-input-prompt:hover::after{
    display: block;
}
</style>