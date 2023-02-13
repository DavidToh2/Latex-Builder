<script setup lang="ts">
import Title from '@/components/PageTitle.vue'
import QuestionFilters from '@/components/QuestionFilters/QuestionFilters.vue'
import SearchTable from '@/components/SearchTable/SearchTable.vue'

import type { qn } from '@/types/Types'
import { useQuestionStore } from '@/stores/stores'
import { postForm } from '@/post'

import { reactive, nextTick, onMounted } from 'vue'

interface searchResults {
    resultArray : qn[]
}

const mainStore = useQuestionStore()
var results : searchResults = reactive({
    resultArray: []
})

onMounted(async () => {
    const f = document.querySelector('form#question-search-container') as HTMLFormElement
    await submitSearchQuery(f)
})
async function submitSearchEvent(e : Event) {
    const f = document.querySelector('form#question-search-container') as HTMLFormElement
    await submitSearchQuery(f)
}
async function submitSearchQuery(f : HTMLFormElement) {
    const response = await postForm(f, 'http://localhost:3000/database/get') as Response
    
    const responsejson = await response.json() as qn[]
    mainStore.populateDatabase(responsejson)
    displayDatabase()
}
function displayDatabase() {
    results.resultArray = mainStore.getDatabase()
    console.log(results.resultArray)
}

</script>

<template>
    <Title title="Database" />
    <form id="question-search-container" autocomplete="false" @submit.prevent="submitSearchEvent($event)">
        <QuestionFilters func="database" />
        <textarea rows="1" id="question-search" name="question" placeholder="Search question text"></textarea>
        <input type="submit">
    </form>
    <div id="no-of-results">Number of results: {{ results.resultArray.length }}</div>
    <SearchTable :qns="results.resultArray" />
</template>

<style scoped>

#question-search-container {
    width: 100%;
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

#no-of-results {
    margin-left: 20px;
}

</style>