<script setup lang="ts">

import { reactive, onMounted, computed } from 'vue';

import { useUserStore } from '@/stores/userStore';
import type { userData } from '@/types/Types';
import { emptyUserData } from '@/types/Types';
import Title from '../PageTitle.vue';

import { authLogout } from '@/post/postAuth'

const UserStore = useUserStore()

async function logoutUser() {
    const response = await authLogout()
    if (response.status == 0) {
        emits('logout')
        UserStore.clearUserData()
        UserStore.setAuthStatus(false)
    }
}

const userdata = reactive<userData>({...emptyUserData})

onMounted(() => {
    const u = UserStore.getUserData()
    userdata.username = u.username
    userdata.socialData = u.socialData
})

const emits = defineEmits<{
    (e: 'logout'): void,
    (u: 'updateUserData'): void
}>()

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
            </div>
        </div>

        <div id="logout-button" class="btn" v-on:click="logoutUser">
            Logout
        </div>

    </div>
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