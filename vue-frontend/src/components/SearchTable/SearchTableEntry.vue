<script setup lang="ts">

    import { computed } from 'vue'
    import type { qn } from '@/types/Types';

    import { useUserStore } from '@/stores/userStore';
    const UserStore = useUserStore()

    export interface Props {
        q : qn,
        internalName: string   
    }
    const props = defineProps<Props>()

    const emits = defineEmits<{
        (e: 'insert', displayID: string, direction: string): void
        (e: 'delete', displayID: string): void
        (e: 'up', displayID: string): void
        (e: 'down', displayID: string): void
    }>()

    function insertQuestion(dispID : string, direction : string) {
        emits('insert', dispID, direction)
    }
    function deleteQuestion(dispID : string) {
        emits('delete', dispID)
    }
    function questionUp(dispID : string) {
        emits('up', dispID)
    }
    function questionDown(dispID : string) {
        emits('down', dispID)
    }

    const isDatabase = computed<boolean>(() => {
        return (props.internalName == 'database-table-qn')
    })
    const isBuild = computed<boolean>(() => {
        return (props.internalName == 'build-table-qn')
    })

</script>

<template>
    <div class="search-table-result-row">
        <div class="search-id search-cell" style="padding: 8px 0px; text-align: center;">
            {{ q.displayID }}
        </div>
        <div class="search-question search-cell">
            {{ q.question }}
        </div>
        <div class="search-topic search-cell">
            <p>{{ q.topic.join(', ') }}</p>
            <p>{{ q.subtopic.join(', ') }}</p>
        </div>
        <div class="search-difficulty search-cell">
            <p v-for="i in q.difficulty">{{ i }}</p>
        </div>
        <div class="search-source search-cell">
            <div v-for="sn in q.sourceName">
                <p>{{ sn }}</p>
                <p>{{ q.sourceYear }}</p>
            </div>
        </div>
        <div class="search-options search-cell">
            <div class="option-icons">
                <img class="icon-sm" src="@/assets/svg/angle-left.svg" v-if="isDatabase" @click="insertQuestion(q.displayID, 'left')">
                <img class="icon-sm" src="@/assets/svg/delete-circle.svg" @click="deleteQuestion(q.displayID)">
                <img class="icon-sm" src="@/assets/svg/angle-right.svg" v-if="isDatabase" @click="insertQuestion(q.displayID, 'right')">
                <div class="up-down-buttons" v-if="isBuild">
                    <img class="icon-sm" src="@/assets/svg/angle-up.svg" @click="questionUp(q.displayID)">
                    <img class="icon-sm" src="@/assets/svg/angle-down.svg" @click="questionDown(q.displayID)">
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.search-table-result-row {
    width: 100%;
    display: flex;
    flex-direction: row;
}

.up-down-buttons {
    display: flex;
    flex-direction: column;
}

</style>