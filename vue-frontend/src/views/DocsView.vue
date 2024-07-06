<script setup lang="ts">
import { ref } from 'vue';
const docs_url = ref("https://docs.towelet.app/")
if (import.meta.env.MODE == 'development') {
    docs_url.value = "http://localhost:6174/"
}

</script>
<template>
    <iframe :src="docs_url" class="docs-page"></iframe>
</template>
<style>

.docs-page {
    display: grid;
    grid-template: 100% / 20% 75%;
    gap: 5px;
    padding: 5px;
    height: 100%;
    width: 100%;
    border: 0;
    border-right: 1px solid var(--colour-border);
}

</style>
