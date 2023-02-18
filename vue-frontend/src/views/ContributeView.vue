<script setup lang="ts">
import Title from '@/components/PageTitle.vue'
import QuestionFilters from '@/components/QuestionFilters/QuestionFilters.vue'
import ContributeTab from '@/components/ContributeTab/ContributeTab.vue'

import type { qn, qnFilters, qnFilterNames } from '@/types/Types'
import { useQuestionStore } from '@/stores/stores'
import { postForm } from '@/post';
import { reactive, ref, computed, watch } from 'vue'

const emptyQn : qn = {
    displayID: '0',
    category: [],
    question: '',

    topic: [],
    subtopic: [],
    difficulty: [],
    sourceName: [],
    sourceYear: 0,

    images: [],
    solution: '',
    solutionImages: [],
    lastModified: '',
    tags: []
}

var active : qn = reactive({...emptyQn})
var newQn : qn = reactive({...emptyQn})

var activeFilters = computed<qnFilters>(() => {
    const f : qnFilters = {
        category: <string[]> active.category,
        topic: <string[]> active.topic,
        subtopic: <string[]> active.subtopic,
        difficulty: <string[]> active.difficulty,
        sourceName: <string[]> active.sourceName,
        sourceYear: active.sourceYear,
        tags: <string[]> active.tags
    }
    return f
})

var activeIDs = ref<string[]>([])

function saveQuestionEvent(e : Event) {
    const f = e.target as HTMLFormElement
    saveQuestion(f)
}
async function saveQuestion(f : HTMLFormElement) {

    var response : Response
    // If the question is a new question:
    if (active.displayID == '0') {
        response = await postForm(f, 'http://localhost:3000/database/set/new') as Response

        console.log(response.json())
    // If the question is an existing question:
    } else {
        const dispID = active.displayID as string
        response = await postForm(f, `http://localhost:3000/database/set/update/${dispID}`) as Response

        console.log(response.json())
    }

}

const QuestionStore = useQuestionStore()
QuestionStore.resetContribute()

var oldActiveIDs = ref<string[]>([])

QuestionStore.$onAction(
    ({name, store, args, after, onError }) => {
        if (name == 'insertFromDatabaseToContribute') {
            after((result) => {
                if (result) {
                    const newContributeIDList = QuestionStore.getContributeIDList() as string[]
                    updateContribute(newContributeIDList, oldActiveIDs.value)
                    oldActiveIDs.value = [...newContributeIDList]
                }
            })
        }
    }
)

// Run the following function whenever the CONTRIBUTE store is updated:
// The CONTRIBUTE store was updated. 
function updateContribute(updatedContribute : string[], prevContribute : string[]) {

    // Three possible actions could have happened:
    const ul = updatedContribute.length, pl = prevContribute.length

    // New question added to contribute. Get new question ID, then add to tab
    if (ul - pl == 1) {
        var i = 0
        while (i < pl && updatedContribute[i] == prevContribute[i]) {
            i++
        }
        // The new question ID is at index i of updatedContribute.
        // Note that insertFromDatabaseToContribute uses .push, so usually [i] should be the last element of the array.
        // activeIDs[] and prevContribute[] should be identical, except for the '0' at the front of the former.
        const newQnID = updatedContribute[i]
        activeIDs.value.splice(i+1, 0, newQnID)
    }

    // Question removed from contribute. Remove from tab
    if (pl - ul == 1) {
        var i = 0
        while (i < pl && updatedContribute[i] == prevContribute[i]) {
            i++
        }
        // The deleted question ID is at index i of prevContribute.
        activeIDs.value.splice(i+1, 1)
    }

    // Contribute store cleared
    if (ul == 0) {
        activeIDs.value = []
    }
}

function updateQuestionFilters(ss : qnFilters) {
    const qF = ['category', 'topic', 'subtopic', 'difficulty', 'sourceName', 'tags']
    for (const key in qF) {
        var k = key as qnFilterNames
        active[k] = ss[k]
    }
    active['sourceYear'] = ss['sourceYear']
}

function changeDisplayedQuestion(newQnID : string) {

    if (active.displayID == '0') {
        // If current displayed question is the new question, store it
        newQn = active
    } else {
        // Update current displayed question fields into Contribute store
        QuestionStore.updateQn('contribute', active.displayID, active)
    }

    // Get new displayed question
    if (newQnID == '0') {
        active = newQn
    } else {
        const newQuestion = QuestionStore.getQnUsingID('contribute', newQnID) as qn
        active = newQuestion
    }

    console.log(active.question)
}

</script>

<template>
    <Title title="Contribute" />
    <ContributeTab :id-list="activeIDs" @change-active-question="changeDisplayedQuestion" />
    <form id="contribute-question-container" autocomplete="false" @submit.prevent="saveQuestionEvent($event)">
        <QuestionFilters func="contribute" @update-all="updateQuestionFilters" :ss="activeFilters"/>
        <!-- <input type="text" id="question-build-shortcut" name="question-tags" placeholder="Quickfill: Category - Topic - Subtopic - Difficulty - Source - Year - Tags"> -->
            
        <div id="latex-container">
            <textarea id="question-text" name="question" placeholder="Type LaTeX here:"></textarea>
        </div>
        <div id="display-container">
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
  