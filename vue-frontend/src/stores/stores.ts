import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { qn } from '@/types/Types'

export const useQuestionStore = defineStore('QuestionStore', () => {

    // STATES
    const database = ref([] as qn[])
    const contribute = ref([] as qn[])
    const build = ref([] as qn[])

    // GETTERS
    function getDatabase() {
        return database.value
    }
    function getContribute() {
        return contribute.value
    }
    function getBuild() {
        return build.value
    }

    // RESET ACTIONS
    function resetDatabase() {
        database.value = []
    }
    function resetContribute() {
        contribute.value = []
    }
    function resetBuild() {
        build.value = []
    }

    // POPULATE ACTIONS
    function populateDatabase(v : qn[]) {
        database.value = v
    }

    return{ getDatabase, getContribute, getBuild, resetDatabase, resetContribute, resetBuild, populateDatabase }
})