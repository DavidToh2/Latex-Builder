<script setup lang="ts">

    export interface Props {
        idList: string[]
    }

    const props = withDefaults(defineProps<Props>(), {
        idList: () => ['M3234', 'M3235', 'CS420']
    })

</script>

<template>
    <div id="contribute-tab-container">
        <div class="tab-question active">New</div>
        <div class="tab-question" v-for="item in idList">{{ item }}</div>
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