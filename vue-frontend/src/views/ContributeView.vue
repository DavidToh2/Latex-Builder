<script setup lang="ts">
import Title from '@/components/PageTitle.vue'
import QuestionFilters from '@/components/SearchFilters/QuestionFilters.vue'
import UserTab from '@/components/Tab/UserTab.vue'
import Tab from '@/components/Tab/Tab.vue'
import UserPerms from '@/components/UserPerms/UserPerms.vue'
import Popup from '@/components/Common/Popup/Popup.vue'

import type { qn, qnFilters, qnFilterNames } from '@/types/QuestionTypes'
import { emptyQn, emptyFilters, syncFiltersWithQn, syncQnWithFilters } from '@/types/QuestionTypes'
import { useQuestionStore } from '@/stores/questionStore'
import { useUserStore } from '@/stores/userStore'
import { questionSave, questionDelete } from '@/post/postQn';
import { reactive, ref, watch, onActivated, onDeactivated } from 'vue'

const contributeOptionsLeftTab = ['Question', 'Solution', 'Images', 'Contributors']
const contributeOptionsRightTab = ['Save', 'Delete']

var active : qn = reactive({...emptyQn})
var newQn : qn = reactive({...emptyQn})
var activeFilters : qnFilters = reactive({...emptyFilters})
var activeOptions = reactive([true, false, false, false])
var activeOptionID = ref<number>(0)
var IDlist = ref<string[]>(['0'])

const QuestionStore = useQuestionStore()
const UserStore = useUserStore()

const popupActive = ref(false)
const popupText = ref('')

            // Sync active and activeFilters:

watch(active, (newA, oldA) => {
    saveActiveQn()
    syncFiltersWithQn(activeFilters, newA)
}, {deep: true})

watch(activeFilters, (newF, oldF) => {
    syncQnWithFilters(active, newF)
    saveActiveQn()
}, {deep: true})

            // On component state change:

onActivated(() => {
    const ad = QuestionStore.getContributeActiveQnID()
    const newQuestion = QuestionStore.getQnUsingID('contribute', ad.value) as qn
    Object.assign(active, newQuestion)
    updateContributeTab()
})

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
        if ((name == 'insertFromDatabaseToContribute') || (name == 'insertIntoContribute') || (name == 'deleteFromContribute')) {
            after((result) => {
                if (result) {
                    updateContributeTab()
                }
            })
        }
    }
)

function updateContributeTab() {
    const newContributeIDList = QuestionStore.getContributeIDList() as string[]
    IDlist.value = newContributeIDList
}

function updateQuestionFilters(ss : qnFilters) {
    const qF = ['category', 'topic', 'subtopic', 'difficulty', 'sourceName', 'tags']
    for (const key of qF) {
        var k = key as qnFilterNames
        activeFilters[k] = ss[k]
    }
    activeFilters['sourceYear'] = ss['sourceYear']
}

        // Used to sync active and activeFilters

function saveActiveQn() {
    QuestionStore.updateQn('contribute', active.displayID, active)
    QuestionStore.saveContributeActiveQnID(active.displayID)
}

        // When displayed question is changed...

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

        // When displayed tab is changed, or tab option (SAVE / DELETE) is selected...

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
        case 'Contributors':

        break;

        case 'Save':
            if (!UserStore.getAuthStatus()) {
                openPopup("You need to be logged in to contribute questions!")

            } else if (!checkForEmptyFields(active)) {
                openPopup("Please check that all necessary fields of your question have been filled up")

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
                    const savedQn = responsejson.body[0] as qn
                    const dispID = savedQn['displayID']
                    if (active.displayID == '0') {
                        removeFromContribute(active.displayID)

                        QuestionStore.insertIntoContribute(dispID, savedQn)
                        changeDisplayedQuestion(dispID)
                    }
                }
            }
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

function checkForEmptyFields(q : qn) {
    var ready = true
    if (
        q.question.trim().length == 0 ||
        q.category.length == 0 ||
        q.topic.length == 0 ||
        q.subtopic.length == 0
    ) {
        ready = false
    }
    return ready
}

function openPopup(m : string) {
    popupText.value = m
    popupActive.value = true
}
function closePopup() {
    popupActive.value = false
}

        // When user perms are changed...

function setPerms(type: 'modifyUsers' | 'modifyGroups' | 'readUsers' | 'readGroups' | 'public', u: string, action: 'add' | 'remove') {
    
}

function setModifyUserOfActive(u : string, action : string) {
    if (action == 'add') {
        active.userPerms.canModifyUsers.push(u)
    } else if (action == 'remove') {
        const k = active.userPerms.canModifyUsers.indexOf(u)
        active.userPerms.canModifyUsers.splice(k, 1)
    }
}
function setReadUserOfActive(u : string, action : string) {
    if (action == 'add') {
        active.userPerms.canReadUsers.push(u)
    } else if (action == 'remove') {
        const k = active.userPerms.canReadUsers.indexOf(u)
        active.userPerms.canReadUsers.splice(k, 1)
    }
}
function setModifyGroupOfActive(g : string, action : string) {
    const c = active.userPerms.canModifyGroups
    const k = c.indexOf(g)
    console.log(`Index of ${g} is ${k}`)
    if ((action == 'add') && (k < 0)) {
        active.userPerms.canModifyGroups.push(g)
        console.log('pushing')
    } else if ((action == 'remove') && (k >= 0)) {
        active.userPerms.canModifyGroups.splice(k, 1)
    }
    console.log(active.userPerms)
}
function setReadGroupOfActive(g : string, action : string) {
    const c = active.userPerms.canReadGroups
    const k = c.indexOf(g)
    if ((action == 'add') && (k < 0)) {
        active.userPerms.canReadGroups.push(g)
    } else if ((action == 'remove') && (k >= 0)) {
        active.userPerms.canReadGroups.splice(k, 1)
    }
}
function setPublic(perms : string) {
    if (['none', 'read', 'modify'].indexOf(perms) < 0) {
        return false
    } else {
        active.userPerms.canAccessPublic = perms as "none" | "read" | "modify"
        return true
    }
}

function dump() {

    console.log(QuestionStore.getContributeIDList())
    console.log(active)
    console.log(active.displayID)
    console.log(newQn)
}

</script>

<template>
    <div class="viewport">
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

            <div id="user-container" :class="{ 'inactive-container': !activeOptions[3] }">
                <UserPerms 
                    :owner="active.userPerms.owner" 
                    :can-modify-users="active.userPerms.canModifyUsers" :can-read-users="active.userPerms.canReadUsers"
                    :can-modify-groups="active.userPerms.canModifyGroups" :can-read-groups="active.userPerms.canReadGroups"
                    :can-access-public="active.userPerms.canAccessPublic"
                    @set-perms=""
                />
            </div>

        </form>

        <Popup :is-active="popupActive" @close="closePopup">
            <span v-html="popupText"></span>
        </Popup>
    </div>
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
#user-container {
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
    resize: none;
}

#question-save-button {
    background-color: white;
    border: 0;
    cursor: pointer;
}

</style>
  