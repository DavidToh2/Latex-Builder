<script setup lang="ts">
import Title from '@/components/PageTitle.vue'
import QuestionFilters from '@/components/QuestionFilters/QuestionFilters.vue'
import ContributeTab from '@/components/ContributeTab/ContributeTab.vue'

import type { qn, qns } from '@/types/Types'
import { useQuestionStore } from '@/stores/stores'
import { postForm } from '@/post';
import { reactive, ref, computed, watch } from 'vue'

var actives : qns = reactive({
    qns: []
})
var activeIDs = computed<string[]>(() => {
    var idArr : string[] = []
    actives.qns.forEach((qn) => idArr.push(qn.displayID))
    return idArr
})
var currentQnID = ref<string>('0')

function saveQuestionEvent(e : Event) {
    const f = e.target as HTMLFormElement
    saveQuestion(f)
}
async function saveQuestion(f : HTMLFormElement) {

    var response : Response
    // If the question is a new question:
    if (currentQnID.value == '0') {
        response = await postForm(f, 'http://localhost:3000/database/set/new') as Response

        console.log(response.json())
    // If the question is an existing question:
    } else {
        const dispID = currentQnID.value as string
        response = await postForm(f, `http://localhost:3000/database/set/update/${dispID}`) as Response

        console.log(response.json())
    }

}

const QuestionStore = useQuestionStore()
QuestionStore.resetContribute()


watch(QuestionStore.getContributeIDList(), updateContribute)

// The CONTRIBUTE store was updated. 
function updateContribute(updatedActives : string[], prevActives : string[]) {

    // Three possible actions could have happened:
    const ul = updatedActives.length, pl = prevActives.length

    // New question added to contribute. Get new question ID, then get new question from contribute
    if (ul - pl == 1) {
        var i = 0
        while (i < pl && updatedActives[i] == prevActives[i]) {
            i++
        }
        // The new question ID is at index i of updatedActives.
        // Note that insertFromDatabaseToContribute uses .push, so usually [i] should be the last element of the array
        
        const newQn = (QuestionStore.getContribute() as qn[])[i] as qn
        actives.qns.splice(i, 0, newQn)
    }

    // Question removed from contribute
    if (pl - ul == 1) {
        var i = 0
        while (i < pl && updatedActives[i] == prevActives[i]) {
            i++
        }
        // The deleted question ID is at index i of prevActives.

        actives.qns.splice(i, 1)
    }

    // Contribute store cleared
    if (ul == 0) {
        actives.qns = []
    }
}


</script>

<template>
    <Title title="Contribute" />
    <ContributeTab :id-list="activeIDs" />
    <form id="contribute-question-container" autocomplete="false" @submit.prevent="saveQuestionEvent($event)">
        <QuestionFilters func="contribute" />
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
  