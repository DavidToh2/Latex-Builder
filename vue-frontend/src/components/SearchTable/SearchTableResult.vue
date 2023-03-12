<script setup lang="ts">

    import type { qn } from '@/types/Types';

    export interface Props {
        q : qn   
    }
    const props = defineProps<Props>()

    const emits = defineEmits<{
        (e: 'edit', displayID: string): void
        (e: 'delete', displayID: string): void
    }>()

    function editQuestion(e : Event) {
        const img = e.target as HTMLImageElement
        const r = ((img.parentElement as HTMLElement).parentElement as HTMLElement).children[0] as HTMLDivElement
        const dispID = r.innerText
        emits('edit', dispID)
    }
    function deleteQuestion(e : Event) {
        const img = e.target as HTMLImageElement
        const r = ((img.parentElement as HTMLElement).parentElement as HTMLElement).children[0] as HTMLDivElement
        const dispID = r.innerText
        emits('delete', dispID)
    }

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
            <img class="edit-button" src="@/assets/rightarrow.png" @click="editQuestion($event)">
            <img class="delete-button" src="@/assets/trash.png" @click="deleteQuestion($event)">
        </div>
    </div>
</template>

<style scoped>

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

.search-table-result-row {
    width: 100%;
    display: flex;
    flex-direction: row;
}

</style>