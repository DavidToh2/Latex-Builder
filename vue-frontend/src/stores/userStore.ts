import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import type { userData } from '@/types/Types'
import { emptyUserData } from '@/types/Types'

// THE USER STORE: stores information about the current user.

export const useUserStore = defineStore('UserStore', () => {

    const user : userData = reactive(structuredClone(emptyUserData))
    const authStatus = ref(true)

    function setUserData(data : userData) {
        Object.assign(user, data)
    }

    function clearUserData() {
        Object.assign(user, emptyUserData)
    }

    function setAuthStatus(b : boolean) {
        authStatus.value = b
    }

    return {
        setUserData, clearUserData, setAuthStatus
    }
    
})