<script setup lang="ts">
import Title from '@/components/PageTitle.vue'
import QuestionFilters from '@/components/QuestionFilters/QuestionFilters.vue'
import SearchTable from '@/components/SearchTable/SearchTable.vue'

import type { qn } from '@/types/Types'
import { useQuestionStore } from '@/stores/stores'
import { post } from '@/post'

const mainStore = useQuestionStore()

var results : qn[] = []

async function submitSearchQuery(e : Event) {

    const response = await post(e, 'http://localhost:3000/database/get') as Response
    
    const responsejson = response.json() as unknown as qn[]
    mainStore.populateDatabase(responsejson)
    getResultsFromStore()
}

const getResultsFromStore = () => {
    results = mainStore.getDatabase()
}

</script>

<template>
    <Title title="Database" />
    <form id="question-search-container" autocomplete="false" @submit.prevent="submitSearchQuery($event)">
        <QuestionFilters func="database" />
        <textarea rows="1" id="question-search" name="question" placeholder="Search question text"></textarea>
        <input type="submit" hidden>
    </form>
    <SearchTable :qns="results" />
</template>

<style scoped>

#question-search-container {
    width: 100%;
    height: 180px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px 0px;
    align-items: center;
}

#question-search {
    width: 80%;
    border: 1px solid #000000;
    padding: 4px;
    border-radius: 8px;
    font-size: 16px;
}

#question-search::placeholder {
    text-align: center;
}

</style>