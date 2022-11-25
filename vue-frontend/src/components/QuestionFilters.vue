<script setup lang="ts">

import DropdownSearch from '@/components/DropdownSearch.vue'
import {searchParametersStore} from '@/stores/SearchParameters'

const parametersStore = searchParametersStore()
const params = parametersStore.paramList

</script>

<template>
    <div id="question-filters-row">
        <div class="question-filters">
            <DropdownSearch description="Category" internalName="category" fontSize="24" />
        </div>
        <div class="question-filters">
            <DropdownSearch description="Topic" internalName="topic" />
            <DropdownSearch description="Subtopic" internalName="subtopic" />
            <DropdownSearch description="Difficulty" internalName="difficulty" />
        </div>
        <div class="question-filters">
            <DropdownSearch description="Source" internalName="sourceName" />
            <DropdownSearch description="Year" internalName="sourceYear" />
            <DropdownSearch description="Tags" internalName="tags" />
        </div>
    </div>
</template>

<style scoped>

#question-filters-row {
    display: flex;
    align-items: center;
    padding: 10px;
    gap: 10px;
    width: 100%
}

.question-filters {
    height: 100%;
    width: calc((100% - 30px) / 3);
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 0px 7px;
    gap: 7px;
}

</style>