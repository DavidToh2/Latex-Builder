<script setup lang="ts">
import type { latex, latexEnum, latexHeading } from '@/types/WorksheetTypes';
import { computed } from 'vue';

    const props = defineProps<{
        content: latex | latexEnum | latexHeading,
        internalName: string
    }>()

    const emits = defineEmits<{
        (e: 'insert', displayID: string, direction: string): void
        (e: 'delete', displayID: string): void
        (e: 'up', displayID: string): void
        (e: 'down', displayID: string): void
    }>()

    function insertQuestion(dispID : string, direction : string) {
        emits('insert', dispID, direction)
    }
    function deleteQuestion(dispID : string) {
        emits('delete', dispID)
    }
    function questionUp(dispID : string) {
        emits('up', dispID)
    }
    function questionDown(dispID : string) {
        emits('down', dispID)
    }
    
    const isBuild = computed<boolean>(() => {
        return (props.internalName == 'build-table-qn')
    })

</script>
<template>
    <div class="display-table-entry-row">
        <div class="display-table-id display-table-cell" style="padding: 8px 0px; text-align: center;">
            {{ content.displayID }}
        </div>
        <div class="display-table-element display-table-cell">  
            <!-- content here -->
        </div>
        <div class="display-table-options display-table-cell">
            <div class="option-icons">
                <img class="icon-sm" src="@/assets/svg/delete-circle.svg" @click="deleteQuestion(content.displayID)">
                <div class="up-down-buttons" v-if="isBuild">
                    <img class="icon-sm" src="@/assets/svg/angle-up.svg" @click="questionUp(content.displayID)">
                    <img class="icon-sm" src="@/assets/svg/angle-down.svg" @click="questionDown(content.displayID)">
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
</style>