<script setup lang="ts">

    import type { qn } from '@/types/Types';

    export interface Props {
        q : qn   
    }
    const props = defineProps<Props>()

</script>

<template>
    <div class="search-table-result-row">
        <div class="search-id search-cell">
            {{ q.id }}
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
            f
        </div>
    </div>
</template>

<style scoped>

.search-table-result-row {
    display: flex;
    flex-direction: row;
}

.search-cell {
    padding: 8px 10px;
}

</style>