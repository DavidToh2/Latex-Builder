<script setup lang="ts">

    import { ref, computed, watch } from 'vue';

    const props = withDefaults(defineProps<{
        latex: string,
        height?: string,
        placeholder?: string
    }>(), {
        height: 'fit-content',
        placeholder: ''
    })
    const emits = defineEmits<{
        (e: 'update:latex', n: string): void
    }>()
    const latexContent = ref(props.latex)
    watch(() => props.latex, (newL, oldL) => {
        latexContent.value = newL
    })

    const fixedHeight = computed<boolean>(() => {
        if (['fit-content'].includes(props.height)) {
            return true
        } else {
            return false
        }
    })

    function latexShow(event : Event) {
        const t = event.target as HTMLTextAreaElement
        if (!fixedHeight) {
            updateTextareaHeight(t)
        }
    }

    function latexUpdate(event : KeyboardEvent) {
        const t = event.target as HTMLTextAreaElement
        if ((t.classList as DOMTokenList).contains("latex-text")) {
            switch(event.code) {
                case "Tab":
                    event.preventDefault()
                    const ss = t.selectionStart
                    const se = t.selectionEnd
                    const v = t.value
                    t.value = v.substring(0, ss) + '\t' + v.substring(se)
                    t.selectionEnd += 1
                break
            }
        }
        if (!fixedHeight) {
            updateTextareaHeight(t)
        }
    }

    function latexUpdateDone() {
        emits('update:latex', latexContent.value)
    }

    function updateTextareaHeight(t : HTMLTextAreaElement) {
        t.style.height = '1px'
        t.style.height = (14 + t.scrollHeight) + 'px'
    }

</script>
<template>
    <div class="latex-container">
        <textarea class="latex-text" v-model="latexContent" :placeholder="placeholder"
            @focusin="latexShow($event)" @keydown="latexUpdate($event)"
            @focusout="latexUpdateDone()">
        </textarea>
    </div>
</template>
<style scoped>

.latex-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 12px;
    padding: 10px;
    height: v-bind(height)
}

</style>