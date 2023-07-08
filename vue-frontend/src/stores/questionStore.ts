import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import type { qn, qnFilters } from '@/types/Types'
import type { latex, latexEnum, latexHeading, latexTypes, worksheetElement } from '@/types/WorksheetTypes'
import { emptyQn, emptyFilters } from '@/types/Types'

import { latexTypeStrings } from '@/types/WorksheetTypes' 

        // THE QUESTION STORE: stores all questions active or displayed in the user's current browsing session.

interface qnStore {
    displayIDArray: string[],          // Used to speed up searching through indexes
    qnArray: qn[]
}
interface worksheetStore {
    displayIDArray: string[],
    wsArray: worksheetElement[]
}

const initStore : qnStore = {
    displayIDArray: [],
    qnArray: []
}
const initContributeStore : qnStore = {
    displayIDArray: ['0'],
    qnArray: [{...emptyQn}]
}
const initWorksheetStore : worksheetStore = {
    displayIDArray: [],
    wsArray: []
}

export const useQuestionStore = defineStore('QuestionStore', () => {

    // STATES
    const database : qnStore = reactive(structuredClone(initStore))
    const contribute : qnStore = reactive(structuredClone(initContributeStore))
    const build : worksheetStore = reactive(structuredClone(initWorksheetStore))
    const allowedNames = ['database', 'build', 'contribute']

            // Get display IDs from a list of qns / worksheet elements

    function extractQuestionIDs(targetArray : qn[]) {
        var idArr : string[] = []
        for (var i=0; i<targetArray.length; i++) {
            idArr.push(targetArray[i].displayID)
        }
        return idArr
    }

    function extractWorksheetElementIDs(targetArray : worksheetElement[]) {
        var idArr : string[] = []
        for (var i=0; i<targetArray.length; i++) {
            const b = targetArray[i].body
            const bt = typeof(b)
            if (['qn', 'latex', 'latexHeading', 'latexEnum'].includes(bt)) {
                const c = b as qn | latexTypes
                idArr.push(c.displayID)
            }
        }
        return idArr
    }

            // Get index of object in array, using its display ID

    function getObjectIndexUsingID(targetStore : qnStore | worksheetStore, dispID : string) {
        const match = (element : string) => element == dispID
        const i = targetStore.displayIDArray.findIndex(match)       // Returns -1 on failure
        return i
    }

            // Return question given its display ID

    function getQnUsingID(storeName : string, dispID : string) {
        if (allowedNames.includes(storeName)) {
            var i : number
            switch(storeName) {
                case 'database':
                    var qnArr = database.qnArray as qn[]
                    i = getObjectIndexUsingID(database, dispID)
                    if (i > -1) {
                        return qnArr[i]
                    } else {
                        return false
                    }
                break
                case 'contribute':
                    var qnArr = contribute.qnArray as qn[]
                    i = getObjectIndexUsingID(contribute, dispID)
                    if (i > -1) {
                        return qnArr[i]
                    } else {
                        return false
                    }
                break
            }
        }
    }

            // Return worksheet element given its display ID

    function getElementUsingID(storeName : string, dispID : string) {
        if (allowedNames.includes(storeName)) {
            var i : number
            switch(storeName) {
                case 'build':
                    var wsArr = build.wsArray as worksheetElement[]
                    i = getObjectIndexUsingID(build, dispID)
                    if (i > -1) {
                        return wsArr[i].body
                    } else {
                        return false
                    }
                break
            }
        }
    }

    // Updates changes to a question

    function updateQn(storeName: string, dispID: string, data: qn) {
        if (allowedNames.includes(storeName)) {
            var i : number
            switch(storeName) {
                case 'database':
                    i = getObjectIndexUsingID(database, dispID)
                    if (i > -1) {
                        database.qnArray[i] = data
                        return true
                    } else {
                        return false
                    }
                break
                case 'contribute':
                    i = getObjectIndexUsingID(contribute, dispID)
                    if (i > -1) {
                        contribute.qnArray[i] = data
                        return true
                    } else {
                        return false
                    }
                break
            }
        }
    }

    // Update changes to a worksheet element

    function updateElement(storeName: string, dispID: string, data: worksheetElement) {
        if (allowedNames.includes(storeName)) {
            var i : number
            switch(storeName) {
                case 'build':
                    i = getObjectIndexUsingID(build, dispID)
                    if (i > -1) {
                        build.wsArray[i] = data
                        return true
                    } else {
                        return false
                    }
                break
            }
        }
    }

        // GETTERS (These objects are returned by reference and can be directly mutated)

    function getDatabase() {
        return database.qnArray
    }
    function getContribute() {
        return contribute.qnArray
    }
    function getBuild() {
        return build.wsArray
    }
    function getContributeIDList() {
        return contribute.displayIDArray
    }
    function getBuildIDList() {
        return build.displayIDArray
    }

            // RESET ACTIONS

    function resetDatabase() {
        database.displayIDArray = []
        database.qnArray = []
    }
    function resetContribute() {
        contribute.displayIDArray = ['0']
        contribute.qnArray = [{...emptyQn}]
    }
    function resetBuild() {
        build.displayIDArray = []
        build.wsArray = []
    }

            // POPULATE THE DATABASE

    function populateDatabase(v : qn[]) {
        Object.assign(database.qnArray, v)
        database.displayIDArray = extractQuestionIDs(v)
    }
    function insertIntoDatabase(dispID : string, q : qn) {
        if (database.displayIDArray.includes(dispID)) {
            return false
        } else {
            database.displayIDArray.push(dispID)
            database.qnArray.push(q)
            return true
        }
    }
    function deleteFromDatabase(dispID: string) {
        const i = getObjectIndexUsingID(contribute, dispID)
        if (i > -1) {
            database.displayIDArray.splice(i, 1)
            database.qnArray.splice(i, 1)
            return true
        } else {
            return false
        }
    }

            // POPULATE CONTRIBUTE

    function insertIntoContribute(dispID: string, q : qn) {
        if (contribute.displayIDArray.includes(dispID)) {
            return false
        } else {
            contribute.displayIDArray.push(dispID)
            contribute.qnArray.push(q)
            return true
        }
    }
    function insertFromDatabaseToContribute(dispID : string) {
        const r = getQnUsingID('database', dispID)
        if (r) {
            const q = r as qn
            if (insertIntoContribute(dispID, q)) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
    function deleteFromContribute(dispID : string) {
        const i = getObjectIndexUsingID(contribute, dispID)
        if (i > -1) {
            contribute.displayIDArray.splice(i, 1)
            contribute.qnArray.splice(i, 1)
            return true
        } else {
            return false
        }
    }

            // POPULATE THE BUILD STORE

    function insertElementIntoBuild(e : worksheetElement, i : number) {
        if (latexTypeStrings.includes(e.type) || e.type == 'placeholder') {
            build.displayIDArray.splice(i, 0, (e.body as latexTypes).displayID)
            build.wsArray.splice(i, 0, e)
            return true
        } else {
            return false
        }
    }

    function insertQnFromDatabaseToBuild(dispID : string) {
        if (getBuildIDList().includes(dispID)) {
            return false
        } else {
            const r = getQnUsingID('database', dispID)
            if (r) {
                const q = {
                    type: 'qn',
                    body: r
                } as worksheetElement
                build.displayIDArray.push(dispID)
                build.wsArray.push(q)

                return true
            } else {
                return false
            }
        }
    }
    function deleteFromBuild(dispID : string) {
        const i = getObjectIndexUsingID(build, dispID)
        deleteIndexFromBuild(i)
    }
    function deleteIndexFromBuild(i : number) {
        if (i > -1) {
            build.displayIDArray.splice(i, 1)
            build.wsArray.splice(i, 1)
            return true
        } else {
            return false
        }
    }
    function swapTwoElementsInBuild(i1 : number, i2 : number) {
        if (i1 != i2) {

            const e1 = build.wsArray[i1]
            const id1 = build.displayIDArray[i1]
            const e2 = build.wsArray[i2]
            const id2 = build.displayIDArray[i2]

            build.wsArray.splice(i1, 1, e2)
            build.wsArray.splice(i2, 1, e1)
            build.displayIDArray.splice(i1, 1, id2)
            build.displayIDArray.splice(i2, 1, id1)

            return true
        } else {
            return false
        }
    }

                // COMPONENT STATE FUNCTIONS
    
    const contributeActiveQnID = ref('')
    const databaseFilters : qnFilters = reactive(structuredClone(emptyFilters))
    
    function saveContributeActiveQnID(ad : string) {
        contributeActiveQnID.value = ad
    }
    function getContributeActiveQnID() {
        return contributeActiveQnID
    }
    function saveDatabaseQuestionFilters(f : qnFilters) {
        Object.assign(databaseFilters, f)
    }
    function getDatabaseQuestionFilters() {
        return databaseFilters
    }

                // PDF DISPLAY

    const displayPDFName = ref('')

    function setDisplayPDFName(f : string) { 
        displayPDFName.value = f
        return true
    }
    function getDisplayPDFName() { 
        return displayPDFName.value
    }
    function resetDisplayPDFName() {
        displayPDFName.value = ''
        return true
    }

    return { 
        // Workspace view stores
        database, contribute, build,
        // Workspace view state variables
        contributeActiveQnID, databaseFilters,
        
        // Question functions
        getQnUsingID, updateQn,
        // Worksheet element functions
        getElementUsingID, updateElement,

        // Store getters
        getDatabase, getContribute, getBuild, 
        // ID List getters
        getContributeIDList, getBuildIDList, 
        // Store resetters
        resetDatabase, resetContribute, resetBuild, 

        // Database store functions
        populateDatabase, insertIntoDatabase, deleteFromDatabase,
        // Contribute store functions
        insertIntoContribute, insertFromDatabaseToContribute, deleteFromContribute,
        // Build store functions
        insertElementIntoBuild, insertQnFromDatabaseToBuild, deleteFromBuild, deleteIndexFromBuild, swapTwoElementsInBuild,


        // Component state functions
        saveContributeActiveQnID, getContributeActiveQnID,
        saveDatabaseQuestionFilters, getDatabaseQuestionFilters,

        // Display PDF state
        setDisplayPDFName, getDisplayPDFName, resetDisplayPDFName
    }
},
{
    // persist: {
    //     storage: sessionStorage
    // }
})

