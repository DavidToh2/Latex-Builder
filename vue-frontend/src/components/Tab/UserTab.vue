<script setup lang="ts">

    import { onUpdated, onMounted, computed } from 'vue'
    import { useQuestionStore } from '@/stores/questionStore'

    const QuestionStore = useQuestionStore()

    interface Props {
        internalList: string[],
        displayList: string[],
        activeTab: string
    }

    const props = defineProps<Props>()

    const emits = defineEmits<{
        (e: 'changeActiveQuestion', newQnID: string): void,
        (e: 'removeFromTab', qnID: string): void
    }>()

    function changeActiveQuestion(index : number) {
        emits('changeActiveQuestion', props.internalList[index])
    }
    function removeFromTab(index : number) {
        if (props.activeTab == props.internalList[index]) {
            emits('changeActiveQuestion', props.internalList[index-1])
        }
        emits('removeFromTab', props.internalList[index])
    }
    onMounted(() => {
        changeActiveQuestionDisplay(props.activeTab)
    })
    onUpdated(() => {
        changeActiveQuestionDisplay(props.activeTab)
    })

    function changeActiveQuestionDisplay(newInternalID : string) {
        const tabs = document.querySelectorAll(".tab-question")
        for (const t of tabs) {
            const i = t.id
            if (t.classList.contains("active")) {
                t.classList.remove("active")
            }
            if (i == `contribute-${newInternalID}`) {
                t.classList.add("active")
            }
        }
    }

</script>

<template>
    <div id="contribute-tab-container">
        <div class="tab-question" v-for="(item, index) in displayList" :id="'contribute-' + internalList[index]">
            <template v-if="item == '0'">
                <div class="tab-question-text" @click="changeActiveQuestion(index)">New</div>
                <div class="tab-question-x" @click="removeFromTab(index)">&#0215;</div>
            </template>
            <template v-else>
                <div class="tab-question-text" @click="changeActiveQuestion(index)">{{ item }}</div>
                <div class="tab-question-x" @click="removeFromTab(index)">&#0215;</div>
            </template>
        </div>
    </div>
</template>

<style scoped>
#contribute-tab-container {
    width: 100%;
    border-bottom: 1px solid black;
    display: flex;
    flex-direction: row;
    padding-left: 10px;
}

.tab-question {
    padding: 7px 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 7px;
}
.tab-question-text {
    font-size: var(--font-size-lg2);
}
.tab-question-text:hover {
    text-decoration: underline;
    cursor: pointer;
}

.tab-question-x {
    font-size: var(--font-size-lg2);
    font-weight: 800;
}
.tab-question-x:hover {
    cursor: pointer;
}

.active {
    border-top: 1px solid black;
    border-left: 1px solid black;
    border-right: 1px solid black;
    font-weight: bolder;
}

.active::after {
    content: '';
    position: absolute;
    left: 0;
    top: 100%;
    width: 100%;
    height: 1px;
    background-color: white;
}
</style>