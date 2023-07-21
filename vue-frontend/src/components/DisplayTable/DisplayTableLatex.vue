<script setup lang="ts">

    import type { latex } from '@/types/WorksheetTypes';
    import LatexInput from '@/components/Latex/LatexInput.vue'
    import { reactive, ref, watch } from 'vue';

    const props = defineProps<{
        content: latex,
    }>()
    const latexContent = reactive(props.content)
    const emits = defineEmits<{
        (e: 'updateLatex', newContent: latex): void 
    }>()

    watch(() => latexContent.text, (newT, oldT) => {
        emits('updateLatex', latexContent)
    })

</script>
<template>
    <div class="latex-element-title">
        Raw latex
    </div>
    <LatexInput v-model:latex="latexContent.text"/>
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