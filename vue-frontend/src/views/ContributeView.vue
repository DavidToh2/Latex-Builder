<script setup lang="ts">
import Title from '@/components/PageTitle.vue'
import QuestionFilters from '@/components/SearchFilters/QuestionFilters.vue'
import UserTab from '@/components/Tab/UserTab.vue'
import Tab from '@/components/Tab/Tab.vue'
import LatexInput from '@/components/Latex/LatexInput.vue'
import LatexPreview from '@/components/Latex/LatexPreview.vue'
import UserPerms from '@/components/UserPerms/UserPerms.vue'

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
import { getQnPreviewURL } from '@/aux'

const contributeOptionsLeftTab = ['Question', 'Solution', 'Images', 'Contributors']
const contributeOptionsRightTab = ['Save', 'Delete']
const containerHeight = ref('300px')

var active : qn = reactive({...emptyQn})
const activeFilters = computed<qnFilters>(() => {
    const f = {
        category: active.category,
        topic: active.topic,
        subtopic: active.subtopic,
        difficulty: active.difficulty,
        sourceName: active.sourceName,
        sourceYear: (active.sourceYear == null) ? "" : active.sourceYear.toString(),
        tags: active.tags
    }
    return f
})
var activePerms : userPerms = reactive({...emptyUserPerms})

var activeTab = ref<number>(0)
var IDlist = ref<string[]>(['0'])
var displayIDlist = ref<string[]>(['0'])

const blobURL = ref('')

