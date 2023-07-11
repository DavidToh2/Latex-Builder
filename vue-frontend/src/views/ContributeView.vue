<script setup lang="ts">
import Title from '@/components/PageTitle.vue'
import QuestionFilters from '@/components/SearchFilters/QuestionFilters.vue'
import UserTab from '@/components/Tab/UserTab.vue'
import Tab from '@/components/Tab/Tab.vue'
import UserPerms from '@/components/UserPerms/UserPerms.vue'
import Popup from '@/components/Common/Popup/Popup.vue'

import type { qn, qnFilters, qnFilterNames } from '@/types/QuestionTypes'
import { emptyQn, emptyFilters } from '@/types/QuestionTypes'
import type { userPerms } from '@/types/UserTypes'
import { emptyUserPerms } from '@/types/UserTypes'
import type { UserError, ServerError } from '@/types/ErrorTypes'
import { formatErrorMessage } from '@/types/ErrorTypes'

import { useQuestionStore } from '@/stores/questionStore'
import { useUserStore } from '@/stores/userStore'

import { questionSave, questionDelete, questionGetPerms, questionUpdatePerms } from '@/post/postQn';
import { reactive, ref, watch, computed, onActivated, onDeactivated } from 'vue'

const contributeOptionsLeftTab = ['Question', 'Solution', 'Images', 'Contributors']
const contributeOptionsRightTab = ['Save', 'Delete']

var active : qn = reactive({...emptyQn})
const activeFilters = computed<qnFilters>(() => {
    const f = {
        category: active.category,
        topic: active.topic,
        subtopic: active.subtopic,
        difficulty: active.difficulty,
        sourceName: active.sourceName,
        sourceYear: active.sourceYear,
        tags: active.tags
    }
    return f
})
var activePerms : userPerms = reactive({...emptyUserPerms})

var tabs = reactive([true, false, false, false])
var tabID = ref<number>(0)
var IDlist = ref<string[]>(['0'])
var displayIDlist = ref<string[]>(['0'])

const QuestionStore = useQuestionStore()
const UserStore = useUserStore()

const popupActive = ref(false)
const popupText = ref('')

            // On component state change:

onActivated(() => {
    const ad = QuestionStore.getContributeActiveQnID()
    const newQuestion = QuestionStore.getQnUsingID('contribute', ad) as qn
    Object.assign(active, newQuestion)
    updateContributeTab()
})

            // Whenever the CONTRIBUTE store is updated...

function removeFromContribute(qnID : string) {
    if (qnID == '0') {
        // removeFromContribute(0) just resets the newQn and displays it
        QuestionStore.updateQn('contribute', '0', emptyQn)
        if (active.id == '0') {
            Object.assign(active, emptyQn)
        }
    } else {
        QuestionStore.deleteFromContribute(qnID)
    }
}

