<script setup lang="ts">

    import type { latexHeading } from '@/types/WorksheetTypes';
    import { reactive, ref } from 'vue';
    import SelectOptionsGrid from '../Common/SelectOptionsGrid.vue';

    const props = defineProps<{
        content: latexHeading
    }>()
    const latexHeadingContent = reactive(props.content)

    const headingTypeSelections = ['Section', 'Subsection', 'Sub-subsection']
    const headingTypes = ['section', 'subsection', 'subsubsection']
    function updateHeadingType(internalName : string) {
        const i = internalName as 'section' | 'subsection' | 'subsubsection'
        latexHeadingContent.type = i
        updateLatexHeading()
    }

    const emits = defineEmits<{
        (e: 'updateHeading', newHeading: latexHeading): void
    }>()
    function updateLatexHeading() {
        console.log("Updating")
        emits('updateHeading', latexHeadingContent)
    }

</script>
<template>
    <div class="latex-element-title">
        Heading
    </div>
    <div class="latex-heading-container">
        <div class="latex-heading-settings">
            <div class="latex-heading-settings-title">
                Type:
            </div>
            <div class="latex-heading-settings-type">
                <SelectOptionsGrid :columns="3"
                    :selections="headingTypeSelections" :internal-names="headingTypes"
                    :active-selection="latexHeadingContent.type"
                    @update="updateHeadingType"/>
            </div>
        </div>
        <div class="latex-heading-settings">
            <div class="latex-heading-settings-title">
                Name:
            </div>
            <div style="width: 100%;">
                <input class="latex-text input-sm latex-heading-settings-name" 
                    v-model="latexHeadingContent.text" @focusout="updateLatexHeading">
            </div>
        </div>
    </div>
</template>
<style scoped>

.latex-heading-settings {
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: center;
    width: 100%;
}
.latex-heading-container {
    display: grid;
    grid: auto / 60%;
    row-gap: 10px;
}

.latex-heading-settings-type {
    width: 100%;
}

.latex-heading-settings-name {
    width: 60%;
}
</style>