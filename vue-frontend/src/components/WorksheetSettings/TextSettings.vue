<script setup lang="ts">

    import Input from '@/components/SearchFilters/Input.vue';
    import type { worksheetText } from '@/types/WorksheetTypes'

    import { reactive, ref } from 'vue';

    const inputFontSize = ref(16)

    const props = defineProps<{
        textSettings: worksheetText
    }>()
    const wsText = reactive({...props.textSettings})

    const paragraphSettings = ['paragraphIndent', 'paragraphSpacing']

    function updateParagraph(s : string, internalName : string) {
        if (paragraphSettings.includes(internalName)) {
            const i = internalName as 'paragraphIndent' | 'paragraphSpacing'
            wsText[i]= s
        }
        updateText()
    }

    const emits = defineEmits<{
        (e: 'update', newText: worksheetText): void
    }>()

    function updateText() {
        emits('update', wsText)
    }

</script>
<template>
    <div class="text-settings-container">
        <div class="subheader">
            Text Settings
        </div>
        <div class="text-settings">
            <div class="text-indent">
                <div class="subsubheader">
                    Paragraph Formatting:
                </div>
                <Input description="Indentation" internal-name="paragraphIndent" :font-size="inputFontSize"
                    :active-input="wsText.paragraphIndent"
                    @update="updateParagraph"/>
                <Input description="Spacing" internal-name="paragraphSpacing" :font-size="inputFontSize"
                    :active-input="wsText.paragraphSpacing"
                    @update="updateParagraph"/>
            </div>
        </div>
    </div>
</template>
<style scoped>

.text-settings-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 10px 0px;
    border-top: 1px solid var(--colour-border);
}

.text-settings {
    display: grid;
    grid: auto / repeat(3, calc(33% - 10px));
    gap: 10px;
}

.text-indent {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>