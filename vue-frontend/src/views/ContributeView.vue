<script setup lang="ts">
import Title from '@/components/PageTitle.vue'
import QuestionFilters from '@/components/QuestionFilters/QuestionFilters.vue'
import ContributeTab from '@/components/ContributeTab/ContributeTab.vue'

import type { qn, qnFilters, qnFilterNames } from '@/types/Types'
import { emptyQn, emptyFilters, syncFiltersWithQn, syncQnWithFilters } from '@/types/Types'
import { useQuestionStore } from '@/stores/stores'
import { postForm, submitSave } from '@/post';
import { reactive, ref, watch } from 'vue'

var active : qn = reactive({...emptyQn})
var newQn : qn = reactive({...emptyQn})
var activeFilters : qnFilters = reactive({...emptyFilters})
var IDlist = ref<string[]>(['0'])

            // Sync active and activeFilters:

watch(active, (newA, oldA) => {
    syncFiltersWithQn(activeFilters, newA)
}, {deep: true})

watch(activeFilters, (newF, oldF) => {
    syncQnWithFilters(active, newF)
}, {deep: true})

function saveQuestionEvent(e : Event) {
    const f = e.target as HTMLFormElement
    const response = submitSave(f, active.displayID)   
    console.log(response)
    if (active.displayID == '0') {
        Object.assign(active, emptyQn)
        
    }
}

const QuestionStore = useQuestionStore()
QuestionStore.resetContribute()

            // Whenever the CONTRIBUTE store is updated...

function removeFromContribute(qnID : string) {
    QuestionStore.deleteFromContribute(qnID)
}

QuestionStore.$onAction(
    ({name, store, args, after, onError }) => {
        if (name == 'insertFromDatabaseToContribute') {
            after((result) => {
                if (result) {
                    const newContributeIDList = QuestionStore.getContributeIDList() as string[]
                    updateContributeTab(newContributeIDList, [...IDlist.value])
                }
            })
        }
        if (name == 'deleteFromContribute') {
            after((result) => {
                if (result) {
                    const newContributeIDList = QuestionStore.getContributeIDList() as string[]
                    updateContributeTab(newContributeIDList, [...IDlist.value])
                }
            })
        }
    }
)

function updateContributeTab(updatedContribute : string[], prevContribute : string[]) {

    // Three possible actions could have happened:
    const ul = updatedContribute.length, pl = prevContribute.length

    // New question added to contribute. Get new question ID, then add to tab
    if (ul - pl == 1) {
        var i = 0
        while (i < pl && updatedContribute[i] == prevContribute[i]) {
            i++
        }
        // The new question ID is at index i of updatedContribute.
        const newQnID = updatedContribute[i]
        IDlist.value.splice(i, 0, newQnID)
    }

    // Question removed from contribute. Remove from tab
    if (pl - ul == 1) {
        var i = 0
        while (i < pl && updatedContribute[i] == prevContribute[i]) {
            i++
        }
        // The deleted question ID is at index i of prevContribute.
        IDlist.value.splice(i, 1)
    }

    // Contribute store cleared
    if (ul == 0) {
        IDlist.value = ['0']
    }
}

function updateQuestionFilters(ss : qnFilters) {
    const qF = ['category', 'topic', 'subtopic', 'difficulty', 'sourceName', 'tags']
    for (const key of qF) {
        var k = key as qnFilterNames
        activeFilters[k] = ss[k]
    }
    activeFilters['sourceYear'] = ss['sourceYear']
}

function changeDisplayedQuestion(newQnID : string) {

    const a = {...active} as qn

    if (active.displayID == '0') {
        // If current displayed question is the new question, store it
        Object.assign(newQn, a)
    } else {
        // Update current displayed question fields into Contribute store
        QuestionStore.updateQn('contribute', active.displayID, a)
    }

    // Get new displayed question
    if (newQnID == '0') {
        Object.assign(active, newQn)
    } else {
        const newQuestion = QuestionStore.getQnUsingID('contribute', newQnID) as qn
        Object.assign(active, newQuestion)
    }
}

function dump() {
    
    console.log([...QuestionStore.getContributeIDList()])
    console.log({...QuestionStore.getContribute()})
    console.log({...QuestionStore.getDatabase()})
    console.log(active)
    console.log(activeFilters)
}

</script>

<template>
    <Title title="Contribute" />
    <ContributeTab :id-list="IDlist" :active-i-d="active.displayID" 
        @change-active-question="changeDisplayedQuestion" @remove-from-tab="removeFromContribute"
    />

    <form id="contribute-question-container" autocomplete="false" @submit.prevent="saveQuestionEvent($event)">
        <QuestionFilters func="contribute" :ss="activeFilters" @update="updateQuestionFilters"/>
        <!-- <input type="text" id="question-build-shortcut" name="question-tags" placeholder="Quickfill: Category - Topic - Subtopic - Difficulty - Source - Year - Tags"> -->
            
        <div id="latex-container">
            <textarea id="question-text" name="question" placeholder="Type LaTeX here:" v-model="active.question"></textarea>
        </div>
        <div id="display-container" @click="dump">
        </div>
        <button type="submit" id="question-save-button">
            <img src="@/assets/save.png" style="width: 30px; height: 30px;">
        </button>
    </form>
</template>

<style scoped>

#contribute-question-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px 10px;
    align-items: center;
}

#question-build-shortcut {
    width: 64%;
    height: 36px;
    border: 1px solid #000000;
    padding: 4px;
    font-size: 18px;
}

#question-content-container {
    width: 100%;
    padding: 0px 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

#latex-container {
	width: 100%;
	height: 250px;
	max-height: none;
}

#display-container {
	width: 100%;
	height: 250px;
	max-height: none;
    border: 1px solid #000000;

    overflow-y: scroll;
}

#question-text {
	width: 100%;
    height: 100%;
    border-radius: 8px;
    border: 1px solid #000000;
    padding: 10px;

    font-size: 14px;
    font-family: 'Gothic AI', sans-serif;

    overflow-y: scroll;
}

#question-save-button {
    background-color: white;
    border: 0;
    cursor: pointer;
}

</style>
  