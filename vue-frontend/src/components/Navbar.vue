<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
    <ul class="navbar-list">
        <li class="navbar-item"><RouterLink to="/">Home</RouterLink></li>
        <li class="navbar-item"><RouterLink to="/build">Build</RouterLink></li>
        <li class="navbar-item"><RouterLink to="/contribute">Contribute</RouterLink></li>
        <li class="navbar-item"><RouterLink to="/login">Login</RouterLink></li>
    </ul>
</template>

<style scoped>

.navbar-list {
    list-style: none;
    display: flex;
    align-items: flex-start;
}

.navbar-item > a {
    width: max-content;
    text-decoration: none;
    color: #ffffff;
    font-size: 26px;
    font-weight: 600;
    padding: 0px 24px;
}

.navbar-item:hover {
    background-color: #002504;
    font-weight: 800;
    cursor: pointer;
}

</style>