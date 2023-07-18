<script setup lang="ts">

    import Input from './Input.vue'
    import PopupMenu from '../Common/Popup/PopupMenu.vue'
    import TemplateSelect from '@/components/WorksheetSettings/TemplateSelect.vue'
    import PageSettings from '@/components/WorksheetSettings/PageSettings.vue'
    import TextSettings from '../WorksheetSettings/TextSettings.vue'

    import { reactive, ref } from 'vue'
    import type { worksheetConfig, worksheetPage, worksheetText } from '@/types/WorksheetTypes'
    import { emptyWorksheetConfig } from '@/types/WorksheetTypes'
    import { useQuestionStore } from '@/stores/questionStore'

    const QuestionStore = useQuestionStore()

    const props = defineProps<{
        wsConfig: worksheetConfig
    }>()

    const wsConfig = reactive({...props.wsConfig})

    function updateTitle(s : string, internalName : string) {
        if (['title', 'author', 'date'].includes(internalName)) {
            const i = internalName as 'title' | 'author' | 'date'
            wsConfig.title[i] = s
        }
        QuestionStore.setBuildWorksheetTitle(wsConfig.title)
    }

    function updatePage(p : worksheetPage) {
        QuestionStore.setBuildWorksheetPage(p)
    }

    function updateText(t : worksheetText) {
        QuestionStore.setBuildWorksheetText(t)
    }

</script>

<template>
    <div class="ws-filters-container">
        <div class="ws-filters ws-info">
            <Input description="Title" internalName="title"
                :activeInput="wsConfig.title.title"
                @update="updateTitle"/>
            <Input description="Author" internalName="author"
                :activeInput="wsConfig.title.author"
                @update="updateTitle"/>
            <Input description="Date" internalName="date" 
                :activeInput="wsConfig.title.date"
                @update="updateTitle"/>
        </div>
        <div class="ws-filters ws-template">
            <PopupMenu description="Template">
                <TemplateSelect />
            </PopupMenu>
        </div>
        <div class="ws-filters ws-page">
            <PageSettings :page-settings="wsConfig.page"
                @update="updatePage"/>
        </div>
        <div class="ws-filters ws-text">
            <TextSettings :text-settings="wsConfig.text"
                @update="updateText"/>
        </div>
    </div>
</template>

<style scoped> 
.ws-filters-container {
    width: 100%;
    display: grid;
    grid: auto / repeat(2, 33%);
    gap: 10px;
    padding: 20px;
}

.ws-filters {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.ws-page, .ws-text {
    grid-column: 1 / span 3;
}

</style>