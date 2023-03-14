<script setup lang="ts">
import Title from '@/components/PageTitle.vue'
import QuestionFilters from '@/components/QuestionFilters/QuestionFilters.vue'
import SearchTable from '@/components/SearchTable/SearchTable.vue'

import type { qn, qns } from '@/types/Types'
import { useQuestionStore } from '@/stores/stores'
import { postForm, submitSearch, submitDelete } from '@/post'

import { reactive, onMounted } from 'vue'

const QuestionStore = useQuestionStore()
var results : qns = reactive({
    qns: []
})

onMounted(async () => { submitSearchEvent() })

async function submitSearchEvent() {
    const f = document.querySelector('form#question-search-container') as HTMLFormElement
    const responsejson = await submitSearch(f)

    QuestionStore.resetDatabase()
    QuestionStore.populateDatabase(responsejson)
    displayDatabase()
}

function displayDatabase() {            // Fetches data from store
    results.qns = [...QuestionStore.getDatabase().slice().reverse()]
    console.log(results.qns)
}

async function submitDeleteEvent(displayID : string) {
    const f = document.querySelector('form#question-search-container') as HTMLFormElement
    const responsejson = await submitDelete(f, displayID)
    console.log(responsejson)

    QuestionStore.deleteFromContribute(displayID)
    
    submitSearchEvent()
}

</script>

<template>
    <Title title="Database" />
    <form id="question-search-container" autocomplete="false" @submit.prevent="submitSearchEvent">
        <QuestionFilters func="database" />
        <div id="question-search-bar">
            <textarea rows="1" id="question-search" name="question" placeholder="Search question text"></textarea>
            <button type="submit" id="question-search-button">
                <img src="@/assets/search.png" style="width: 25px; height: 25px;">
            </button>
        </div>
    </form>
    <div id="no-of-results">Number of results: {{ results.qns.length }}</div>
    <SearchTable :qns="results.qns" @delete="submitDeleteEvent" />
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

#question-search-bar {
    width: 100%;
}

#question-search {
    width: 80%;
    margin: 0 2% 0 6%;
    border: 1px solid #000000;
    padding: 8px 4px;
    border-radius: 8px;
    font-size: 16px;
}

#question-search::placeholder {
    text-align: center;
}

#question-search-button {
    background-color: white;
    border: 0;
    cursor: pointer;
}

#no-of-results {
    margin-left: 20px;
}

</style>