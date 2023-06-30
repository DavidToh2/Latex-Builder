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

        <Title :title="'Welcome,' + userdata.username" />

        <div id="account">
            <div class="account-infobox">
                Username: {{ userdata.username }}
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
    padding: 20px;
    font-size: var(--font-size);
}

#logout-button {
    width: 200px;
}

</style>