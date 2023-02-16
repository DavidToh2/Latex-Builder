<script setup lang="ts">

    import { ref, reactive, computed } from 'vue'

    // PROPS receive data from the parent components of this component.
        // When the child component is refreshed, the list of available selections is received from the parent.

    export interface Props {
        description: string
        internalName: string
    }

        // Define the default value of props

    const props = defineProps<Props>()

    // REACTIVE VARIABLES
        // These Javascript variables are bound using :value, and are automatically updated along with their bound HTML counterparts.
        // Since this is TypeScript, we have to explicitly type the empty array.    

    const search = reactive({
        inputText: ''
    })

    // EMITS send data to the parent components of this component.
        // The update emit sends the list of selected items to the parent.

    const emits = defineEmits<{
        (e: 'update', intName: string, values: string[]): void
    }>()

    // Whenever the input text is updated, send this information back to the parent using an emit.

    let updateInput = () => {
        emits('update', props.internalName, [search.inputText])
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