<script setup lang="ts">

</script>

<template>
    <div class="display-table-header-row">
        <div class="display-table-id display-table-header display-table-cell">
            ID
        </div>
        <div class="display-table-topic display-table-header display-table-cell">
            Topics
        </div>
        <div class="display-table-difficulty display-table-header display-table-cell">
            Difficulty
        </div>
        <div class="display-table-source display-table-header display-table-cell">
            Source
        </div>
        <div class="display-table-options display-table-header display-table-cell">
            Options
        </div>
    </div>
</template>

<style scoped>

.display-table-header-row {
    display: flex;
    flex-direction: row;
    overflow: auto;
}
 
.display-table-header {
    background-color: #D9D9D9;
    font-size: 16px;
}

</style>