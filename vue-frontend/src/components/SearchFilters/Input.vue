<script setup lang="ts">

    import { ref, watch } from 'vue'
    import { numberToPixels } from '@/aux'

    export interface Props {
        description: string
        internalName: string
        activeInput: string
        textDir?: "row" | "column"
        fontSize?: number
    }

    const props = withDefaults(defineProps<Props>(), {
        textDir: "column",
        fontSize: 18
    })

    const input = ref(props.activeInput)

    watch(() => props.activeInput, (newI, oldI) => {
        input.value = props.activeInput
    })

    const emits = defineEmits<{
        (e: 'update', value: string, intName: string): void
    }>()

    let updateInput = () => {
        emits('update', input.value, props.internalName)
    }

</script>

<template>
    <div class="dropdown-container">
        <div class="dropdown-description textbox">
            {{ description }}
        </div>
        <div class="dropdown-input-container" v-if="textDir == 'column'">
            <textarea rows="1" class="input-sm dropdown-input" autocomplete="off" 
                :name="internalName" style="resize: none;" 
                v-model="input" @input="updateInput()"></textarea>
        </div>
        <div class="dropdown-input-container" v-if="textDir == 'row'">
            <input class="input-sm dropdown-input" autocomplete="off" 
                :name="internalName" style="overflow-x: scroll;" 
                v-model="input" @input="updateInput()">
        </div>
    </div>
</template>

<style scoped>

.dropdown-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 7px;
    padding: 0px 7px;
    position: relative;
}

.dropdown-description {
    font-size: calc(v-bind(numberToPixels(fontSize)));
    width: max-content;
}

.dropdown-input-container {
    width: 100%;
    height: 32px;
}

.dropdown-input {
    width: 100%;
    overflow-x: scroll;
}

</style>