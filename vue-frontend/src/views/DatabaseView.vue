<script setup lang="ts">
import Title from '@/components/PageTitle.vue'
import QuestionFilters from '@/components/SearchFilters/QuestionFilters.vue'
import DisplayTable from '@/components/DisplayTable/DisplayTable.vue'

import type { qn, qns, qnFilters, qnFilterNames } from '@/types/QuestionTypes'
import { emptyFilters } from '@/types/QuestionTypes'
import { useQuestionStore } from '@/stores/questionStore'
import { questionGet, questionDelete } from '@/post/postQn'
import { getFormData } from '@/aux'

import { reactive, onActivated, onDeactivated } from 'vue'

const QuestionStore = useQuestionStore()
var results : qns = reactive({
    qns: []
})

// onMounted(async () => { submitSearchEvent() })

onActivated(() => { 
    Object.assign(searchParameters, QuestionStore.getDatabaseQuestionFilters())
    displayDatabase() 
})
onDeactivated(() => { 
    QuestionStore.saveDatabaseQuestionFilters(searchParameters) 
})

const searchParameters = reactive({...emptyFilters})
function updateSearchParameters(ss : qnFilters) {
    const qF = ['category', 'topic', 'subtopic', 'difficulty', 'sourceName', 'tags']
    for (const key of qF) {
        var k = key as qnFilterNames
        searchParameters[k] = ss[k]
    }
    searchParameters['sourceYear'] = ss['sourceYear']
}


async function submitSearchEvent() {
    const f = document.querySelector('form#question-search-container') as HTMLFormElement
    const responsejson = await questionGet(f)
    if (responsejson.status == -1) {
        // Error occured
        const error = responsejson.error
        console.log(error)

    } else if (responsejson.status == 1) {
        // Failure

    } else {
        // Success
        const data = responsejson.body as qn[]
        QuestionStore.resetDatabase()
        QuestionStore.populateDatabase(data)
        displayDatabase()
    }
}

function displayDatabase() {            // Fetches data from store
    results.qns = [...QuestionStore.getDatabase().slice().reverse()]
}

function insertIntoOtherView(displayID : string, direction : string) {
    switch(direction) {
        case 'left':
            QuestionStore.insertFromDatabaseToContribute(displayID)
        break;
        case 'right':
            QuestionStore.insertQnFromDatabaseToBuild(displayID)
        break;
    }
}

async function submitDeleteEvent(displayID : string) {
    const f = document.querySelector('form#question-search-container') as HTMLFormElement

    // DELETE QUESTION

    const responsejson = await questionDelete(f, displayID)
    if (responsejson.status == -1) {
        // Error occured
        const error = responsejson.error
        console.log(error)

    } else if (responsejson.status == 1) {
        // Failure

    } else {
        // Success
        const data = responsejson.body
        QuestionStore.deleteFromContribute(displayID)
    }

    // Refresh the database
    submitSearchEvent()
}


</script>

<template>
    <div class="viewport">
        <Title title="Database" />
        <form id="question-search-container" autocomplete="false" @submit.prevent="submitSearchEvent">
            <QuestionFilters :ss="searchParameters" func="database" @update="updateSearchParameters"/>
            <div id="question-search-bar">
                <textarea rows="1" id="question-search" name="question" placeholder="Search question text"></textarea>
                <button type="submit" id="question-search-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="icon-sm">
                    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                    </svg>
                </button>
            </div>
        </form>
        <div id="no-of-results">Number of results: {{ results.qns.length }}</div>
        <DisplayTable internal-name="database-table" :qns="results.qns" @delete="submitDeleteEvent" @insert="insertIntoOtherView" />
    </div>
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
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 20px;
}

#question-search {
    width: 80%;
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