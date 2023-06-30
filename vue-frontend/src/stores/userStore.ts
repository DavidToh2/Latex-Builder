import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import type { userData } from '@/types/Types'
import { emptyUserData } from '@/types/Types'

// THE USER STORE: stores information about the current user.

export const useUserStore = defineStore('UserStore', () => {

    const user : userData = reactive(structuredClone(emptyUserData))
    const dataStatus = ref(false)
    const authStatus = ref(false)

    function setUserData(data : userData) {
        dataStatus.value = true
        Object.assign(user, {...data})
    }
    function getUserData() {
        return user
    }
    function clearUserData() {
        dataStatus.value = false
        Object.assign(user, emptyUserData)
    }
    function getUserDataStatus() {
        return dataStatus.value
    }

    function setAuthStatus(b : boolean) {
        authStatus.value = b
    }
    function getAuthStatus() {
        return authStatus.value
    }

    return {
        setUserData, getUserData, clearUserData, getUserDataStatus,
        setAuthStatus, getAuthStatus
    }
    
})