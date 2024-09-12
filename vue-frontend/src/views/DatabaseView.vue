<script setup lang="ts">
import Title from '@/components/PageTitle.vue'
import QuestionFilters from '@/components/SearchFilters/QuestionFilters.vue'
import DisplayTable from '@/components/DisplayTable/DisplayTable.vue'

import type { qn, qns, qnFilters, qnFilterNames, pageData } from '@/types/QuestionTypes'
import { emptyFilters } from '@/types/QuestionTypes'
import { useQuestionStore } from '@/stores/questionStore'
import { useUserStore } from '@/stores/userStore'
import { formatErrorMessage } from '@/types/ErrorTypes'
import { questionGet, questionDelete } from '@/post/postQn'

import { ref, reactive, onActivated, onDeactivated } from 'vue'

const QuestionStore = useQuestionStore()
const UserStore = useUserStore()
var results : qns = reactive({
    qns: []
})

// onMounted(async () => { submitSearchEvent() })

onActivated(() => { 
    Object.assign(searchParameters, QuestionStore.getDatabaseQuestionFilters())
    displayDatabase() 
})
onDeactivated(() => { 
    QuestionStore.setDatabaseQuestionFilters(searchParameters) 
})

const searchParameters = reactive({...emptyFilters})
const searchString = ref('')

function updateSearchParameters(ss : qnFilters) {
    const qF = ['category', 'topic', 'subtopic', 'difficulty', 'sourceName', 'tags']
    for (const key of qF) {
        var k = key as qnFilterNames
        searchParameters[k] = ss[k]
    }
    searchParameters['sourceYear'] = ss['sourceYear']

    QuestionStore.setDatabaseQuestionFilters(searchParameters)
}

async function submitSearchEvent(s : string) {
    resetDatabase()

    if (searchParameters.sourceYear && !(/^\d+$/.test(searchParameters.sourceYear))) {
        UserStore.openPopup('Year must be a numerical value!')
        return
    }

    const responsejson = await questionGet(searchParameters, searchString.value, QuestionStore.getDatabasePage(), s)
    if (responsejson.status == -1) {
        // Error occured
        const error = responsejson.error
        const errorMsg = formatErrorMessage(error)
        UserStore.openPopup(errorMsg)

    } else if (responsejson.status == 1) {
        // Failure
        const error = responsejson.body
        const errorMsg = error.cause
        UserStore.openPopup(errorMsg)

    } else {
        // Success
        const qns = responsejson.body.qns as qn[]
        const page = responsejson.body.page as pageData
        QuestionStore.populateDatabase(qns)
        QuestionStore.setDatabasePage(page)
        displayDatabase()
    }
}

function resetDatabase() {
    results.qns = []
}

function displayDatabase() {            // Fetches data from store
    results.qns = [...QuestionStore.getDatabase()]
}

QuestionStore.$onAction(
    ({name, store, args, after, onError }) => {
        if ((name == 'resetDatabase')) {
            after((result) => {
                Object.assign(searchParameters, QuestionStore.getDatabaseQuestionFilters())
                displayDatabase()
            })
        }
        if ((name == 'updateQn') && (args[0] == 'database')) {
            after((result) => {
                if (result) {
                    resetDatabase()
                    console.log("Database reset")
                    displayDatabase()
                }
            })
        }
        if ((name == 'deleteFromDatabase')) {
            after((result) => {
                if (result) {
                    displayDatabase()
                }
            })
        }
    }
)

function insertIntoOtherView(ID : string, direction : string) {
    switch(direction) {
        case 'left':
            QuestionStore.insertFromDatabaseToContribute(ID)
        break;
        case 'right':
            QuestionStore.insertQnFromDatabaseToBuild(ID)
        break;
    }
}

async function submitDeleteEvent(ID : string) {

    // DELETE QUESTION

    const responsejson = await questionDelete(ID)
    if (responsejson.status == -1) {
        // Error occured
        const error = responsejson.error
        const errorMsg = formatErrorMessage(error)
        UserStore.openPopup(errorMsg)

    } else if (responsejson.status == 1) {
        // Failure
        const error = responsejson.body
        const errorMsg = error.cause
        UserStore.openPopup(errorMsg)

    } else {
        // Success
        const data = responsejson.body
        QuestionStore.deleteFromContribute(ID)
        UserStore.openPopup('Delete successful!')
    }

    // Refresh the database
    submitSearchEvent('new')
}


</script>

<template>
    <div class="viewport">
        <Title title="Database" />
        <form id="question-search-container" autocomplete="false" @submit.prevent="">
            <QuestionFilters :ss="searchParameters" func="database" @update="updateSearchParameters"/>
            <div id="question-search-bar">
                <button type="submit" class="question-search-button" name="prev" @click="submitSearchEvent('prev')">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="450 450 1050 1050" class="icon-sm">
                    <path d="M1203 544q0 13-10 23l-393 393 393 393q10 10 10 23t-10 23l-50 50q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l50 50q10 10 10 23z">
                    </path></svg>
                </button>
                <textarea rows="1" id="question-search" name="question" placeholder="Search question text" class="latex-text" v-model="searchString"></textarea>
                <button type="submit" class="question-search-button" name="new" @click="submitSearchEvent('new')">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="icon-sm">
                    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                    </svg>
                </button>
                <button type="submit" class="question-search-button" name="next" @click="submitSearchEvent('next')">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="450 450 1050 1050" class="icon-sm">
                    <path d="M1171 960q0 13-10 23l-466 466q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l393-393-393-393q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l466 466q10 10 10 23z">
                    </path></svg>
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
    resize: none;
    font-size: var(--font-size);
}

#question-search::placeholder {
    text-align: center;
}

.question-search-button {
    background-color: white;
    border: 0;
    cursor: pointer;
}

#no-of-results {
    margin-left: 20px;
}

</style>