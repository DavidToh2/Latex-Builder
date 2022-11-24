<script setup lang="ts">
import DropdownSearch from '@/components/DropdownSearch.vue'
import {searchParametersStore} from '@/stores/SearchParameters'


const parametersStore = searchParametersStore()
const params = parametersStore.paramList

</script>

<template>
    <div id="question-filters-container">
        <div id="question-filters-row">
            <div class="question-filters">
                <DropdownSearch description="Category" fontSize="24" />
            </div>
            <div class="question-filters">
                <DropdownSearch description="Topic" />
                <DropdownSearch description="Sub-topic" />
                <DropdownSearch description="Difficulty" />
            </div>
            <div class="question-filters">
                <DropdownSearch description="Source" />
                <DropdownSearch description="Year" />
            </div>
        </div>
        <input type="text" id="question-search" name="question-search" placeholder="Search question text">
    </div>
</template>

<style scoped>

#question-filters-container {
    width: 100%;
    height: 180px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px 0px;
    align-items: center;
}

#question-filters-row {
    display: flex;
    align-items: center;
    padding: 10px;
    gap: 10px;
    width: 100%
}

.question-filters {
    height: 100%;
    border: 1px solid #000000;
    width: calc((100% - 30px) / 3);
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 0px 7px;
    gap: 7px;
}

#question-search {
    width: 36%;
    height: 36px;
    border: 2px solid #000000;
    padding: 4px;
    border-radius: 8px;
    font-size: 24px;
}

#question-search::placeholder {
    text-align: center;
}

</style>