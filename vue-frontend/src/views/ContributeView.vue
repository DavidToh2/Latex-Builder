<script setup lang="ts">
import { defineComponent } from 'vue'
import Title from '@/components/PageTitle.vue'
import QuestionFilters from '@/components/QuestionFilters.vue'

</script>

<script lang="ts">

</script>

<template>
    <Title title="Contribute" />
    <form id="question-build-container" method="POST" action="http://localhost:3000/database/set/new/">
        <QuestionFilters />
        <input type="text" id="question-build-shortcut" name="question-tags" placeholder="Quickfill: Category - Topic - Subtopic - Difficulty - Source - Year - Tags">
        <textarea id="question-text" name="question" placeholder="Type LaTeX here:"></textarea>
        <input type="submit">
    </form>
</template>

<style scoped>

#question-build-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px 0px;
    align-items: center;
}

#question-build-shortcut {
    width: 64%;
    height: 36px;
    border: 1px solid #000000;
    padding: 4px;
    font-size: 18px;
}

#question-text {
	width: 95%;
	height: 300px;
    border-radius: 8px;
    border: 1px solid #000000;
    padding: 5px;
	max-height: none;
}

</style>
  