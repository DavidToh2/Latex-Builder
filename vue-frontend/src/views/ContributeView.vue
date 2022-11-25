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

#question-text {
	width: 100%;
	height: 300px;
	max-height: none;
}

</style>
  