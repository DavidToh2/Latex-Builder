<script setup lang="ts">

    import { onUpdated, onMounted } from 'vue'

    export interface Props {
        tabList: string[],
        activeTab: string
    }

    const props = defineProps<Props>()

    const emits = defineEmits<{
        (e: 'changeActiveQuestion', newQnID: string): void,
        (e: 'removeFromTab', qnID: string): void
    }>()

    function changeActiveQuestionDisplay(newID : string) {
        const tabs = document.querySelectorAll(".tab-question")
        for (const t of tabs) {
            const i = t.id
            if (t.classList.contains("active")) {
                t.classList.remove("active")
            }
            if (i == `contribute-${newID}`) {
                t.classList.add("active")
            }
        }
    }

    function removeFromTab(id : string) {
        if (props.activeTab == id) {
            var i = 0
            while (props.tabList[i] != id) {
                i++
            }
            emits('changeActiveQuestion', props.tabList[i-1])
        }
        emits('removeFromTab', id)
    }
    onMounted(() => {
        changeActiveQuestionDisplay(props.activeTab)
    })
    onUpdated(() => {
        changeActiveQuestionDisplay(props.activeTab)
    })

</script>

<template>
    <div id="contribute-tab-container">
        <div class="tab-question" v-for="item in tabList" :id="'contribute-' + item">
            <template v-if="item == '0'">
                <div class="tab-question-text" @click="$emit('changeActiveQuestion', item)">New</div>
                <div class="tab-question-x" @click="removeFromTab(item)">&#0215;</div>
            </template>
            <template v-else>
                <div class="tab-question-text" @click="$emit('changeActiveQuestion', item)">{{ item }}</div>
                <div class="tab-question-x" @click="removeFromTab(item)">&#0215;</div>
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
    font-size: 22px;
}
.tab-question-text:hover {
    text-decoration: underline;
    cursor: pointer;
}

.tab-question-x {
    font-size: 22px;
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