<script setup lang="ts">



</script>

<template>
    <form id="signup-form">
        <label for="signup-user-input">Username</label>
        <input id="signup-user-input" name="user-input" class="input-sm">

        <label for="signup-user-input">Email</label>
        <input id="signup-user-input" name="user-input" class="input-sm" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$">

        <label for="signup-password-input" id="signup-password-input-prompt" class="tooltip">Password</label>
        <input id="signup-password-input" name="password-input" class="input-sm" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}">
        
        <label for="signup-password-input">Retype password</label>
        <input id="signup-password-input-2" name="password-input-2" class="input-sm" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}">

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