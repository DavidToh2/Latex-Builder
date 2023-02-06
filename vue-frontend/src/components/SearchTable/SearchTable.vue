<script setup lang="ts">
    import SearchTableHeader from "./SearchTableHeader.vue"
    import SearchTableResult from "./SearchTableResult.vue"
    import type { qn } from '@/types/Types'

    export interface Props {
        qns: qn[]
    }

    const props = defineProps<Props> ()
</script>

<template>
    <div class="search-table">
        <SearchTableHeader />
        <SearchTableResult v-for="item in qns" :q="item"/>
    </div>
</template>

<style scoped>

.search-table {
    margin: 0px 10px;
}

.search-table :deep(.search-id) {
    width: 40px;
}
.search-table :deep(.search-question) {
    flex-grow: 1;
}
.search-table :deep(.search-topic) {
    width: 130px;
}
.search-table :deep(.search-difficulty) {
    width: 80px;
}
.search-table :deep(.search-source) {
    width: 70px;
}
.search-table :deep(.search-options) {
    width: 80px;
}

</style>