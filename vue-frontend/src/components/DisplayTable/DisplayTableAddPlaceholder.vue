<script setup lang="ts">

const props = defineProps<{
    text: string
}>()

</script>
<template>
    <div class="display-table-entry-row">
        <div class="display-table-id display-table-cell" style="padding: 8px 0px; text-align: center;">
            
        </div>
        <div class="display-table-element display-table-cell" id="dragging-placeholder">  
            Add LaTeX
        </div>
        <div class="display-table-options display-table-cell">
            
        </div>
    </div>
</template>
<style scoped>
#dragging-placeholder {
    font-weight: bold;
    font-size: var(--font-size-lg1);
}
</style>