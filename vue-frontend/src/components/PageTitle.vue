<script setup lang="ts">

const props = defineProps<{
    title: string
}>()

</script>

<template>
    <div class="title textbox">
        {{ title }}
    </div>
</template>

<style scoped>
.title {
    width: 100%;
    height: 70px;
    font-size: var(--font-size-title1);
    padding-left: 35px;
    flex-shrink: 0;
}
</style>