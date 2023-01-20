<script setup lang="ts">

    import DropdownSearch from '@/components/DropdownSearch.vue'

    export interface Props {
        func: string
    }

    const props = withDefaults(defineProps<Props>(), {
        
    })

</script>

<script lang="ts">
    let category: string
    let topic: [string]
    let subtopic: [string]
    let difficulty: [string]
    let sourceName: [string]
    let sourceYear: [string]
    let tags: [string]

    function update(n : Number) {
        switch(n) {

        }
    }

</script>

<template>
    <form :id="func" action="">
        <div id="question-filters-row">
            <div class="question-filters">
                <DropdownSearch description="Category" internalName="category" fontSize="24" @update="update(1)"/>
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
    </form>
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