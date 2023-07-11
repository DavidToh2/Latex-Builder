<script setup lang="ts">

    import { computed } from 'vue'
    import type { qn } from '@/types/QuestionTypes'

    import { useQuestionStore } from '@/stores/questionStore'
    const QuestionStore = useQuestionStore()

    export interface Props {
        q : qn,
        internalName: string   
    }
    const props = defineProps<Props>()

    const emits = defineEmits<{
        (e: 'insert', id: string, direction: string): void
        (e: 'delete', id: string): void
        (e: 'up', id: string): void
        (e: 'down', id: string): void
    }>()

    function insertQuestion(id : string, direction : string) {
        emits('insert', id, direction)
    }
    function deleteQuestion(id : string) {
        emits('delete', id)
    }
    function questionUp(id : string) {
        emits('up', id)
    }
    function questionDown(id : string) {
        emits('down', id)
    }

    const isDatabase = computed<boolean>(() => {
        return (props.internalName == 'database-table-qn')
    })
    const isBuild = computed<boolean>(() => {
        return (props.internalName == 'build-table-qn')
    })

    const qnDisplayID = computed<string>(() => {
        return QuestionStore.getQnDisplayID(props.q)
    })

</script>

<template>
    <div class="display-table-entry-row">
        <div class="display-table-id display-table-cell" style="padding: 8px 0px; text-align: center;">
            {{ qnDisplayID }}
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
                <img class="icon-sm" src="@/assets/svg/angle-left.svg" v-if="isDatabase" @click="insertQuestion(q.id, 'left')">
                <img class="icon-sm" src="@/assets/svg/delete-circle.svg" @click="deleteQuestion(q.id)">
                <img class="icon-sm" src="@/assets/svg/angle-right.svg" v-if="isDatabase" @click="insertQuestion(q.id, 'right')">
                <div class="up-down-buttons" v-if="isBuild">
                    <img class="icon-sm" src="@/assets/svg/angle-up.svg" @click="questionUp(q.id)">
                    <img class="icon-sm" src="@/assets/svg/angle-down.svg" @click="questionDown(q.id)">
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>