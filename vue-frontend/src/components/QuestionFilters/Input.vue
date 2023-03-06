<script setup lang="ts">

    import { reactive } from 'vue'

    export interface Props {
        description: string
        internalName: string
    }

    const props = defineProps<Props>()

    const search = reactive({
        inputText: ''
    })

    const emits = defineEmits<{
        (e: 'update', values: string[], intName: string): void
    }>()

    let updateInput = () => {
        emits('update', [search.inputText], props.internalName)
    }

</script>

<template>
    <div class="dropdown-container">
        <div class="dropdown-description textbox">
            {{ description }}
        </div>
        <div class="dropdown-search-container-outer">
            <div class="dropdown-search-container">
                <textarea rows="1" class="dropdown-input" autocomplete="off" :name="internalName" style="resize: none;" v-model="search.inputText" @input="updateInput()"></textarea>
            </div>
        </div>
    </div>
</template>

<style scoped>

.dropdown-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 7px;
    padding: 0px 7px;
    position: relative;
}

.dropdown-description {
    font-size: 16px;
}

.dropdown-search-container-outer {
    flex-grow: 1;
    height: 25px;
}

.dropdown-search-container {
    width: 100%;
    position: absolute;
}

.dropdown-input {
    width: 100%;
    font-family: 'Gothic A1', sans-serif;
    font-size: 12px;
}

</style>