<script setup lang="ts">

    import { computed } from 'vue'
    import type { qn } from '@/types/Types';

    export interface Props {
        q : qn,
        internalName: string   
    }
    const props = defineProps<Props>()

    const emits = defineEmits<{
        (e: 'insert', displayID: string): void
        (e: 'delete', displayID: string): void
        (e: 'up', displayID: string): void
        (e: 'down', displayID: string): void
    }>()

    function insertQuestion(dispID : string) {
        emits('insert', dispID)
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
            <img class="edit-button" src="@/assets/rightarrow.png" v-if="isDatabase" @click="insertQuestion(q.displayID)">
            <img class="delete-button" src="@/assets/trash.png" @click="deleteQuestion(q.displayID)">
            <div class="up-down-buttons" v-if="isBuild">
                <img class="up-button" src="@/assets/uparrow.png" @click="questionUp(q.displayID)">
                <img class="down-button" src="@/assets/downarrow.png" @click="questionDown(q.displayID)">
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

.edit-button {
    width: 25px;
    height: 25px;
    cursor: pointer
}

.delete-button {
    width: 25px;
    height: 25px;
    cursor: pointer
}

.up-down-buttons {
    display: flex;
    flex-direction: column;
}

.up-button {
    width: 25px;
    height: 15px;
    cursor: pointer
}
.down-button {
    width: 25px;
    height: 15px;
    cursor: pointer
}

</style>