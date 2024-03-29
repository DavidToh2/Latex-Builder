<script setup lang="ts">

    import { watch, reactive, computed } from 'vue'
    import DropdownSearch from '@/components/SearchFilters/DropdownSearch.vue'
    import Input from '@/components/SearchFilters/Input.vue'
    import paramdir from '@/assets/dropdown.json'
    import type { qnFilters, qnFilterNames } from '@/types/QuestionTypes'
    import { emptyFilters } from '@/types/QuestionTypes'

    export interface Props {
        func: string
        ss: qnFilters
    }

    // SELECTIONS PASSED DOWN FROM THE PARENT COMPONENT. 
    const props = withDefaults(defineProps<Props>(), {
        ss: Object.assign({ 
            category: <string[]> [],
            topic: <string[]> [],
            subtopic: <string[]> [],
            difficulty: <string[]> [],
            sourceName: <string[]> [],
            sourceYear: '',
            tags: <string[]> []
        })
    })

    // ACTIVE SELECTIONS
    var activeSelections = reactive<qnFilters>(props.ss as qnFilters)

    watch(() => props.ss as qnFilters, (newS, oldS) => {
        activeSelections = props.ss
        updatePossibleSelections()
    }, {deep: true})

    // AVAILABLE SELECTIONS (IN DROPDOWN MENUS)
    var availableSelections = reactive<qnFilters>({...emptyFilters})  

    function updatePossibleSelections() {
        populatePossibleEntries('category')
        populatePossibleEntries('topic')
        populatePossibleEntries('difficulty')
        populatePossibleEntries('sourceName')
        populatePossibleEntries('subtopic')
        populatePossibleEntries('tags')
    }

                // POPULATE SELECTION'S AVAILABLE OPTIONS
                // BASED ON PARENT SELECTION'S ACTIVE OPTIONS

    function populatePossibleEntries(filterName: string) {

        const filter = filterName as qnFilterNames

        availableSelections[filter] = [] 

        var sc = activeSelections.category        // Selected categories.
        if (sc.length == 0) {
            sc = availableSelections.category        // If none selected, choose from all categories.
        }

        switch(filter) {
            case "category":        // All categories are always displayed.
                availableSelections.category = Object.keys(paramdir)
            break
            case "topic":           // Populates all available topics based on the selected categories
                for (var cat of sc) {
                    const a = paramdir[cat as keyof typeof paramdir]
                    const b = a['topic']
                    const t = availableSelections['topic']
                    availableSelections['topic'] = t.concat(Object.keys(b))
                }
            break
            case "subtopic":        // Populates all available subtopics based on the selected categories and topics
                const st = activeSelections.topic
                
                for (var cat of sc) {
                    const a = paramdir[cat as keyof typeof paramdir]['topic']
                    const t = Object.keys(a)              // List of all available topics.
                    if (st.length == 0) {               // If no selected topics, display all available subtopics.
                        for (var tt of t) {
                            const arr = a[tt as keyof typeof a]        // Array of subtopics.
                            availableSelections.subtopic = availableSelections.subtopic.concat(arr)
                        }
                    } else {                            // Otherwise, for each selected topic, display available subtopics.
                        for (var tt of t) {
                            if (st.includes(tt)) {
                                const arr = a[tt as keyof typeof a]
                                availableSelections.subtopic = availableSelections.subtopic.concat(arr)
                            }
                        }
                    }
                }
            break
            case "difficulty":
            case "sourceName":          // Populates all available difficulties and sources based on the selected categories
            case "tags":
                for (var cat of sc) {
                    const a = paramdir[cat as keyof typeof paramdir] 
                    const b = a[filter] as string[]
                    const c = availableSelections[filter] as string[]
                    availableSelections[filter] = c.concat(b)
                }
            break

        }

        // console.log(selections[filterName as keyof typeof selections])
    }

                // ON CHANGE OF ENTRY, UPDATE ACTIVE SELECTIONS ss

    function updateSourceYear(newYear: string, name: string) {
        if (name == "sourceYear") {
            activeSelections["sourceYear"] = newYear
        }
        updateParent(activeSelections)
    }

    function updateSelections(filters: string[], name: string) {
        const n = name as qnFilterNames
        activeSelections[n] = filters
        updatePossibleSelections()
        updateParent(activeSelections)
    }

    const emits = defineEmits<{
        (e: 'update', entries: qnFilters): void
    }>()

    function updateParent(ssNew : qnFilters) {
        emits('update', ssNew)
    }

    updatePossibleSelections()

</script>

<!--
    Each of the following <DropdownSearch />'es contains one <textarea name=_> that will be captured by the form.
-->

<template>
    <div class="question-filters" :id="func">
        <DropdownSearch description="Category" internalName="category"
            :activeSelections="activeSelections.category" 
            :availableSelections="availableSelections.category" 
            @update="updateSelections"
        />
        <DropdownSearch description="Topic" internalName="topic" 
            :activeSelections="activeSelections.topic" 
            :availableSelections="availableSelections.topic" 
            @update="updateSelections"
        />
        <DropdownSearch description="Subtopic" internalName="subtopic" 
            :activeSelections="activeSelections.subtopic" 
            :availableSelections="availableSelections.subtopic" 
            @update="updateSelections"
        />
        <DropdownSearch description="Difficulty" internalName="difficulty" 
            :activeSelections="activeSelections.difficulty" 
            :availableSelections="availableSelections.difficulty" 
            @update="updateSelections"
        />
        <DropdownSearch description="Source" internalName="sourceName" 
            :activeSelections="activeSelections.sourceName"
            :availableSelections="availableSelections.sourceName" 
            @update="updateSelections"
        />
        <Input description="Year" internalName="sourceYear" 
            :active-input="activeSelections.sourceYear"
            @update="updateSourceYear"
        />
        <DropdownSearch description="Tags" internalName="tags"
            :active-selections="activeSelections.tags"
            :available-selections="availableSelections.tags"
            @update="updateSelections"
        />
    </div>
</template>

<style scoped>

.question-filters {
    height: 100%;
    width: 80%;
    min-width: 400px;

    display: grid;
    grid: auto / 50% 50%;
    justify-content: top;
    flex-direction: column;
    padding: 0px 7px;
    gap: 7px;
}

@media (min-width: 1600px) {
    .question-filters {
        width: 100%;
        grid: auto / 33% 33% 33%;
    }
}

</style>