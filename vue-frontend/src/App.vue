<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import { RouterView } from 'vue-router'
</script>

<template>
	<header>
		<Navbar />
	</header>
	<div class="container">
		<RouterView />
	</div>
</template>

<style scoped>

</style>
