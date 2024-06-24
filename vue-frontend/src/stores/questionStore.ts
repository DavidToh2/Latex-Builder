import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import type { qn, qnFilters } from '@/types/QuestionTypes'
import type { latex, latexEnum, latexHeading, latexTypes, worksheetElement, worksheetConfig, worksheetPage, worksheetTitle, worksheetText } from '@/types/WorksheetTypes'
import { emptyQn, emptyFilters } from '@/types/QuestionTypes'
import { emptyWorksheetConfig } from '@/types/WorksheetTypes'

import { latexTypeStrings } from '@/types/WorksheetTypes' 

        // THE QUESTION STORE: stores all questions active or displayed in the user's current browsing session.

interface qnStore {
    qnArray: qn[]
}
interface worksheetStore {
    wsArray: worksheetElement[]
}

const initStore : qnStore = {
    qnArray: []
}
const initWorksheetStore : worksheetStore = {
    wsArray: []
}

interface contributeStore {
    qnArray: qn[],
    activeID: string
}
interface databaseStore {
    qnArray: qn[],
    filters: qnFilters
}
interface buildStore {
    wsArray: worksheetElement[],
    wsConfig: worksheetConfig
}
const initContributeStore : contributeStore = {
    qnArray: [{...emptyQn}],
    activeID: '0'
}
const initDatabaseStore : databaseStore = {
    qnArray: [],
    filters: emptyFilters
}
const initBuildStore : buildStore = {
    wsArray: [],
    wsConfig: emptyWorksheetConfig
}

