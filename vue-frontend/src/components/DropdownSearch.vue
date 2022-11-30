<script setup lang="ts">

import { ref } from 'vue'

    // Props

export interface Props {
  description: string
  internalName: string
  fontSize?: string
}

const props = withDefaults(defineProps<Props>(), {
  fontSize: "20"
})

const dropdownDir = (props.fontSize == "20") ? "row" : "column"

    // Emits

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

</script>

<template>
    <div class="dropdown-container">
        <div class="dropdown-description textbox" :style="{'font-size' : fontSize + 'px'}">
            {{ description }}
        </div>
        <div class="dropdown-search-container">
            <input type="text" class="dropdown-searchbar" :name="internalName" :style="{'font-size' : fontSize + 'px'}" :bind="searchText">
            <ul class="dropdown-list">
                <li>"Hi"</li>
            </ul>
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