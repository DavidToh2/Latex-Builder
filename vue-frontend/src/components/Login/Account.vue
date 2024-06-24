<script setup lang="ts">

import { reactive, onMounted, ref, computed } from 'vue'

import { useUserStore } from '@/stores/userStore'
import type { userData } from '@/types/UserTypes'
import { emptyUserData } from '@/types/UserTypes'
import type { UserError, ServerError } from '@/types/ErrorTypes'
import { formatErrorMessage } from '@/types/ErrorTypes'

import Title from '../PageTitle.vue'
import HoverIcon from '../Common/HoverIcon.vue'
import Tab from '../Tab/Tab.vue'

import { authLogout, authSetPassword, authSetUserInfo, authDeleteOwnAccount } from '@/post/postAuth'

const UserStore = useUserStore()

const leftTabs = ['Account', 'Groups']
const rightTabs : string[] = ['Logout']
const activeTab = ref(0)

const emits = defineEmits<{
    (e: 'logout'): void,
    (e: 'changePassword', b: boolean): void,
    (e: 'deleteUser'): void,
    (e: 'updateUserData'): void
}>()

async function logoutUser() {
    const responsejson = await authLogout()
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

    } else if (responsejson.status == 0) {
        UserStore.setAuthStatus(false)
        UserStore.clearUserData()

        emits('logout')
    }
}

const userdata = reactive<userData>(structuredClone(emptyUserData))
const newuserdata = reactive<userData>(structuredClone(emptyUserData))

onMounted(() => {
    setUserData()
})

UserStore.$onAction(
	({name, store, args, after, onError}) => {
		if (name == 'setUserData') {
			after((result) => {
				setUserData()
			})
		}
	}
)

function setUserData() {
    const u = UserStore.getUserData()
    console.log("Displaying user data...")
    Object.assign(userdata, u)
}

const userDataEditing = ref(false)

function editUserData() {
    userDataEditing.value = true
    newuserdata.socialData.bio = userdata.socialData.bio
}

async function saveUserData() {
    userdata.socialData.bio = newuserdata.socialData.bio
    userDataEditing.value = false
    const responsejson = await authSetUserInfo({...userdata})
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

    } else if (responsejson.status == 0) {
        UserStore.setUserData({...userdata})
    }
}

function cancelUserDataEdit() {
    newuserdata.socialData.bio = userdata.socialData.bio
    userDataEditing.value = false
}

function changeAccountTab(s : string, newTab : number) {
    switch(s) {
        case 'Account':

        break
        case 'Groups':

        break
        case 'Questions':

        break

        case 'Logout':
            logoutUser()
        break
    }
    activeTab.value = newTab
}

const pwdDisplay = ref(false)
const pwdInputType = computed<string>(() => {
    if (pwdDisplay.value) {return "text"} else {return "password"}
})
const changePasswordFail = ref(false)
const changePasswordFailMessage = ref('')

async function changePassword() {
    const f = document.querySelector('form#change-password') as HTMLFormElement
    // Compare new password
    const newPassword1 = f.querySelector('input[name="newpassword"]') as HTMLInputElement
    const newPassword2 = f.querySelector('input[name="newpassword-2"]') as HTMLInputElement
    if (newPassword1.value == newPassword2.value) {

        // Backend will verify old password, then if okay, set the new password.
        const responsejson = await authSetPassword(f)
        if (responsejson.status == -1) {
            // Error occured
            const error = responsejson.error as ServerError
            const errormsg = formatErrorMessage(error)
            UserStore.openPopup(errormsg)

        } else if (responsejson.status == 1) {
            // Failure
            const error = responsejson.body as UserError
            const errorMsg = error.cause
            changePasswordFailure(errorMsg)

        } else if (responsejson.status == 0) {
            UserStore.setAuthStatus(false)
            UserStore.clearUserData()
            emits('changePassword', true)
        }

    } else {
        changePasswordFailure('Your new passwords do not match!')
    }
}

function changePasswordFailure(msg : string) {
    if (msg) {
        changePasswordFail.value = true
        changePasswordFailMessage.value = msg
    } else {
        changePasswordFail.value = false
        changePasswordFailMessage.value = ''
    }
}

const deleteAccountWarnDisplay = ref(false)
function deleteAccount1() {
    deleteAccountWarnDisplay.value = true
}
async function deleteAccount2(b : boolean) {
    if (!b) {
        deleteAccountWarnDisplay.value = false
    } else {
        const responsejson = await authDeleteOwnAccount()
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

        } else if (responsejson.status == 0) {
            UserStore.setAuthStatus(false)
            UserStore.clearUserData()
            emits('deleteUser')
        }
    }
}

</script>

