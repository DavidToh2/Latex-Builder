<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
    <nav class="navbar">
        <ul class="navbar-list">
            <li><RouterLink to="/">Home</RouterLink></li>
            <li><RouterLink to="/build">Build a Problem Sheet</RouterLink></li>
            <li><RouterLink to="/add">Add a Problem</RouterLink></li>
        </ul>
    </nav>
</template>