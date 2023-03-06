<script setup lang="ts">

    import { computed, watch } from 'vue'

    export interface Props {
        idList: string[],
        activeID: string
    }

    const props = withDefaults(defineProps<Props>(), {
        idList: () => ['M3234', 'M3235', 'CS420']
    })

    const displayedIDList = computed<string[]>(() => {
        var l = [...props.idList]
        l.splice(0, 1)
        return l
    })

    const emits = defineEmits<{
        (e: 'changeActiveQuestion', newQnID: string): void,
        (e: 'removeFromTab', qnID: string): void
    }>()

    watch(() => props.activeID, (newID, oldID) => {
        changeActiveQuestionDisplay(newID)
    })

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
        if (props.activeID == id) {
            var i = 0
            while (props.idList[i] != id) {
                i++
            }
            emits('changeActiveQuestion', props.idList[i-1])
        }
        emits('removeFromTab', id)
    }

</script>

<template>
    <div id="contribute-tab-container">
        <div class="tab-question active" id="contribute-0">
            <div class="tab-question-text" @click="$emit('changeActiveQuestion', '0')">New</div>
        </div>
        <div class="tab-question" v-for="item in displayedIDList" :id="'contribute-' + item">
            <div class="tab-question-text" @click="$emit('changeActiveQuestion', item)">{{ item }}</div>
            <div class="tab-question-x" @click="removeFromTab(item)">&#0215;</div>
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