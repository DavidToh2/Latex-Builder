<script setup lang="ts">

    import { ref } from 'vue'

        // Props receive data from the parent components of this component.
        // When the child component is refreshed, the list of available selections is received from the parent.

    export interface Props {
        description: string
        internalName: string
        selection?: [string]
        fontSize?: string
    }

        // Define the default value of props

    const props = withDefaults(defineProps<Props>(), {
        fontSize: "20",
    })

    const dropdownDir = (props.fontSize == "20") ? "row" : "column"

        // Emits send data to the parent components of this component.
        // The update emit sends the list of selected items to the parent.

    const emits = defineEmits<{
        (e: 'update', values: [string]): void
    }>()

        // Dynamic variables

    const searchText = ref('')

</script>

<script lang="ts"> 

    const searchDir : string = "@/assets/dropdown.json"

    function dropdownFilter(e : HTMLInputElement, directory : string) {
        var searchTarget = e.value
        var eName = e.name
        fetch(searchDir)
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not fetch dropdown tags! HTTP Error " + response.status)
            }
            return response.json()
        })
        .then(tags => {

        })
    }

    function getSelections() {
        let selectElement = document.querySelector()
    }

</script>

<template>
    <div class="dropdown-container">
        <div class="dropdown-description textbox" :style="{'font-size' : fontSize + 'px'}">
            {{ description }}
        </div>
        <div class="dropdown-search-container">
            <input type="text" class="dropdown-searchbar" :name="internalName" :style="{'font-size' : fontSize + 'px'}" :bind="searchText">

            <!-- Emits an event to update the parent component whenever the selection is changed. 
            This is to allow other DropdownSearches to access this DropdownSearch's selections. -->

            <select class="dropdown-list" :id="{'dropdown-list-' + internalName}" @onchange="$emit('update', getSelections())">
                <option v-for="item in selection">{{ item }}</option>
            </select>
        </div>
    </div>
</template>

<style scoped>

.dropdown-container {
    display: flex;
    flex-direction: v-bind('dropdownDir');
    justify-content: center;
    gap: 7px;
    padding: 0px 7px;
    position: relative;
}

.dropdown-description {
    font-size: 16px;
}

.dropdown-search-container {
    flex: 1;
}

.dropdown-searchbar {
    width: 100%;
}

.dropdown-list {
    display: none;
    position: absolute;
    list-style: none;
}
</style>