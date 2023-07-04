<script setup lang="ts">
import type { latex, latexEnum, latexHeading } from '@/types/WorksheetTypes';
import { latexTypeStrings } from '@/types/WorksheetTypes';
import { computed } from 'vue';

    const props = defineProps<{
        type: 'latex' | 'latexEnum' | 'latexHeading',
        content: latex | latexEnum | latexHeading,
        internalName: string
    }>()

    const emits = defineEmits<{
        (e: 'insert', displayID: string, direction: string): void
        (e: 'delete', displayID: string): void
        (e: 'up', displayID: string): void
        (e: 'down', displayID: string): void
    }>()

    function deleteElement(dispID : string) {
        emits('delete', dispID)
    }
    function elementUp(dispID : string) {
        emits('up', dispID)
    }
    function elementDown(dispID : string) {
        emits('down', dispID)
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
                <img class="icon-sm" src="@/assets/svg/delete-circle.svg" @click="deleteElement(content.displayID)">
                <div class="up-down-buttons">
                    <img class="icon-sm" src="@/assets/svg/angle-up.svg" @click="elementUp(content.displayID)">
                    <img class="icon-sm" src="@/assets/svg/angle-down.svg" @click="elementDown(content.displayID)">
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
</style>