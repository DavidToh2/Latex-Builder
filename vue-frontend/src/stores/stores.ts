import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { qn } from '@/types/Types'
import { emptyQn } from '@/types/Types'

interface qnStore {
    displayIDArray: string[],          // Used to speed up searching through indexes
    qnArray: qn[]
}

const initStore : qnStore = {
    displayIDArray: [],
    qnArray: []
}
const initContributeStore : qnStore = {
    displayIDArray: ['0'],
    qnArray: [{...emptyQn}]
}

export const useQuestionStore = defineStore('QuestionStore', () => {

    // STATES
    const database : qnStore = reactive(structuredClone(initStore))
    const contribute : qnStore = reactive(structuredClone(initContributeStore))
    const build : qnStore = reactive(structuredClone(initStore))
    const allowedNames = ['database', 'build', 'contribute']

    function extractIDFromQuestions(targetArray : qn[]) {
        var idArr : string[] = []
        for (var i=0; i<targetArray.length; i++) {
            idArr.push(targetArray[i].displayID)
        }
        return idArr
    }

    function getQnIndexUsingID(targetStore : qnStore, dispID : string) {
        const match = (element : string) => element == dispID
        const i = targetStore.displayIDArray.findIndex(match)       // Returns -1 on failure
        return i
    }

    function getQnUsingID(storeName : string, dispID : string) {
        if (allowedNames.includes(storeName)) {
            var qnArr : qn[]
            var i : number
            switch(storeName) {
                case 'database':
                    qnArr = database.qnArray
                    i = getQnIndexUsingID(database, dispID)
                    if (i > -1) {
                        return qnArr[i]
                    } else {
                        return false
                    }
                break
                case 'build':
                    qnArr = build.qnArray
                    i = getQnIndexUsingID(build, dispID)
                    if (i > -1) {
                        return qnArr[i]
                    } else {
                        return false
                    }
                break
                case 'contribute':
                    qnArr = contribute.qnArray
                    i = getQnIndexUsingID(contribute, dispID)
                    if (i > -1) {
                        return qnArr[i]
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
                    i = getQnIndexUsingID(database, dispID)
                    if (i > -1) {
                        database.qnArray[i] = data
                        return true
                    } else {
                        return false
                    }
                break
                case 'build':
                    i = getQnIndexUsingID(build, dispID)
                    if (i > -1) {
                        build.qnArray[i] = data
                        return true
                    } else {
                        return false
                    }
                break
                case 'contribute':
                    i = getQnIndexUsingID(contribute, dispID)
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

        // GETTERS (These objects are returned by reference and can be directly mutated)

    function getDatabase() {
        return database.qnArray
    }
    function getContribute() {
        return contribute.qnArray
    }
    function getBuild() {
        return build.qnArray
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
        build.qnArray = []
    }

            // POPULATE THE DATABASE

    function populateDatabase(v : qn[]) {
        Object.assign(database.qnArray, v)
        database.displayIDArray = extractIDFromQuestions(v)
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
        const i = getQnIndexUsingID(contribute, dispID)
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
        const i = getQnIndexUsingID(contribute, dispID)
        if (i > -1) {
            contribute.displayIDArray.splice(i, 1)
            contribute.qnArray.splice(i, 1)
            return true
        } else {
            return false
        }
    }

            // POPULATE THE BUILD STORE

    function insertFromDatabaseToBuild(dispID : string) {
        if (getBuildIDList().includes(dispID)) {
            return false
        } else {
            const r = getQnUsingID('database', dispID)
            if (r) {
                const q = r as qn
                build.displayIDArray.push(dispID)
                build.qnArray.push(q)
                return true
            } else {
                return false
            }
        }
    }
    function deleteFromBuild(dispID : string) {
        const i = getQnIndexUsingID(build, dispID)
        if (i > -1) {
            build.displayIDArray.splice(i, 1)
            build.qnArray.splice(i, 1)
            return true
        } else {
            return false
        }
        
    }

    return{ 
        getQnUsingID, updateQn,
        getDatabase, getContribute, getBuild, 
        getContributeIDList, getBuildIDList, 
        resetDatabase, resetContribute, resetBuild, 
        populateDatabase, insertIntoDatabase, deleteFromDatabase,
        insertFromDatabaseToBuild, deleteFromBuild,
        insertIntoContribute, insertFromDatabaseToContribute, deleteFromContribute
    }
})