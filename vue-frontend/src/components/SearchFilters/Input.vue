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
        <div class="dropdown-search-container">
            <textarea rows="1" class="input-sm dropdown-input" autocomplete="off" :name="internalName" style="resize: none;" v-model="search.inputText" @input="updateInput()"></textarea>
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
    font-size: 18px;
}

.dropdown-search-container {
    width: 100%;
    height: 32px;
}

.dropdown-input {
    width: 100%;
}

</style>