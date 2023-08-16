import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import type { userData } from '@/types/UserTypes'
import { emptyUserData } from '@/types/UserTypes'

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
        return true
    }
    function getAuthStatus() {
        return authStatus.value
    }

    // This function is called when something else is done somewhere else in the system, and userdata needs to be updated.
    // For example, when a user contributes a new question, and so his questions[] array needs to be updated,
    // or when a user joins a new group, and so his groups[] array needs to be updated.
    function queueUserDataUpdate() {
        return true
    }

    const leftView = ref('HomeView')
    const rightView = ref('AccountView')
    const newView = ref('')

    function setLeftView(newView : string) {
        leftView.value = newView
    }
    function setRightView(newView : string) {
        rightView.value = newView
    }
    function displayView(v: string) {
        newView.value = v
        return true
    }
    function getNewView() {
        return newView.value
    }
    function getViewName(side : string) {
        if (side == 'left') {
            return leftView.value
        } else if (side == 'right') {
            return rightView.value
        } else {
            return 'none'
        }
    }
    function getViewSide(v : string) {
        if (v == leftView.value) {
            return 'left'
        } else if (v = rightView.value) {
            return 'right'
        } else {
            return 'none'
        }
    }

    const popupHTML = ref('')
    const popupSize = ref(0)

    function openPopup(html : string) {
        popupSize.value = 1
        popupHTML.value = html
    }
    function openBigPopup(html : string) {
        popupSize.value = 3
        popupHTML.value = html
    }
    function closePopup() {
        popupSize.value = 0
        popupHTML.value = ''
    }
    function getPopupStatus() {
        return [popupSize.value, popupHTML.value]
    }

    return {
        user, dataStatus, authStatus,
        leftView, rightView, newView,
        setUserData, getUserData, clearUserData, getUserDataStatus,
        setAuthStatus, getAuthStatus,

        queueUserDataUpdate,
        
        setLeftView, setRightView, displayView, getNewView, getViewName, getViewSide,

        openPopup, openBigPopup, closePopup, getPopupStatus
    }
    
},
{
    persist: true
})