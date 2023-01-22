<script setup lang="ts">
import Title from '@/components/PageTitle.vue'
import QuestionFilters from '@/components/QuestionFilters.vue'
import { onMounted } from 'vue';

onMounted(() => {

})

</script>

<script lang="ts">

function submitSearchQuery() {
}

</script>

<template>
    <Title title="Database" />
    <form id="question-search-container" method="POST" onsubmit="submitSearchQuery()">
        <QuestionFilters func="database" />
        <input type="text" id="question-search" name="question" placeholder="Search question text">
        <input type="submit">
    </form>
</template>

<style scoped>

#question-search-container {
    width: 100%;
    height: 180px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px 0px;
    align-items: center;
}

#question-search {
    width: 36%;
    height: 36px;
    border: 1px solid #000000;
    padding: 4px;
    border-radius: 8px;
    font-size: 24px;
}

#question-search::placeholder {
    text-align: center;
}

</style>