<template>
    <div id="account-page-container">

        <Title :title="'Welcome, ' + userdata.username+ '!'"/>

        <Tab internal-name="accountTab" :tab-left="leftTabs" :tab-right="rightTabs" :active-tab-index="activeTab"
            @change-tab="changeAccountTab" 
            :font-size=21 />

        <div v-show="activeTab == 0" class="box-out">
            <div id="account" class="box">
                <div class="account-title">
                    Account Information
                    <HoverIcon id="account-info-edit" hoverText="Edit" theme="bg" v-on:click="editUserData" v-show="!userDataEditing">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z">
                        </path></svg>
                    </HoverIcon>
                    <HoverIcon id="account-info-save" hoverText="Save Changes" theme="bg" :max-width="120"
                        v-on:click="saveUserData" v-show="userDataEditing">
                        <svg viewBox="-3 -3 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z" fill="#0F0F0F"></path>
                        </svg>
                    </HoverIcon>
                    <HoverIcon id="account-info-canceledit" hoverText="Cancel Changes" theme="bg" :max-width="140"
                        v-on:click="cancelUserDataEdit" v-show="userDataEditing">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z">
                        </path></svg>
                    </HoverIcon>
                </div>
                <div class="account-infobox">
                    <div class="account-text-sm">Username</div>
                    <div class="account-text">{{ userdata.username }}</div>
                </div>
                <div class="account-infobox">
                    <div class="account-text-sm">Bio</div>
                    <div>
                        <div class="account-text" v-if="!userDataEditing">{{ userdata.socialData.bio }}</div>
                        <textarea class="account-text input" v-model="newuserdata.socialData.bio" v-else/>
                    </div>
                </div>
                <div class="account-infobox">
                    <div class="account-text-sm">Email</div>
                    <div class="account-text">{{ userdata.socialData.email }}</div>
                </div>
                <div class="account-infobox">
                    <div class="account-text-sm">Account Status</div>
                    <div class="account-text">{{ userdata.accountStatus }}</div>
                </div>
                <div class="account-infobox">
                    <div class="account-text-sm">Questions</div>
                    <div class="account-text" style="display: flex; flex-direction: row;">
                        {{ userdata.questions.join(', ') }}
                    </div>
                </div>
            </div>
            <div id="actions" class="box">
                <form class="account-infobox" id="change-password" method="post" @submit.prevent="changePassword">
                    <input type="submit" class="account-text-sm btn-light" value="Change password">
                    <div class="account-text-sm" id="password-box">
                        <div>
                            <label for="old-password-input">Old password:</label>
                            <input id="old-password-input" name="oldpassword" class="input-sm" :type="pwdInputType" autocomplete="off">
                        </div>
                        <div>
                            <label for="new-password-input" id="change-password-input-prompt">New password:</label>
                            <input id="new-password-input" name="newpassword" class="input-sm" :type="pwdInputType" autocomplete="off">
                        </div>
                        <div>
                            <label for="new-password-input-2">Retype new password:</label>
                            <input id="new-password-input-2" name="newpassword-2" class="input-sm" :type="pwdInputType" autocomplete="off">
                        </div>
                        <div style="display: flex; flex-direction: row; gap: 10px;">
                            <label for="login-show-password" style="font-size: 12px">Show password:</label>
                            <input type="checkbox" v-model="pwdDisplay">
                        </div> 
                        <div v-show="changePasswordFail" class="err-text">
                            {{ changePasswordFailMessage }}
                        </div>
                    </div>
                </form>
                <div class="account-infobox">
                    <input type="submit" class="account-text-sm btn-light" value="Delete Account"
                        v-on:click="deleteAccount1">
                    <div class="account-text">Warning: Once you do this, there is no going back!</div>
                </div>
                <div id="delete-account-warn-display" v-show="deleteAccountWarnDisplay">
                    <div class="warn-text" id="delete-account-warn-text">
                        Are you sure you want to do this? By deleting your account,
                        <ul>
                            <li>all of your account data will be irreversibly deleted;</li>
                            <li>all of the questions which you own will be reassigned to our admin team;</li>
                            <li>you will lose access to all questions for which you have previously been granted permissions;</li>
                            <li>you will lose access to all groups which you previously joined.</li>
                        </ul>
                        To indicate that you understand the consequences of this action, enter your password in the box below, and click on "Confirm deletion":
                    </div>
                    <div id="delete-account-warn-verify">
                        <input id="del-password-input" name="delpassword" class="input-sm" type="password" autocomplete="off">
                        <div class="btn-light" id="delete-account-confirm" v-on:click="deleteAccount2(true)">Confirm deletion</div>
                        <div class="btn-light" id="delete-account-180" v-on:click="deleteAccount2(false)">Turn back</div>
                    </div>
                </div>
            </div>
        </div>

        <div v-show="activeTab == 1">
            To be added!
        </div>

    </div>
</template>

<style scoped>

#account-page-container {
    width: 100%;
    font-size: var(--font-size);
    padding: 50px;

    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
}

.account-title {
    font-size: var(--font-size-lg2);

    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: center;
}

.box-out {
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: 20px;

    padding: 0px 40px;
}

.box {
    border: 1px solid var(--colour-border);
    border-radius: 6px;

    padding: 20px 30px;
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: 30px;
    align-items: flex-start;
}

.account-infobox {
    width: 100%;

    display: grid;
    grid: auto / 30% 60%;
    grid-column-gap: 20px;
    grid-row-gap: 20px;
}

.account-text {
    align-self: center;
    font-size: var(--font-size-lg1);
}

.account-text-sm {
    align-self: center;
    font-size: var(--font-size);
}

#password-box {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

#change-password-input-prompt::after {
    content: "(Must contain at least one uppercase letter, one lowercase letter and one number, and a total of at least 8 characters)";
    position: absolute;
    width: 250px;
    font-size: var(--font-size-sm1);
    z-index: 10;
    display: none;
}

#delete-account-warn-text {
    line-height: var(--font-size-lg2);
}

#delete-account-warn-display {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

#delete-account-warn-verify {
    display: flex;
    flex-direction: row;
    gap: 10px;
}

#delete-account-confirm {
    background-color:brown;
    color: white;
}

</style>