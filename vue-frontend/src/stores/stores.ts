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

    function getIDList(targetArray : qn[]) {
        var idArr : string[] = []
        for (var i=0; i<targetArray.length; i++) {
            idArr.push(targetArray[i].displayID)
        }
        return idArr
    }

    function getQnIndexUsingID(targetStore : qnStore, dispID : string) {
        const match = (element : string) => element == dispID
        const i = targetStore.displayIDArray.findIndex(match)
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
                    return qnArr[i]
                break
                case 'build':
                    qnArr = build.qnArray
                    i = getQnIndexUsingID(build, dispID)
                    return qnArr[i]
                break
                case 'contribute':
                    qnArr = contribute.qnArray
                    i = getQnIndexUsingID(contribute, dispID)
                    return qnArr[i]
                break
            }
        }
    }

    function updateQn(storeName: string, dispID: string, data: qn) {
        if (allowedNames.includes(storeName)) {
            var i : number
            switch(storeName) {
                case 'database':
                    i = getQnIndexUsingID(database, dispID)
                    database.qnArray[i] = data
                break
                case 'build':
                    i = getQnIndexUsingID(build, dispID)
                    build.qnArray[i] = data
                break
                case 'contribute':
                    i = getQnIndexUsingID(contribute, dispID)
                    contribute.qnArray[i] = data
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

    // POPULATE ACTIONS
    function populateDatabase(v : qn[]) {
        Object.assign(database.qnArray, v)
        database.displayIDArray = getIDList(v)
    }
    function insertFromDatabaseToContribute(dispID : string) {
        if (getContributeIDList().includes(dispID)) {
            return false
        } else {
            const q = getQnUsingID('database', dispID) as qn
            contribute.displayIDArray.push(dispID)
            contribute.qnArray.push(q)
            return true
        }
    }
    function deleteFromContribute(dispID : string) {
        const i = getQnIndexUsingID(contribute, dispID)
        contribute.displayIDArray.splice(i, 1)
        contribute.qnArray.splice(i, 1)
        return true
    }
    function insertFromDatabaseToBuild(dispID : string) {
        if (getBuildIDList().includes(dispID)) {
            return false
        } else {
            const q = getQnUsingID('database', dispID) as qn
            build.displayIDArray.push(dispID)
            build.qnArray.push({...q})
            return true
        }
    }
    function deleteFromBuild(dispID : string) {
        const i = getQnIndexUsingID(build, dispID)
        build.displayIDArray.splice(i, 1)
        build.qnArray.splice(i, 1)
        return true
    }

    return{ 
        getQnUsingID, updateQn,
        getDatabase, getContribute, getBuild, 
        getContributeIDList, getBuildIDList, 
        resetDatabase, resetContribute, resetBuild, 
        populateDatabase,
        insertFromDatabaseToBuild, deleteFromBuild,
        insertFromDatabaseToContribute, deleteFromContribute
    }
})