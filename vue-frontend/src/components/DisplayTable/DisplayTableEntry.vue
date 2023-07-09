<script setup lang="ts">

    import { computed } from 'vue'
    import type { qn } from '@/types/QuestionTypes';

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
    <div class="display-table-entry-row">
        <div class="display-table-id display-table-cell" style="padding: 8px 0px; text-align: center;">
            {{ q.displayID }}
        </div>
        <div class="display-table-question display-table-cell">
            {{ q.question }}
        </div>
        <div class="display-table-topic display-table-cell">
            <p>{{ q.topic.join(', ') }}</p>
            <p>{{ q.subtopic.join(', ') }}</p>
        </div>
        <div class="display-table-difficulty display-table-cell">
            <p v-for="i in q.difficulty">{{ i }}</p>
        </div>
        <div class="display-table-source display-table-cell">
            <div v-for="sn in q.sourceName">
                <p>{{ sn }}</p>
                <p>{{ q.sourceYear }}</p>
            </div>
        </div>
        <div class="display-table-options display-table-cell">
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

</style>