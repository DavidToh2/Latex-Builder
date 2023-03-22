<script setup lang="ts">
    import SearchTableHeader from "./SearchTableHeader.vue"
    import SearchTableResult from "./SearchTableResult.vue"
    import type { qn } from '@/types/Types'
    import { useQuestionStore } from '@/stores/stores'
    import { postForm } from '@/post'

    export interface Props {
        qns?: qn[]
    }
    const props = defineProps<Props> ()

    const emits = defineEmits<{
        (e: 'delete', displayID: string): void
    }>()

    const QuestionStore = useQuestionStore()
    function moveQuestionToContribute(displayID : string) {
        QuestionStore.insertFromDatabaseToContribute(displayID)
    }
    async function deleteQuestionFromDatabase(displayID: string) {
        emits('delete', displayID)
    }

</script>

<template>
    <div class="search-table">
        <SearchTableHeader />
        <div class="search-table-results" v-for="item in qns"> 
            <SearchTableResult :q="item" @edit="moveQuestionToContribute" @delete="deleteQuestionFromDatabase"/>
        </div>
    </div>
</template>

<style scoped>


.search-table {
    margin: 0px 10px;
    --search-id-width: 40px;
    --search-topic-width: 130px;
    --search-difficulty-width: 80px;
    --search-source-width: 70px;
    --search-options-width: 80px;
    --search-questions-width: calc(100% - var(--search-id-width) - var(--search-topic-width) - var(--search-difficulty-width) - var(--search-source-width) - var(--search-options-width))
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

</style>