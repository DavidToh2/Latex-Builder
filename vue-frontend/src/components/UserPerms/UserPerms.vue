<script setup lang="ts">

import UserSearch from '@/components/Common/UserSearch.vue'
import Entry from '../Common/Entry.vue'
import { ref, reactive, computed } from 'vue'
import { searchUser, searchGroup } from '@/post/postAuth'

interface Props {
    owner: string,
    canModifyUsers: string[],
    canModifyGroups: string[],
    canReadUsers: string[],
    canReadGroups: string[],
    canAccessPublic: "none" | "read" | "modify"
}

const props = withDefaults(defineProps<Props>(), {
    canModifyUsers: () => ['hi', 'bye']
})

const arePopupsActive = reactive([false, false, false, false])
function closePopup(t : number) {
    console.log(`Closing popup ${t}`)
    if (t >= 0 && t <= 3) {
        arePopupsActive[t] = false
    }
}

        // Change user perms:

async function addModifyUser(u : string) {
    const s = await userSearch(u)
    if (s) {
        emits('setModifyUser', u, 'add')
    } else {
        arePopupsActive[0] = true
    }
}
function removeModifyUser(u : string) {
    emits('setModifyUser', u, 'remove')
}
async function addReadUser(u : string) {
    const s = await userSearch(u)
    if (s) {
        emits('setReadUser', u, 'add')
    } else {
        arePopupsActive[2] = true
    }
}
function removeReadUser(u : string) {
    emits('setReadUser', u, 'remove')
}
async function userSearch(u : string) {
    const rj = await searchUser(u)
    return rj.body.userPresent
}

        // Change group perms:

async function addModifyGroup(g : string) {
    const s = await groupSearch(g)
    if (s) {
        emits('setModifyGroup', g, 'add')
    } else {
        arePopupsActive[1] = true
    }
}
function removeModifyGroup(g : string) {
    emits('setModifyGroup', g, 'remove')
}
async function addReadGroup(g : string) {
    const s = await groupSearch(g)
    if (s) {
        emits('setReadGroup', g, 'add')
    } else {
        arePopupsActive[3] = true
    }
}
function removeReadGroup(g : string) {
    emits('setReadGroup', g, 'remove')
}
async function groupSearch(g : string) {
    const rj = await searchGroup(g)
    return rj.body.groupPresent
}

        // Toggling public

function togglePublic() {
    const p = props.canAccessPublic
    if (p == 'none') {
        emits('setPublic', 'read')
    } else if (p == 'read') {
        emits('setPublic', 'modify')
    } else if (p == 'modify') {
        emits('setPublic', 'none')
    }
}
const publicEntryColour = computed(() => {
    const p = props.canAccessPublic
    if (p == 'none') {
        return 'red'
    } else if (p == 'read') {
        return 'yellow'
    } else if (p == 'modify') {
        return 'green'
    }
})

const emits = defineEmits<{
    (e: 'setModifyUser', u: string, action: string): void,
    (e: 'setReadUser', u: string, action: string): void,
    (e: 'setModifyGroup', u: string, action: string): void,
    (e: 'setReadGroup', u: string, action: string): void,
    (e: 'setPublic', perms: string): void,
}>()

</script>

<template>
    <div id="userperms">
        <div id="userperms-owner" class="infobox">
            <div class="perms-description">Owner:</div>
            <div>{{ owner }}</div>
        </div>
        <div id="userperms-canmodifyusers" class="infobox">
            <div class="perms-description">Contributing users:</div>
            <div class="perms-content">
                <div class="perms-list">
                    <Entry v-if="canModifyUsers.length == 0" :removable="false">None</Entry>
                    <Entry v-for="(item, index) in canModifyUsers" @close="removeModifyUser(item)">
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
                    <Entry v-for="(item, index) in canModifyGroups" @close="removeModifyGroup(item)">{{ item }}</Entry>
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
                    <Entry v-if="canReadUsers.length == 0" :removable="false">None</Entry>
                    <Entry v-for="(item, index) in canReadUsers" @close="removeReadUser(item)">
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
                    <Entry v-for="(item, index) in canReadGroups" @close="removeReadGroup(item)">{{ item }}</Entry>
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
                <div class="perms-list">
                    <Entry :colour="publicEntryColour"
                        :removable=false @click="togglePublic">
                        <template v-if="(canAccessPublic == 'none')">
                            Private
                        </template>
                        <template v-else-if="(canAccessPublic == 'read')">
                            Can Read
                        </template>
                        <template v-else-if="(canAccessPublic == 'modify')">
                            Can Contribute
                        </template>
                    </Entry>
                </div>
            </div>
        </div>
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