<script setup lang="ts">
import Input from './Input.vue';
import HoverMenu from './HoverMenu.vue';
</script>

<template>
    <div class="worksheet-filters-row">
        <div class="worksheet-filters">
            <HoverMenu description="Custom Packages" />
        </div>
        <div class="worksheet-filters">
            <Input description="Title" internalName="title" />
            <Input description="Author" internalName="author" />
            <Input description="Date" internalName="date" />
        </div>
        <div class="worksheet-filters">
            <HoverMenu description="Headers/Footers" />
        </div>
    </div>
</template>

<style scoped> 
.worksheet-filters-row {
    display: flex;
    align-items: center;
    padding: 10px;
    gap: 10px;
    width: 100%
}
.worksheet-filters {
    height: 100%;
    width: calc((100% - 30px) / 3);
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 0px 7px;
    gap: 7px;
}
</style>