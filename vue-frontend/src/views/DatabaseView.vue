<script setup lang="ts">
import Title from '@/components/PageTitle.vue'
import QuestionFilters from '@/components/QuestionFilters/QuestionFilters.vue'
import SearchTable from '@/components/SearchTable/SearchTable.vue'

import type { qn } from '@/types/Types'
import { useQuestionStore } from '@/stores/stores'

const mainStore = useQuestionStore()

var results : qn[] = []

async function submitSearchQuery(e : Event) {
    let f = e.target as HTMLFormElement
    let form = f.elements as HTMLFormControlsCollection
    let reqBody = {} as { [key : string] : string | number | null }

    for (const element of form) {
        const eName = element.getAttribute('name')
        if (eName) {
            const eValue = element.getAttribute('value')
            reqBody[eName] = eValue
        }
    }

    const response = await fetch("http://localhost:3000/get", {
        method: 'POST',
        headers: {
            'Content-Type': 'application-json'
        },
        body: JSON.stringify(reqBody)
    })
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
    <form id="question-search-container" autocomplete="false" @onsubmit="submitSearchQuery($event)">
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