const QuestionStore = useQuestionStore()
const UserStore = useUserStore()

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
        if ((name == 'insertFromDatabaseToContribute') || (name == 'insertIntoContribute') || (name == 'deleteFromContribute')) {
            after((result) => {
                if (result) {
                    updateContributeTab()
                }
            })
        }
        // if ((name == 'updateQn') && (args[0] == 'contribute')) {
        //     after((result) => {
        //         if (result) {
        //             console.log("Questionstore called changeDisplayedQuestion")
        //             changeDisplayedQuestion(active.id)
        //         }
        //     })
        // }
        if ((name == 'resetContribute')) {
            after((result) => {
                if (result) {
                    updateContributeTab()
                    removeFromContribute('0')
                    changeDisplayedQuestion('0')
                    changeOptionTab('Question', 0)
                    Object.assign(activePerms, emptyUserPerms)
                    resetQnPreview()
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

    if (newQnID != active.id) {
        const a = {...active} as qn

        // Update current displayed question fields into Contribute store
        QuestionStore.updateQn('contribute', active.id, a)
    }

    // Get new displayed question
    const newQuestion = QuestionStore.getQnUsingID('contribute', newQnID) as qn
    Object.assign(active, newQuestion)

    // Get png of new displayed question
    if (newQnID != '0') {
        const lastModified = newQuestion['lastModified']
        displayQnPreview(lastModified)
    } else {
        resetQnPreview()
    }

    QuestionStore.setContributeActiveID(newQnID)
    changeOptionTab('Question', 0)
}

        // When displayed tab is changed, or tab option (SAVE / DELETE) is selected...

async function changeOptionTab(s : string, newTabValue : number) {

    const oldTabValue = activeTab.value
    if (newTabValue == oldTabValue) {
        return
    }

    switch(s) {
        case 'Question':
            activeTab.value = newTabValue

        break;
        case 'Solution':
            activeTab.value = newTabValue

        break;
        case 'Images':
            activeTab.value = newTabValue

        break;
        case 'Contributors':
            if (UserStore.authStatus) {
                if (active.id != '0') {
                    const permsGet = await getActivePerms()
                    if (!permsGet) {
                        resetActivePerms()
                        activeTab.value = oldTabValue
                    } else {
                        activeTab.value = newTabValue
                    }
                }
            }
        break;

        case 'Save':
            if (!UserStore.getAuthStatus()) {
                UserStore.openPopup("You need to be logged in to contribute questions!")

            } else if (!checkForInvalidFields(active)) {
                UserStore.openPopup("Please ensure that all your inputs are valid!")

            } else {
                
                // SAVE QUESTION TO SERVER

                const responsejson = await questionSave(active, active.id)
                if (responsejson.status == -1) {
                    // Error occured
                    const error = responsejson.error as ServerError
                    const errormsg = formatErrorMessage(error)
                    UserStore.openPopup(errormsg)
                } else if (responsejson.status == 1) {
                    // Failure
                    const error = responsejson.body as UserError
                    const errormsg = error.cause
                    UserStore.openBigPopup(errormsg)
                } else {
                    console.log(`Successfully saved question ${active.id}`)
                    const savedQn = responsejson.body as qn

                    // Success
                    if (active.id == '0') {

                        // New question
                        console.log("Displaying new question!")
                        const ID = savedQn['id']
                        removeFromContribute(active.id)
                        QuestionStore.insertIntoContribute(ID, savedQn)
                        changeDisplayedQuestion(ID)
                        UserStore.queueUserDataUpdate()

                    } else {

                        // Modified pre-existing question
                        QuestionStore.updateQn('contribute', active.id, savedQn)
                        QuestionStore.updateQn('database', active.id, savedQn)
                    }

                    // GET THE COMPILED QUESTION'S IMAGE
                    resetQnPreview()
                    
                    const lastModified = savedQn['lastModified']
                    active.lastModified = lastModified
                    displayQnPreview(lastModified)

                }
            }
            activeTab.value = oldTabValue
        break;

        case 'Delete':
            if (active.id == '0') {
                removeFromContribute(active.id)
            } else {

                // DELETE QUESTION FROM SERVER
                
                const responsejson = await questionDelete(active.id)   
                if (responsejson.status == -1) {
                    // Error occured
                    const error = responsejson.error as ServerError
                    const errormsg = formatErrorMessage(error)
                    UserStore.openPopup(errormsg)
                } else if (responsejson.status == 1) {
                    // Failure
                    const error = responsejson.body as UserError
                    const errorMsg = error.cause
                    UserStore.openPopup(errorMsg)
                } else {
                    // Success
                    UserStore.queueUserDataUpdate()
                    removeFromContribute(active.id)
                    QuestionStore.deleteFromDatabase(active.id)
                    changeDisplayedQuestion('0')
                    UserStore.openPopup("Deletion successful!")    
                }
            }
            activeTab.value = 0
        break
    }
}

function checkForInvalidFields(q : qn) {
    var ready = true
    if (
        q.question.trim().length == 0 ||
        q.category.length == 0 ||
        q.topic.length == 0
        // q.subtopic.length == 0 ||
        // !(q.sourceYear.length != 0 && /^\d+$/.test(q.sourceYear))
    ) {
        ready = false
    }
    return ready
}

        // When user perms are changed...

async function setPerms(type: 'modifyUsers' | 'modifyGroups' | 'readUsers' | 'readGroups' | 'public', name: string, action: 'add' | 'remove') {

    if (active.id == '0') {
        UserStore.openPopup('Please save the question before setting user permissions!')
        return false
    }

    const responsejson = await questionUpdatePerms(active.id, type, action, name)

    if (responsejson.status == -1) {
        // Error occured
        const error = responsejson.error as ServerError
        const errorMsg = formatErrorMessage(error)
        UserStore.openPopup(errorMsg)

    } else if (responsejson.status == 1) {
        // Failure
        const error = responsejson.body as UserError
        const errorMsg = error.cause
        UserStore.openPopup(errorMsg)

    } else {
        // Success
        await getActivePerms()
    }
}

async function getActivePerms() {
    if (active.id == '0') {
        resetActivePerms()
        return true
    }
    const responsejson = await questionGetPerms(active.id)
    if (responsejson.status == -1) {
        // Error occured
        const error = responsejson.error as ServerError
        const errormsg = formatErrorMessage(error)
        UserStore.openPopup(errormsg)
        resetActivePerms()
        return false

    } else if (responsejson.status == 1) {
        // Failure
        const error = responsejson.body as UserError
        const errorMsg = error.cause
        UserStore.openPopup(errorMsg)
        resetActivePerms()
        return false 

    } else {
        // Success
        const currentPerms = responsejson.body as userPerms
        Object.assign(activePerms, currentPerms)  
        return true

    }
}

function displayQnPreview(lastModified : string) {
    blobURL.value = getQnPreviewURL(active.id, lastModified)
}
function resetQnPreview() {
    blobURL.value = ""
}

function resetActivePerms() {
    Object.assign(activePerms, emptyUserPerms)
}

function dump() {
    console.log("Contribute ID List:")
    console.log(QuestionStore.getContributeIDList())
    console.log(IDlist.value)
    console.log("Active question:")
    console.log(active)
    console.log(active.id)
    console.log("Contribute questions:")
    console.log(QuestionStore.getContribute())
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
                internal-name="questionOptions" :font-size=21 :active-tab-index="activeTab"
                @change-tab="changeOptionTab"
            />
            
            <div id="question-container" v-show="activeTab == 0">
                <LatexPreview :source="blobURL"/>
                <LatexInput v-model:latex="active.question" 
                    :height="containerHeight" 
                    :placeholder="'Type LaTeX here:'"/>
            </div>

            <div id="solution-container" v-show="activeTab == 1">
                <LatexInput v-model:latex="active.solution[0]" 
                    :height="containerHeight" 
                    :placeholder="'Type LaTeX here:'"/>
                <div class="latex-preview" id="solution-latex-view">
                </div>
            </div>

            <div id="image-container" v-show="activeTab == 2" @click="dump">
                Image container to be implemented!
            </div>

            <div id="user-container" v-show="activeTab == 3">
                <UserPerms 
                    :user-perms="activePerms"
                    @set-perms="setPerms"
                />
            </div>

        </form>

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

    --latex-side-padding: 30px;
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

#question-save-button {
    background-color: white;
    border: 0;
    cursor: pointer;
}

</style>
  