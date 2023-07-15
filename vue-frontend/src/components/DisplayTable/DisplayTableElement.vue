<script setup lang="ts">

import DisplayTableLatex from './DisplayTableLatex.vue';
import DisplayTableLatexEnum from './DisplayTableLatexEnum.vue';
import DisplayTableLatexHeading from './DisplayTableLatexHeading.vue';
import { reactive, ref } from 'vue';
import type { latex, latexEnum, latexHeading, worksheetElement } from '@/types/WorksheetTypes';
import type { latexTypes, latexTypeNames } from '@/types/WorksheetTypes';
import { useQuestionStore } from '@/stores/questionStore';

const QuestionStore = useQuestionStore()

    const props = defineProps<{
        item: worksheetElement
        internalName: string
    }>()

    const itemContent = reactive(props.item.body)
    const itemType = ref(props.item.type)
    const id = ref(itemContent.id)

    const emits = defineEmits<{
        (e: 'delete', ID: string): void
        (e: 'up'): void
        (e: 'down'): void
        (e: 'allowDrag', status: boolean): void
    }>()

    function deleteElement() {
        emits('delete', id.value)
    }
    function elementUp() {
        emits('up')
    }
    function elementDown() {
        emits('down')
    }
    function elementFocused() {
        emits('allowDrag', false)
    }
    function elementUnfocused() {
        emits('allowDrag', true)
    }
    function updateElement(newContent : latexTypes) {
        const newItem : worksheetElement = {
            type: itemType.value,
            body: newContent
        }
        QuestionStore.updateElement('build', id.value, newItem)
    }

</script>
<template>
    <div class="display-table-entry-row">
        <div class="display-table-id display-table-cell" style="padding: 8px 0px; text-align: center;">
            
        </div>
        <div class="display-table-element display-table-cell" @focusin="elementFocused" @focusout="elementUnfocused">  
            <!-- content here -->
            <template v-if="itemType == 'latex'">
                <DisplayTableLatex 
                    :content="(itemContent as latex)"
                    @update-latex="updateElement"/>
            </template>
            <template v-else-if="itemType == 'latexHeading'">
                <DisplayTableLatexHeading />
                Header
            </template>
            <template v-else-if="itemType == 'latexEnum'">
                <DisplayTableLatexEnum />
                List
            </template>
        </div>
        <div class="display-table-options display-table-cell">
            <div class="option-icons">
                <img class="icon-sm" src="@/assets/svg/delete-circle.svg" @click="deleteElement()">
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