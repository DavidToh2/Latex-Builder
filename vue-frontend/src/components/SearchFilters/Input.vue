<script setup lang="ts">

    import { reactive, ref } from 'vue'
    import { numberToPixels } from '@/aux'

    export interface Props {
        description: string
        internalName: string
        activeInput: string
        dropdownDir?: "row" | "column"
        fontSize?: number
    }

    const props = withDefaults(defineProps<Props>(), {
        dropdownDir: "row",
        fontSize: 18
    })

    const input = ref(props.activeInput)

    const emits = defineEmits<{
        (e: 'update', values: string, intName: string): void
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
        <div class="dropdown-input-container">
            <textarea rows="1" class="input-sm dropdown-input" autocomplete="off" :name="internalName" style="resize: none;" v-model="input" @input="updateInput()"></textarea>
        </div>
    </div>
</template>

<style scoped>

.dropdown-container {
    display: flex;
    flex-direction: v-bind(dropdownDir);
    align-items: left;
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
}

</style>