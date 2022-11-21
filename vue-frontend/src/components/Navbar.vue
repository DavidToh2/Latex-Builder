<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
    <nav class="navbar">
        <ul class="navbar-list">
            <li class="navbar-item"><RouterLink to="/">Home</RouterLink></li>
            <li class="navbar-item"><RouterLink to="/build">Build</RouterLink></li>
            <li class="navbar-item"><RouterLink to="/add">Contribute</RouterLink></li>
        </ul>
    </nav>
</template>

<style scoped>
.navbar-list {
    list-style: none;
    display: flex;
    align-items: flex-start;
}

.navbar-item {
    width: max-content;
    padding: 0px 20px;
    text-decoration: none;
    color: #ffffff;
    font-size: 1.6rem;
}

.navbar-item:hover {
    background-color: #550055;
    font-weight: 500;
    cursor: pointer;
}

</style>