export const useQuestionStore = defineStore('QuestionStore', () => {

    // STATES
    const contribute : contributeStore = reactive(structuredClone(initContributeStore))
    const database : databaseStore = reactive(structuredClone(initDatabaseStore))
    const build : buildStore = reactive(structuredClone(initBuildStore))
    const allowedNames = ['contribute', 'database', 'build']

            // Get IDs from a list of qns / worksheet elements

    function extractQnIDs(targetArray : qn[]) {
        var idArr : string[] = []
        for (var i=0; i<targetArray.length; i++) {
            idArr.push(targetArray[i].id)
        }
        return idArr
    }

    function extractWsElementIDs(targetArray : worksheetElement[]) {
        var idArr : string[] = []
        for (var i=0; i<targetArray.length; i++) {
            const b = targetArray[i].body
            const bt = targetArray[i].type
            if (['qn', 'latex', 'latexHeading', 'latexEnum'].includes(bt)) {
                const c = b as qn | latexTypes
                idArr.push(c.id)
            }
        }
        return idArr
    }

            // Get index of object in array, using its display ID

    function getQnIndexUsingID(targetStore : contributeStore | databaseStore, ID : string) {
        const match = (element : qn) => {return (element.id == ID)}
        const i = targetStore.qnArray.findIndex(match)       // Returns -1 on failure
        return i
    }

    function getElementIndexUsingID(targetStore : buildStore, ID : string) {
        const match = (element : worksheetElement) => {return (element.body.id == ID)}
        const i = targetStore.wsArray.findIndex(match)       // Returns -1 on failure
        return i
    }

            // Gets question by value

    function getQnUsingID(storeName : string, ID : string) {
        if (allowedNames.includes(storeName)) {
            var i : number
            switch(storeName) {
                case 'database':
                    var qnArr = database.qnArray as qn[]
                    i = getQnIndexUsingID(database, ID)
                    if (i > -1) {
                        return {...qnArr[i]}
                    } else {
                        return false
                    }
                break
                case 'contribute':
                    var qnArr = contribute.qnArray as qn[]
                    i = getQnIndexUsingID(contribute, ID)
                    if (i > -1) {
                        return {...qnArr[i]}
                    } else {
                        return false
                    }
                break
            }
        }
    }

            // Gets worksheet element by value

    function getElementUsingID(storeName : string, ID : string) {
        if (allowedNames.includes(storeName)) {
            var i : number
            switch(storeName) {
                case 'build':
                    var wsArr = build.wsArray as worksheetElement[]
                    i = getElementIndexUsingID(build, ID)
                    if (i > -1) {
                        return {...wsArr[i]}
                    } else {
                        return false
                    }
                break
            }
        }
    }

            // Updates changes to a question by value

    function updateQn(storeName: string, ID: string, data: qn) {
        if (allowedNames.includes(storeName)) {
            var i : number
            switch(storeName) {
                case 'database':
                    i = getQnIndexUsingID(database, ID)
                    if (i > -1) {
                        Object.assign(database.qnArray[i], data)
                        return true
                    } else {
                        return false
                    }
                break
                case 'contribute':
                    i = getQnIndexUsingID(contribute, ID)
                    if (i > -1) {
                        Object.assign(contribute.qnArray[i], data)
                        return true
                    } else {
                        return false
                    }
                break
            }
        }
    }

            // Update changes to a worksheet element by value

    function updateElement(storeName: string, ID: string, data: worksheetElement) {
        if (allowedNames.includes(storeName)) {
            var i : number
            switch(storeName) {
                case 'build':
                    i = getElementIndexUsingID(build, ID)
                    if (i > -1) {
                        Object.assign(build.wsArray[i], data)
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
        return extractQnIDs(contribute.qnArray)
    }
    function getDatabaseIDList() {
        return extractQnIDs(database.qnArray)
    }
    function getBuildIDList() {
        return extractWsElementIDs(build.wsArray)
    }
    function getQnDisplayID(q : qn) {
        const stArr = []
        // if ((q.category).length == 0) {
        //     stArr.push('0')
        // }
        if ((q.category).includes('Mathematics')) {
            stArr.push('M')
        }
        if ((q.category).includes('Computer Science')) {
            stArr.push('CS')
        }
        stArr.push(q.id)
        return (stArr.join(''))
    }
    function getContributeDisplayIDList() {
        const dispIDArr = <string[]>[]
        contribute.qnArray.forEach((qn, index) => {
            dispIDArr.push(getQnDisplayID(qn))
        })
        return dispIDArr
    }
    function getDatabaseDisplayIDList() {
        const dispIDArr = <string[]>[]
        database.qnArray.forEach((qn, index) => {
            dispIDArr.push(getQnDisplayID(qn))
        })
        return dispIDArr
    }

            // RESET ACTIONS

    function resetDatabase() {
        database.qnArray = []
        return true
    }
    function resetContribute() {
        contribute.qnArray = [{...emptyQn}]
        return true
    }
    function resetBuild() {
        build.wsArray = []
        return true
    }

            // POPULATE THE DATABASE (by value)

    function populateDatabase(v : qn[]) {
        database.qnArray = v
    }
    function deleteFromDatabase(ID : string) {
        // Does not delete or clear local javascript object
        const i = getQnIndexUsingID(database, ID)
        if (i > -1) {
            database.qnArray.splice(i, 1)
            return true
        } else {
            return false
        }
    }

            // POPULATE CONTRIBUTE (by value)

    function insertIntoContribute(ID : string, q : qn) {
        if (getContributeIDList().includes(ID)) {
            return false
        } else {
            contribute.qnArray.push(q)
            return true
        }
    }
    function insertFromDatabaseToContribute(ID : string) {
        const r = getQnUsingID('database', ID)
        if (r) {
            const q = r as qn
            if (insertIntoContribute(ID, q)) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
    function deleteFromContribute(ID : string) {
        // Does not delete or clear local javascript object
        const i = getQnIndexUsingID(contribute, ID)
        if (i > -1) {
            contribute.qnArray.splice(i, 1)
            return true
        } else {
            return false
        }
    }
    function setContributeActiveID(ID : string) {
        contribute.activeID = ID
    }

            // POPULATE THE BUILD STORE

    function insertElementIntoBuild(e : worksheetElement, index : number) {
        if (latexTypeStrings.includes(e.type) || e.type == 'placeholder') {
            build.wsArray.splice(index, 0, structuredClone(e))
            return true
        } else {
            return false
        }
    }

    function insertQnFromDatabaseToBuild(ID : string) {
        if (getBuildIDList().includes(ID)) {
            return false
        } else {
            const r = getQnUsingID('database', ID)
            if (r) {
                const q = {
                    type: 'qn',
                    body: r
                } as worksheetElement
                build.wsArray.push(q)

                return true
            } else {
                return false
            }
        }
    }
    function deleteElementFromBuild(ID : string) {
        const i = getElementIndexUsingID(build, ID)
        deleteIndexFromBuild(i)
        return true
    }
    function deleteIndexFromBuild(index : number) {
        if (index > -1) {
            build.wsArray.splice(index, 1)
            return true
        } else {
            return false
        }
    }
    function swapTwoElementsInBuild(i1 : number, i2 : number) {
        if (i1 != i2) {

            const e1 = build.wsArray[i1]
            const e2 = build.wsArray[i2]

            build.wsArray.splice(i1, 1, e2)
            build.wsArray.splice(i2, 1, e1)

            return true
        } else {
            return false
        }
    }

                // UPDATE BUILD WS CONFIG

    function getBuildworksheetConfig() {
        return build.wsConfig
    }
    function setBuildWorksheetTitle(t : worksheetTitle) {
        Object.assign(build.wsConfig.title, t)
        return true
    }
    function setBuildWorksheetPage(p : worksheetPage) {
        Object.assign(build.wsConfig.page, p)
        return true
    }
    function setBuildWorksheetText(t : worksheetText) {
        Object.assign(build.wsConfig.text, t)
        return true
    }
    function setBuildWorksheetTemplate(s : string) {
        build.wsConfig.template = s
        return true
    }

                // COMPONENT STATE FUNCTIONS
    
    function saveContributeActiveQnID(ad : string) {
        contribute.activeID = ad
    }
    function getContributeActiveQnID() {
        return contribute.activeID
    }
    function setDatabaseQuestionFilters(f : qnFilters) {
        Object.assign(database.filters, f)
    }
    function getDatabaseQuestionFilters() {
        return {...database.filters}
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
        
        // Question functions
        getQnUsingID, updateQn,
        // Worksheet element functions
        getElementUsingID, updateElement,

        // Store getters
        getDatabase, getContribute, getBuild, 
        // ID List getters
        getDatabaseIDList, getContributeIDList, getBuildIDList,
        getQnDisplayID, 
        getDatabaseDisplayIDList, getContributeDisplayIDList,
        // Store resetters
        resetDatabase, resetContribute, resetBuild, 

        // Database store functions
        populateDatabase, deleteFromDatabase,
        // Contribute store functions
        insertIntoContribute, insertFromDatabaseToContribute, deleteFromContribute, setContributeActiveID,
        // Build store functions
        insertElementIntoBuild, insertQnFromDatabaseToBuild, deleteElementFromBuild, deleteIndexFromBuild, swapTwoElementsInBuild,


        // Component state functions
        saveContributeActiveQnID, getContributeActiveQnID,
        setDatabaseQuestionFilters, getDatabaseQuestionFilters,

        // Build worksheet config
        getBuildworksheetConfig, setBuildWorksheetPage, setBuildWorksheetTemplate, setBuildWorksheetText, setBuildWorksheetTitle,

        // Display PDF state
        setDisplayPDFName, getDisplayPDFName, resetDisplayPDFName,
    }
},
{
    // persist: {
    //     storage: sessionStorage
    // }
})

