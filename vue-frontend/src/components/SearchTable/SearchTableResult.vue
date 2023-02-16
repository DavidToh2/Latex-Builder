<script setup lang="ts">

    import type { qn } from '@/types/Types';

    export interface Props {
        q : qn   
    }
    const props = defineProps<Props>()

    const emits = defineEmits<{
        (e: 'edit', displayID: string): void
    }>()

    function editQuestion(e : Event) {
        const img = e.target as HTMLImageElement
        const r = ((img.parentElement as HTMLElement).parentElement as HTMLElement).children[0] as HTMLDivElement

        const dispID = r.innerText
        console.log(dispID)
        emits('edit', dispID)
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
            {{ q.difficulty }}
        </div>
        <div class="search-source search-cell">
            <p>{{ q.sourceName }}</p>
            <p>{{ q.sourceYear }}</p>
        </div>
        <div class="search-options search-cell">
            <img class="edit-button" src="@/assets/rightarrow.png" @click="editQuestion($event)">
        </div>
    </div>
</template>

<style scoped>

.edit-button {
    width: 30px;
    height: 30px;
    cursor: pointer
}

.search-table-result-row {
    width: 100%;
    display: flex;
    flex-direction: row;
}

</style>