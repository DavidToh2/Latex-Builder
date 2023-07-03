<script setup lang="ts">
    import DisplayTableHeader from "./DisplayTableHeader.vue"
    import DisplayTableEntry from "./DisplayTableEntry.vue"
    import DisplayTableElementEnum from "./DisplayTableElementEnum.vue"
    import DisplayTableElementHeading from "./DisplayTableElementHeading.vue"
    import DisplayTableElement from "./DisplayTableElement.vue"
    import type { qn } from '@/types/Types'
    import type { worksheetElement, latex, latexHeading, latexEnum } from "@/types/WorksheetTypes"

    export interface Props {
        internalName: string
        elements?: worksheetElement[]
        qns?: qn[]
    }
    const props = defineProps<Props> ()

    const emits = defineEmits<{
        (e: 'insert', displayID: string, direction: string): void
        (e: 'delete', displayID: string): void
        (e: 'up', displayID: string): void
        (e: 'down', displayID: string): void
    }>()

    async function deleteObject(displayID: string) {
        emits('delete', displayID)
    }
    function insertObject(displayID : string, direction : string) {
        emits('insert', displayID, direction)
    }
    function objectUp(displayID : string) {
        emits('up', displayID)
    }
    function objectDown(displayID : string) {
        emits('down', displayID)
    }

</script>

<template>
    <div class="display-table">
        <DisplayTableHeader />
        <div v-if="internalName == 'database-table'">
            <div class="display-table-results" v-for="item in qns">
                <DisplayTableEntry :internalName="props.internalName + '-qn'" :q="item" @insert="insertObject" @delete="deleteObject" @up="objectUp" @down="objectDown"/>
            </div>
        </div>
        <div v-if="internalName == 'build-table'">
            <div class="display-table-results" v-for="item in elements">
                <DisplayTableEntry v-if="item.type == 'qn'" :internalName="props.internalName + '-qn'" :q="(item.body as qn)" @insert="insertObject" @delete="deleteObject" @up="objectUp" @down="objectDown"/>
                <DisplayTableElement v-else :internalName="props.internalName + '-element'" :content="(item.body as latex | latexEnum | latexHeading)" @insert="insertObject" @delete="deleteObject" @up="objectUp" @down="objectDown"/>
            </div>
        </div>
    </div>
</template>

<style scoped>


.display-table {
    padding: 0px 10px;
    --display-table-id-width: 40px;
    --display-table-topic-width: 130px;
    --display-table-difficulty-width: 80px;
    --display-table-source-width: 70px;
    --display-table-options-width: 80px;
    --display-table-questions-width: calc(100% - var(--display-table-id-width) - var(--display-table-topic-width) - var(--display-table-difficulty-width) - var(--display-table-source-width) - var(--display-table-options-width));
    --display-table-element-width: calc(100% - var(--display-table-id-width) - var(--display-table-options-width));
    flex-grow: 1;
    width: 100%;
}

.display-table-results {
    width: 100%;
    display: flex;
    flex-direction: column;
    font-size: 14px;
}

.display-table :deep(.display-table-entry-row) {
    width: 100%;
    display: flex;
    flex-direction: row;
}

.display-table :deep(.display-table-cell) {
    padding: 10px 8px;
    flex-shrink: 0;
    flex-grow: 0;
}

.display-table :deep(.display-table-id) {
    flex-basis: var(--display-table-id-width);
}
.display-table :deep(.display-table-question) {
    flex-basis: var(--display-table-questions-width);
    white-space: pre;
}
.display-table :deep(.display-table-topic) {
    flex-basis: var(--display-table-topic-width);
}
.display-table :deep(.display-table-difficulty) {
    flex-basis: var(--display-table-difficulty-width);
}
.display-table :deep(.display-table-source) {
    flex-basis: var(--display-table-source-width);
}
.display-table :deep(.display-table-options) {
    flex-basis: var(--display-table-options-width);
}

.display-table :deep(.display-table-element) {
    flex-basis: var(--display-table-element-width);
}

.display-table :deep(.option-icons) {
    display: flex;
    flex-direction: row;
    gap: 3px;
    align-items: center;
    justify-content: center;
}

</style>