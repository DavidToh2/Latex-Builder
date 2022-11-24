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
    font-size: 32px;
    margin-left: 35px;
}
</style>