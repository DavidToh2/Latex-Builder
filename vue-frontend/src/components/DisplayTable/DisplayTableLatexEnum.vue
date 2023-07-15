<script setup lang="ts">

    import type { latex, latexEnum, latexHeading } from '@/types/WorksheetTypes';
    import { reactive } from 'vue';

    const props = defineProps<{
        content: latexEnum
    }>()
    const latexEnum = reactive(props.content)

</script>
<template>
    <div class="display-table-entry-row">
        Latex Element Enum
    </div>
</template>
<style scoped>
</style>