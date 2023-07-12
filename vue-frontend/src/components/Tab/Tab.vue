<script setup lang="ts">

    import { numberToPixels } from '@/aux'
    import { computed } from 'vue'

    export interface Props {
        internalName: string
        tabLeft: string[]
        tabRight: string[]
        fontSize?: number
        activeTabIndex: number
    }
    const props = withDefaults(defineProps<Props>(), {
        fontSize: 18,
        activeTabIndex: 0
    })

    var l = computed<number>(() => { return props.tabLeft.length })
    var r = computed<number>(() => { return props.tabRight.length })

    const emit = defineEmits<{
        (e: 'changeTab', tabName: string, tabNumber : number): void
    }>()

    function changeActiveTab(n : number) {
        var s : string
        if (n < l.value) {
            s = props.tabLeft[n]
        } else {
            s = props.tabRight[n - l.value]
        }
        emit('changeTab', s, n)
    }

    function debug() {
        console.log(`Prop activeID: ${props.activeTabIndex}`)
    }

</script>

<template>
    <div class="options">
        <div class="options-tab" v-for="(item, index) in tabLeft" :class="{'options-active': (index == activeTabIndex)}"
            @click="changeActiveTab(index)">{{ item }}
        </div>
        <div style="flex-grow: 1;"> </div>
        <div class="options-tab" v-for="(item, index) in tabRight" :class="{'options-active': (index + l == activeTabIndex)}"
            @click="changeActiveTab(index + l)">{{ item }}
        </div>
        <!-- <div class="options-tab" @click="debug">Hi</div> -->
    </div>
</template>

<style scoped>

.options {
    width: 100%;
    display: flex;
	flex-direction: row;
	padding: 0px 10px;
	gap: 20px;
}
.options-tab {
	font-size: calc(v-bind(numberToPixels(fontSize)));
	padding: 7px;
}

.options-tab:hover {
    cursor: pointer;
    text-decoration: underline;
}

.options-active {
    font-weight: bold;
}
</style>