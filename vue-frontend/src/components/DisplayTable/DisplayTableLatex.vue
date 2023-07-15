<script setup lang="ts">

    import type { latex, latexEnum, latexHeading } from '@/types/WorksheetTypes';
    import { reactive, onUpdated } from 'vue';

    const props = defineProps<{
        content: latex
    }>()
    const latexContent = reactive(props.content)

    function updateHeight(e : Event) {
        const t = e.target as HTMLTextAreaElement
        updateTextareaHeight(t)
    }
    function updateTextareaHeight(t : HTMLTextAreaElement) {
        t.style.height = '1px'
        t.style.height = (14 + t.scrollHeight) + 'px'
    }

    const emits = defineEmits<{
        (e: 'updateLatex', newContent: latex): void
    }>()
    function updateLatex() {
        emits('updateLatex', latexContent)
    }

</script>
<template>
    <div class="display-table-entry-row">
        <textarea class="latex-text" v-model="latexContent.text"
            @focusin="updateHeight($event)" @keyup="updateHeight($event)"
            @focusout="updateLatex()">
        </textarea>
    </div>
</template>
<style scoped>
.latex-content {
    border: 1px solid black;
    width: 100%;
}

</style>