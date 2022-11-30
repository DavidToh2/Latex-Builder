<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import { RouterView } from 'vue-router'
</script>

<template>

	<Navbar class="navbar" />

	<div class="container-main" id="container-left">
		<RouterView name="left" />
	</div>
	<div class="container-main" id="container-right">
		<RouterView name="right" />
	</div>

</template>

<style scoped>

.navbar {
	grid-column: 1 / span 2;
	background-color: #004607;
	width: 100%;
	height: 64px;
	display: flex;
	position: relative;
	justify-content: right;
	align-items: center;
	padding-right: 100px;
}

.container-main {
	display: block;
	position: relative;
	width: 100%;
	height: calc(100vh - 64px);
	overflow-y: scroll;
}


#container-left {
	border-right: 1px solid #888888;
}

</style>
