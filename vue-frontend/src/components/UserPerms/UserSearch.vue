<script setup lang="ts">

import Popup from '@/components/Common/Popup/Popup.vue';
import { ref } from 'vue';

const props = defineProps<{
    isPopupActive: boolean,
    popupText: string
}>()

const emits = defineEmits<{
    (e: 'addUser', user: string): void
    (e: 'closePopup'): void
}>()

function addUser(u : string) {
    user.value = ''
    emits('addUser', u)
}

const user = ref('')

</script>

<template>
    <div class="user-search-container">
        <div class="user-searchbar-container">
            <input class="input-sm user-search" v-model="user">
            <div class="btn-nobg user-search-btn" @click="addUser(user)">Add</div>
        </div>
        <Popup :is-active="isPopupActive" @close="emits('closePopup')">
            <span v-html="popupText"></span>
        </Popup>
    </div>

</template>

<style scoped>

.user-search-container {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.user-searchbar-container {
    display: flex;
    flex-direction: row;
    gap: 10px;
}

.user-search {
    width: 200px;
}

.user-search-btn {
    width: 60px;
}

</style>