<script setup lang="ts">
import Title from '@/components/PageTitle.vue'
import QuestionFilters from '@/components/SearchFilters/QuestionFilters.vue'
import UserTab from '@/components/Tab/UserTab.vue'
import Tab from '@/components/Tab/Tab.vue'

import type { qn, qnFilters, qnFilterNames } from '@/types/Types'
import { emptyQn, emptyFilters, syncFiltersWithQn, syncQnWithFilters } from '@/types/Types'
import { useQuestionStore } from '@/stores/questionStore'
import { questionSave, questionDelete } from '@/post/postQn';
import { reactive, ref, watch } from 'vue'

const contributeOptionsLeftTab = ['Question', 'Solution', 'Images', 'Packages']
const contributeOptionsRightTab = ['Save', 'Save As', 'Delete']

var active : qn = reactive({...emptyQn})
var newQn : qn = reactive({...emptyQn})
var activeFilters : qnFilters = reactive({...emptyFilters})
var activeOptions = reactive([true, false, false, false])
var activeOptionID = ref<number>(0)
var IDlist = ref<string[]>(['0'])

            // Sync active and activeFilters:

watch(active, (newA, oldA) => {
    syncFiltersWithQn(activeFilters, newA)
}, {deep: true})

watch(activeFilters, (newF, oldF) => {
    syncQnWithFilters(active, newF)
}, {deep: true})



const QuestionStore = useQuestionStore()
QuestionStore.resetContribute()

            // Whenever the CONTRIBUTE store is updated...

function removeFromContribute(qnID : string) {
    if (qnID == '0') {
        // removeFromContribute(0) just resets the newQn and displays it
        Object.assign(newQn, emptyQn)
        Object.assign(active, newQn)
    } else {
        QuestionStore.deleteFromContribute(qnID)
    }
}

QuestionStore.$onAction(
    ({name, store, args, after, onError }) => {
        if ((name == 'insertFromDatabaseToContribute') || (name == 'insertIntoContribute')) {
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

async function changeOptionTab(s : string, n : number) {

    const mainForm = document.getElementById('contribute-container') as HTMLFormElement

    if (n == activeOptionID.value) {
        return
    }
    activeOptionID.value = n

    for (var i=0; i<4; i++) { activeOptions[i] = false }

    switch(s) {
        case 'Question':

        break;
        case 'Solution':

        break;
        case 'Images':

        break;
        case 'Packages':

        break;

        case 'Save':
            if ((active.category.length == 0) || (active.question.trim().length == 0)) {
                alert("Your question is empty!")
            } else {
                
                // SAVE QUESTION

                const responsejson = await questionSave(mainForm, active.displayID)
                if (responsejson.status == -1) {
                    // Error occured
                    const error = responsejson.error
                    console.log(error)

                } else if (responsejson.status == 1) {
                    // Failure

                } else {
                    // Success
                    const response = responsejson.body as qn[]
                    const dispID = response[0]['displayID']
                    if (active.displayID == '0') {
                        removeFromContribute(active.displayID)

                        response.forEach((q : qn) => {
                            const d = q['displayID']
                            QuestionStore.insertIntoContribute(d, q)
                        })
                        changeDisplayedQuestion(dispID)
                    }
                }
            }
            activeOptionID.value = 0

        break;

        case 'Save As':
            alert('Save As to be implemented!')

            activeOptionID.value = 0
        break;

        case 'Delete':
            if (active.displayID == '0') {
                removeFromContribute(active.displayID)
            } else {
                removeFromContribute(active.displayID)
                const response = await questionDelete(mainForm, active.displayID)   
                console.log(response)
                changeDisplayedQuestion('0')
            }

            activeOptionID.value = 0
        break;
    }

    activeOptions[activeOptionID.value] = true
}

function dump() {
    
    console.log([...QuestionStore.getContributeIDList()])
    console.log({...QuestionStore.getContribute()})
    console.log({...QuestionStore.getDatabase()})
    console.log(active)
    console.log(activeFilters)
    console.log(newQn)
}

</script>

<template>

    <Title title="Contribute" />

    <UserTab :tab-list="IDlist" :active-tab="active.displayID" 
        @change-active-question="changeDisplayedQuestion" @remove-from-tab="removeFromContribute"
    />

    <form id="contribute-container" autocomplete="false">

        <QuestionFilters func="contribute" :ss="activeFilters" @update="updateQuestionFilters"/>

        <Tab :tab-left="contributeOptionsLeftTab" :tab-right="contributeOptionsRightTab" 
            internal-name="questionOptions" :font-size=21 :active-i-d="activeOptionID"
            @change-tab="changeOptionTab"
        />
        
        <div id="question-container" :class="{ 'inactive-container': !activeOptions[0] }">
            <div class="latex">
                <textarea class="latex-text" name="question" placeholder="Type LaTeX here:" v-model="active.question"></textarea>
            </div>
            <div class="latex-view" id="question-latex-view" @click="dump">
            </div>
        </div>

        <div id="solution-container" :class="{ 'inactive-container': !activeOptions[1] }">
            <div class="latex">
                <textarea class="latex-text" name="solution" placeholder="Type solution here:" v-model="active.solution"></textarea>
            </div>
            <div class="latex-view" id="solution-latex-view" @click="dump">
            </div>
        </div>

        <div id="image-container" :class="{ 'inactive-container': !activeOptions[2] }">
            Image container to be implemented!
        </div>

        <div id="package-container" :class="{ 'inactive-container': !activeOptions[3] }">
            Package container to be implemented!
        </div>

    </form>
</template>

<style scoped>

#contribute-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px 10px;
    align-items: center;
}

#contribute-options {
    width: 100%;
    display: flex;
	flex-direction: row;
	padding: 10px 10px;
	gap: 20px;
}

.contribute-options-tab {
    font-size: 20px;
}

#question-build-shortcut {
    width: 64%;
    height: 36px;
    border: 1px solid #000000;
    padding: 4px;
    font-size: 18px;
}

#question-container {
    width: 100%;
    padding: 0px 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
#solution-container {
    width: 100%;
    padding: 0px 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
#image-container {
    width: 100%;
}
#package-container {
    width: 100%;
}
.inactive-container {
    display: none !important;
}

.latex {
	width: 100%;
	height: 250px;
	max-height: none;
}

.latex-view {
	width: 100%;
	height: 250px;
	max-height: none;
    border: 1px solid #000000;

    overflow-y: scroll;
}

.latex-text {
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
  