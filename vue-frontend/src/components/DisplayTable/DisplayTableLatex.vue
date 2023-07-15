<script setup lang="ts">

    import type { latex } from '@/types/WorksheetTypes';
    import { reactive, ref } from 'vue';

    const props = defineProps<{
        content: latex
    }>()
    const latexContent = reactive(props.content)
    const latexActive = ref(false)

    function latexUpdate(e : Event) {
        latexActive.value = true
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
    function latexUpdateDone() {
        latexActive.value = false
        emits('updateLatex', latexContent)
    }

</script>
<template>
    <div class="latex-element-title">
        Raw latex
    </div>
    <div class="latex-container">
        <textarea class="latex-text" v-model="latexContent.text"
            @focusin="latexUpdate($event)" @keyup="latexUpdate($event)"
            @focusout="latexUpdateDone">
        </textarea>
    </div>
</template>
<style scoped>
.latex-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 5px;
}

.latex-title {
    font-weight: bold;
    font-size: var(--font-size-lg1);
}

</style>