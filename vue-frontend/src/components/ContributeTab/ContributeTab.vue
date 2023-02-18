<script setup lang="ts">

    import { computed } from 'vue'

    export interface Props {
        idList: string[]
    }

    const props = withDefaults(defineProps<Props>(), {
        idList: () => ['M3234', 'M3235', 'CS420']
    })

    const emits = defineEmits<{
        (e: 'changeActiveQuestion', newQnID: string): void
    }>()

    function changeQn(newID : string) {
        emits('changeActiveQuestion', newID)
    }

</script>

<template>
    <div id="contribute-tab-container">
        <div class="tab-question active" id="contribute-0" @click="changeQn('0')">New</div>
        <div class="tab-question" v-for="item in idList" @click="changeQn(item)" :id="'contribute-' + item">{{ item }}</div>
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
    font-size: 22px;
    padding: 7px 20px;
    cursor: pointer;
}
.tab-question:hover {
    text-decoration: underline;
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