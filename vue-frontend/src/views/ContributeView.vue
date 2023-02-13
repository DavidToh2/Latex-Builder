<script setup lang="ts">
import { defineComponent } from 'vue'
import Title from '@/components/PageTitle.vue'
import QuestionFilters from '@/components/QuestionFilters/QuestionFilters.vue'
import { postForm } from '@/post';

function modifyQuestionEvent(e : Event) {
    const f = e.target as HTMLFormElement
    modifyQuestion(f)
}
async function modifyQuestion(f : HTMLFormElement) {
    const response = await postForm(f, 'http://localhost:3000/database/set/new') as Response
    console.log(response.json())
}

</script>

<template>
    <Title title="Contribute" />
    <form id="question-build-container" autocomplete="false" @submit.prevent="modifyQuestionEvent($event)">
        <QuestionFilters func="contribute" />
        <!-- <input type="text" id="question-build-shortcut" name="question-tags" placeholder="Quickfill: Category - Topic - Subtopic - Difficulty - Source - Year - Tags"> -->
        <div class="latex-container">
            <textarea id="question-text" name="question" placeholder="Type LaTeX here:"></textarea>
        </div>
        <div class="display-container">

        </div>
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

.latex-container {
	width: 95%;
	height: 250px;
	max-height: none;
}

#question-text {
	width: 100%;
    height: 100%;
    border-radius: 8px;
    border: 1px solid #000000;
    padding: 10px;

    font-size: 14px;
    font-family: 'Gothic AI', sans-serif;

    overflow-y: scroll;
}

.display-container {
	width: 95%;
	height: 250px;
	max-height: none;
    border: 1px solid #000000;

    overflow-y: scroll;
}

</style>
  