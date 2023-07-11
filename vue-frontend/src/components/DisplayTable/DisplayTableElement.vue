<script setup lang="ts">
import type { latex, latexEnum, latexHeading } from '@/types/WorksheetTypes';
import type { latexTypes, latexTypeNames } from '@/types/WorksheetTypes';

    const props = defineProps<{
        type: latexTypeNames
        content: latexTypes
        internalName: string
    }>()

    const emits = defineEmits<{
        (e: 'delete', ID: string): void
        (e: 'up'): void
        (e: 'down'): void
    }>()

    function deleteElement(ID : string) {
        emits('delete', ID)
    }
    function elementUp() {
        emits('up')
    }
    function elementDown() {
        emits('down')
    }

</script>
<template>
    <div class="display-table-entry-row">
        <div class="display-table-id display-table-cell" style="padding: 8px 0px; text-align: center;">
            
        </div>
        <div class="display-table-element display-table-cell">  
            <!-- content here -->
            <template v-if="type == 'latex'">
                Raw Latex
            </template>
            <template v-else-if="type == 'latexHeading'">
                Header
            </template>
            <template v-else-if="type == 'latexEnum'">
                List
            </template>
        </div>
        <div class="display-table-options display-table-cell">
            <div class="option-icons">
                <img class="icon-sm" src="@/assets/svg/delete-circle.svg" @click="deleteElement(content.id)">
                <div class="up-down-buttons">
                    <img class="icon-sm" src="@/assets/svg/angle-up.svg" @click="elementUp">
                    <img class="icon-sm" src="@/assets/svg/angle-down.svg" @click="elementDown">
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
</style>