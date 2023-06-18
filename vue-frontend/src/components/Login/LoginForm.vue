<script setup lang="ts">



</script>

<template>
    <form id="login-form">
        <label for="login-user-input">Username or Email Address</label>
        <input id="login-user-input" name="user-input" class="input-sm">
        <label for="login-password-input">Password</label>
        <input id="login-password-input" name="password-input" class="input-sm">

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