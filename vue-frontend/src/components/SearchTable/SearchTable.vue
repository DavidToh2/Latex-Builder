<script setup lang="ts">
    import SearchTableHeader from "./SearchTableHeader.vue"
    import SearchTableResult from "./SearchTableEntry.vue"
    import type { qn } from '@/types/Types'

    export interface Props {
        internalName: string
        qns?: qn[]
    }
    const props = defineProps<Props> ()

    const emits = defineEmits<{
        (e: 'insert', displayID: string, direction: string): void
        (e: 'delete', displayID: string): void
        (e: 'up', displayID: string): void
        (e: 'down', displayID: string): void
    }>()

    async function deleteQuestionFromDatabase(displayID: string) {
        emits('delete', displayID)
    }
    function insertQuestion(displayID : string, direction : string) {
        emits('insert', displayID, direction)
    }
    function questionUp(dispID : string) {
        emits('up', dispID)
    }
    function questionDown(dispID : string) {
        emits('down', dispID)
    }

</script>

<template>
    <div class="search-table">
        <SearchTableHeader />
        <div class="search-table-results" v-for="item in qns"> 
            <SearchTableResult :internalName="props.internalName + '-qn'" :q="item" @insert="insertQuestion" @delete="deleteQuestionFromDatabase" @up="questionUp" @down="questionDown"/>
        </div>
    </div>
</template>

<style scoped>


.search-table {
    padding: 0px 10px;
    --search-id-width: 40px;
    --search-topic-width: 130px;
    --search-difficulty-width: 80px;
    --search-source-width: 70px;
    --search-options-width: 80px;
    --search-questions-width: calc(100% - var(--search-id-width) - var(--search-topic-width) - var(--search-difficulty-width) - var(--search-source-width) - var(--search-options-width));
    flex-grow: 1;
    width: 100%;
}

.search-table-results {
    width: 100%;
    display: flex;
    flex-direction: column;
    font-size: 14px;
}

.search-table :deep(.search-cell) {
    padding: 10px 8px;
    flex-shrink: 0;
    flex-grow: 0;
}

.search-table :deep(.search-id) {
    flex-basis: var(--search-id-width);
}
.search-table :deep(.search-question) {
    flex-basis: var(--search-questions-width);
    white-space: pre;
}
.search-table :deep(.search-topic) {
    flex-basis: var(--search-topic-width);
}
.search-table :deep(.search-difficulty) {
    flex-basis: var(--search-difficulty-width);
}
.search-table :deep(.search-source) {
    flex-basis: var(--search-source-width);
}
.search-table :deep(.search-options) {
    flex-basis: var(--search-options-width);
}

.search-table :deep(.option-icons) {
    display: flex;
    flex-direction: row;
    gap: 3px;
    align-items: center;
    justify-content: center;
}

</style>