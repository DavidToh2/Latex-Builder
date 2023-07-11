<script setup lang="ts">

import UserSearch from './UserSearch.vue'
import Entry from '../Common/Entry.vue'
import type { userPerms } from '@/types/UserTypes'
import { emptyUserPerms } from '@/types/UserTypes'
import { ref, reactive, computed } from 'vue'

const props = defineProps<{
    userPerms: userPerms
}>()

const arePopupsActive = reactive([false, false, false, false])
function closePopup(t : number) {
    console.log(`Closing popup ${t}`)
    if (t >= 0 && t <= 3) {
        arePopupsActive[t] = false
    }
}

        // Change user perms:

async function addModifyUser(u : string) {
    setPerms('modifyUsers', u, 'add')
}
function removeModifyUser(u : string) {
    setPerms('modifyUsers', u, 'remove')
}
async function addReadUser(u : string) {
    setPerms('readUsers', u, 'add')
}
function removeReadUser(u : string) {
    setPerms('readUsers', u, 'remove')
}

        // Change group perms:

async function addModifyGroup(g : string) {
    setPerms('modifyGroups', g, 'add')
}
function removeModifyGroup(g : string) {
    setPerms('modifyGroups', g, 'remove')
}
async function addReadGroup(g : string) {
    setPerms('readGroups', g, 'add')
}
function removeReadGroup(g : string) {
    setPerms('readGroups', g, 'remove')
}
        // Toggling public

function togglePublic() {
    const p = props.userPerms.canAccessPublic
    if (p) {
        setPerms('public', 'public', 'remove')
    } else {
        setPerms('public', 'public', 'add')
    }
}
const publicEntryColour = computed(() => {
    const p = props.userPerms.canAccessPublic
    if (p) {
        return 'green'
    } else {
        return 'red'
    }
})

function setPerms(type: 'modifyUsers' | 'modifyGroups' | 'readUsers' | 'readGroups' | 'public', name: string, action: 'add' | 'remove') {
    emits('setPerms', type, name, action)
}

const emits = defineEmits<{
    (e: 'setPerms', type: 'modifyUsers' | 'modifyGroups' | 'readUsers' | 'readGroups' | 'public', name: string, action: 'add' | 'remove'): void
}>()

function dumpPerms() {
    console.log(props.userPerms)
}

</script>

<template>
    <div id="userperms">
        <div id="userperms-owner" class="infobox">
            <div class="perms-description">Owner:</div>
            <div>{{ userPerms.owner }}</div>
        </div>
        <div id="userperms-canmodifyusers" class="infobox">
            <div class="perms-description">Contributing users:</div>
            <div class="perms-content">
                <div class="perms-list">
                    <Entry v-if="userPerms.canModifyUsers.length == 0" :removable="false">None</Entry>
                    <Entry v-for="(item, index) in userPerms.canModifyUsers" @close="removeModifyUser(item)">
                        {{ item }}
                    </Entry>
                </div>
                <div class="perms-add">
                    <UserSearch :is-popup-active="arePopupsActive[0]" popup-text="User not found!"
                        @add-user="addModifyUser" @close-popup="closePopup(0)"/>
                </div>
            </div>
        </div>
        <div id="userperms-canmodifygroups" class="infobox">
            <div class="perms-description">Contributing groups:</div>
            <div class="perms-content">
                <div class="perms-list">
                    <Entry v-for="(item, index) in userPerms.canModifyGroups" @close="removeModifyGroup(item)">{{ item }}</Entry>
                </div>
                <div class="perms-add">
                    <UserSearch :is-popup-active="arePopupsActive[1]" popup-text="Group not found!"
                        @add-user="addModifyGroup" @close-popup="closePopup(1)"/>
                </div>
            </div>
        </div>
        <div id="userperms-canreadusers" class="infobox">
            <div class="perms-description">Users with view access:</div>
            <div class="perms-content">
                <div class="perms-list">
                    <Entry v-if="userPerms.canReadUsers.length == 0" :removable="false">None</Entry>
                    <Entry v-for="(item, index) in userPerms.canReadUsers" @close="removeReadUser(item)">
                        {{ item }}
                    </Entry>
                </div>
                <div class="perms-add">
                    <UserSearch :is-popup-active="arePopupsActive[2]" popup-text="User not found!"
                        @add-user="addReadUser" @close-popup="closePopup(2)"/>
                </div>
            </div>
        </div>
        <div id="userperms-canreadgroups" class="infobox">
            <div class="perms-description">Groups with view access:</div>
            <div class="perms-content">
                <div class="perms-list">
                    <Entry v-for="(item, index) in userPerms.canReadGroups" @close="removeReadGroup(item)">{{ item }}</Entry>
                </div>
                <div class="perms-add">
                    <UserSearch :is-popup-active="arePopupsActive[3]" popup-text="Group not found!"
                        @add-user="addReadGroup" @close-popup="closePopup(3)"/>
                </div>
            </div>
        </div>
        <div id="userperms-canpublic" class="infobox">
            <div class="perms-description">Public Permissions:</div>
            <div class="perms-content">
                <div class="perms-list" style="cursor: pointer">
                    <Entry :colour="publicEntryColour"
                        :removable=false @click="togglePublic">
                        <template v-if="(!userPerms.canAccessPublic)">
                            Private
                        </template>
                        <template v-else-if="(userPerms.canAccessPublic)">
                            Public
                        </template>
                    </Entry>
                </div>
            </div>
        </div>
        <Entry @close="dumpPerms">Debug</Entry>
    </div>

</template>

<style scoped>

#userperms {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.infobox {
    font-size: var(--font-size-lg1);

    display: grid;
    grid: auto / 250px auto;
    column-gap: 20px;
}

.perms-description {
    justify-self: end;
    align-self: center;
}

.perms-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.perms-list {
    display: flex;
    flex-direction: row;
    gap: 5px;
    flex-wrap: wrap;
    row-gap: 5px;
}

</style>