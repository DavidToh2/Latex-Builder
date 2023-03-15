<script setup lang="ts">

    import { numberToPixels } from '@/aux'
    import { computed, ref, watch } from 'vue'

    export interface Props {
        internalName: string
        tabLeft: string[]
        tabRight: string[]
        fontSize: number
        activeID: number
    }
    const props = withDefaults(defineProps<Props>(), {
        fontSize: 18,
        activeID: 0
    })

    var ac = ref(0)
    watch(() => props.activeID, (n, o) => {
        ac.value = n
    }, {immediate: true, deep: true})

    var l = computed<number>(() => { return props.tabLeft.length })
    var r = computed<number>(() => { return props.tabRight.length })
    var a = computed(() => {
        const c = l.value + r.value
        var arr = new Array(c) as boolean[]
        for (var i=0; i<c; i++) {
            if (i == ac.value) {
                arr[i] = true
            } else {
                arr[i] = false
            }
        }
        return arr
    })

    const emit = defineEmits<{
        (e: 'changeTab', tabName: string, tabNumber : number): void
    }>()

    function changeActiveTab(n : number) {
        ac.value = n
        var s : string
        if (n < l.value) {
            s = props.tabLeft[n]
        } else {
            s = props.tabRight[n - l.value]
        }
        emit('changeTab', s, n)
    }

    function debug() {
        console.log(`Prop activeID: ${props.activeID}`)
        console.log(`Ref activeID: ${ac.value}`)
    }

</script>

<template>
    <div class="options">
        <div class="options-tab" v-for="i in l" :class="{'options-active': a[i-1]}"
            @click="changeActiveTab(i-1)">{{ tabLeft[i-1] }}
        </div>
        <div style="flex-grow: 1;"> </div>
        <div class="options-tab" v-for="i in r" :class="{'options-active': a[l+i-1]}"
            @click="changeActiveTab(l+i-1)">{{ tabRight[i-1] }}
        </div>
        <div class="options-tab" @click="debug">Hi</div>
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