QuestionStore.$onAction(
    ({name, store, args, after, onError }) => {
        if ((name == 'insertFromDatabaseToContribute') || (name == 'insertIntoContribute') || (name == 'deleteFromContribute') || (name == 'resetContribute')) {
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
    const newContributeDisplayIDList = QuestionStore.getContributeDisplayIDList() as string[]
    displayIDlist.value = newContributeDisplayIDList
}

function updateQuestionFilters(ss : qnFilters) {
    const qF = ['category', 'topic', 'subtopic', 'difficulty', 'sourceName', 'tags']
    for (const key of qF) {
        var k = key as qnFilterNames
        active[k] = ss[k]
    }
    active['sourceYear'] = ss['sourceYear']
}

        // When displayed question is changed...

async function changeDisplayedQuestion(newQnID : string) {

    const a = {...active} as qn

    // Update current displayed question fields into Contribute store
    QuestionStore.updateQn('contribute', active.id, a)

    // Get new displayed question
    const newQuestion = QuestionStore.getQnUsingID('contribute', newQnID) as qn
    Object.assign(active, newQuestion)

    // Get new displayed question's permissions
    const b = await getActivePerms()

    QuestionStore.setContributeActiveID(newQnID)
}

        // When displayed tab is changed, or tab option (SAVE / DELETE) is selected...

async function changeOptionTab(s : string, n : number) {

    const mainForm = document.getElementById('contribute-container') as HTMLFormElement

    if (n == tabID.value) {
        return
    }
    tabID.value = n

    for (var i=0; i<4; i++) { tabs[i] = false }

    switch(s) {
        case 'Question':

        break;
        case 'Solution':

        break;
        case 'Images':

        break;
        case 'Contributors':
            if (active.id != '0') {
                const permsGet = await getActivePerms()
            }

        break;

        case 'Save':
            if (!UserStore.getAuthStatus()) {
                openPopup("You need to be logged in to contribute questions!")

            } else if (!checkForEmptyFields(active)) {
                openPopup("Please check that all necessary fields of your question have been filled up")

            } else {
                
                // SAVE QUESTION TO SERVER

                const responsejson = await questionSave(mainForm, active.id)
                if (responsejson.status == -1) {
                    // Error occured
                    const error = responsejson.error as ServerError
                    const errormsg = formatErrorMessage(error)
                    openPopup(errormsg)
                } else if (responsejson.status == 1) {
                    // Failure
                    const error = responsejson.body as UserError
                    const errorMsg = error.cause
                    openPopup(errorMsg)
                } else {
                    // Success
                    const savedQn = responsejson.body as qn
                    const ID = savedQn['id']
                    if (active.id == '0') {
                        removeFromContribute(active.id)
                        QuestionStore.insertIntoContribute(ID, savedQn)
                        changeDisplayedQuestion(ID)
                    }
                }
            }
            tabID.value = 0
        break;

        case 'Delete':
            if (active.id == '0') {
                removeFromContribute(active.id)
            } else {
                removeFromContribute(active.id)
                const response = await questionDelete(mainForm, active.id)   
                console.log(response)
                changeDisplayedQuestion('0')
            }

            tabID.value = 0
        break;
    }

    tabs[tabID.value] = true
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

async function setPerms(type: 'modifyUsers' | 'modifyGroups' | 'readUsers' | 'readGroups' | 'public', name: string, action: 'add' | 'remove') {

    if (active.id == '0') {
        openPopup('Please save the question before setting user permissions!')
        return false
    }

    const responsejson = await questionUpdatePerms(active.id, type, action, name)

    if (responsejson.status == -1) {
        // Error occured
        const error = responsejson.error
        console.log(error)

    } else if (responsejson.status == 1) {
        // Failure

    } else {
        // Success
        const arePermsUpdated = await getActivePerms()
    }
}

async function getActivePerms() {
    if (active.id == '0') {
        Object.assign(activePerms, emptyUserPerms)
        return true
    }
    const responsejson = await questionGetPerms(active.id)
    if (responsejson.status == -1) {
        // Error occured
        const error = responsejson.error as ServerError
        const errormsg = formatErrorMessage(error)
        openPopup(errormsg)
        return false

    } else if (responsejson.status == 1) {
        // Failure
        const error = responsejson.body as UserError
        const errorMsg = error.cause
        openPopup(errorMsg)
        return false 

    } else {
        // Success
        const currentPerms = responsejson.body as userPerms
        Object.assign(activePerms, currentPerms)  
        return true

    }
}

function dump() {
    console.log("Contribute ID List:")
    console.log(QuestionStore.getContributeIDList())
    console.log(IDlist.value)
    console.log("Active question:")
    console.log(active)
    console.log(active.id)
}

</script>

<template>
    <div class="viewport">
        <Title title="Contribute" />

        <UserTab :display-list="displayIDlist" :internal-list="IDlist" :active-tab="active.id" 
            @change-active-question="changeDisplayedQuestion" @remove-from-tab="removeFromContribute"
        />

        <form id="contribute-container" autocomplete="false">

            <QuestionFilters func="contribute" :ss="activeFilters" @update="updateQuestionFilters"/>

            <Tab :tab-left="contributeOptionsLeftTab" :tab-right="contributeOptionsRightTab" 
                internal-name="questionOptions" :font-size=21 :active-i-d="tabID"
                @change-tab="changeOptionTab"
            />
            
            <div id="question-container" :class="{ 'inactive-container': !tabs[0] }">
                <div class="latex">
                    <textarea class="latex-text" name="question" placeholder="Type LaTeX here:" v-model="active.question"></textarea>
                </div>
                <div class="latex-view" id="question-latex-view" @click="dump">
                </div>
            </div>

            <div id="solution-container" :class="{ 'inactive-container': !tabs[1] }">
                <div class="latex">
                    <textarea class="latex-text" name="solution" placeholder="Type solution here:" v-model="active.solution[0]"></textarea>
                </div>
                <div class="latex-view" id="solution-latex-view" @click="dump">
                </div>
            </div>

            <div id="image-container" :class="{ 'inactive-container': !tabs[2] }">
                Image container to be implemented!
            </div>

            <div id="user-container" :class="{ 'inactive-container': !tabs[3] }">
                <UserPerms 
                    :user-perms="activePerms"
                    @set-perms="setPerms"
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
  