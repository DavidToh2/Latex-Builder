<script setup lang="ts">

import { reactive, onActivated, ref } from 'vue';

import { useUserStore } from '@/stores/userStore';
import { useQuestionStore } from '@/stores/questionStore';
import type { userData } from '@/types/UserTypes';
import { emptyUserData } from '@/types/UserTypes';
import type { UserError, ServerError } from '@/types/ErrorTypes'
import { formatErrorMessage } from '@/types/ErrorTypes'

import Title from '../PageTitle.vue';
import Popup from '../Common/Popup/Popup.vue'

import { authLogout } from '@/post/postAuth'

const UserStore = useUserStore()
const QuestionStore = useQuestionStore()

async function logoutUser() {
    const responsejson = await authLogout()
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

    } else if (responsejson.status == 0) {
        UserStore.setAuthStatus(false)
        UserStore.clearUserData()

        emits('logout')
    }
}

const userdata = reactive<userData>({...emptyUserData})

onActivated(() => {
    const u = UserStore.getUserData()
    console.log(u)
    Object.assign(userdata, u)
})

const emits = defineEmits<{
    (e: 'logout'): void,
    (u: 'updateUserData'): void
}>()

const popupActive = ref(false)
const popupText = ref('')
function closePopup() {
    popupActive.value = false
}
function openPopup(msg : string) {
    popupActive.value = true
    popupText.value = msg
}

</script>

<template>
    <div id="account-page-container">

        <Title :title="'Welcome, ' + userdata.username+ '!'"/>

        <div id="account">
            <div id="account-infobox">
                <div class="account-info-description">Username: </div>
                <div class="account-info">{{ userdata.username }}</div>

                <div class="account-info-description">Bio:</div>
                <div class="account-info">{{ userdata.socialData.bio }}</div>

                <div class="account-info-description">Email:</div>
                <div class="account-info">{{ userdata.socialData.email }}</div>

                <div class="account-info-description">Account Status:</div>
                <div class="account-info">{{ userdata.accountStatus }}</div>

                <div class="account-info-description">Questions:</div>
                <div class="account-info" style="display: flex; flex-direction: row;">
                    <div v-for="(item, index) in userdata.questions">{{ item }}</div>
                </div>
            </div>
        </div>

        <div id="logout-button" class="btn" v-on:click="logoutUser">
            Logout
        </div>

    </div>

    <Popup :is-active="popupActive" @close="closePopup">
        <span v-html="popupText"></span>
    </Popup>
</template>

<style scoped>

#account-page-container {
    width: 100%;
    font-size: var(--font-size);
}

#account {
    border-top: 1px solid black;
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
}

#account-infobox {
    width: 400px;
    font-size: var(--font-size-lg2);

    display: grid;
    grid: auto / 200px 200px;
    grid-column-gap: 20px;
    grid-row-gap: 10px;
}

.account-info-description {
    justify-self: end
}

#logout-button {
    width: 200px;
}

</style>