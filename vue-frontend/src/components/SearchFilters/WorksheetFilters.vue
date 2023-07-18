<script setup lang="ts">

    import Input from './Input.vue'
    import PopupMenu from '../Common/Popup/PopupMenu.vue'
    import TemplateSelect from '@/components/TemplateSelect/TemplateSelect.vue'
    import PageSettings from '@/components/PageSettings/PageSettings.vue'

    import { reactive, ref } from 'vue'
    import type { worksheetConfig } from '@/types/WorksheetTypes'
    import { emptyWorksheetConfig } from '@/types/WorksheetTypes'

    const props = defineProps<{
        wsConfig: worksheetConfig
    }>()

    const wsConfig = reactive({...props.wsConfig})
</script>

<template>
    <div class="ws-filters-container">
        <div class="ws-filters ws-name">
            <Input description="Document Name" internalName="documentName" dropdownDir="column" style="margin-bottom: 10px;"
                :activeInput="wsConfig.documentName"/>
        </div>
        <div class="ws-filters ws-info">
            <Input description="Title" internalName="title"
                :activeInput="wsConfig.title.title" />
            <Input description="Author" internalName="author"
                :activeInput="wsConfig.title.author" />
            <Input description="Date" internalName="date" 
                :activeInput="wsConfig.title.date"/>
        </div>
        <div class="ws-filters ws-template">
            <PopupMenu description="Template">
                <TemplateSelect />
            </PopupMenu>
        </div>
        <div class="ws-filters ws-page">
            <PageSettings :pageSettings="wsConfig.page"/>
        </div>
    </div>
</template>

<style scoped> 
.ws-filters-container {
    width: 100%;
    display: grid;
    grid: auto / repeat(3, 33%);
    gap: 10px;
    padding: 20px;
}

.ws-filters {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.ws-page {
    grid-column: 1 / span 3;
}

</style>