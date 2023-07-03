<script setup lang="ts">

    import { watch, reactive, computed } from 'vue'
    import DropdownSearch from '@/components/SearchFilters/DropdownSearch.vue'
    import Input from '@/components/SearchFilters/Input.vue'
    import paramdir from '@/assets/dropdown.json'
    import type { qnFilters, qnFilterNames } from '@/types/Types'
    import { emptyFilters } from '@/types/Types'

    export interface Props {
        func: string
        ss?: qnFilters
    }

    // SELECTIONS PASSED DOWN FROM THE PARENT COMPONENT. 
    const props = withDefaults(defineProps<Props>(), {
        ss: Object.assign({ 
            category: <string[]> [],
            topic: <string[]> [],
            subtopic: <string[]> [],
            difficulty: <string[]> [],
            sourceName: <string[]> [],
            sourceYear: 0,
            tags: <string[]> []
        })
    })  

    // ACTIVE SELECTIONS
    var s = reactive({...props.ss} as qnFilters)

    watch(() => props.ss, (ssNew, ssOld) => {
        Object.assign(s, ssNew)
    }, {deep: true})

    // AVAILABLE SELECTIONS (IN DROPDOWN MENUS)
    var as = reactive({...emptyFilters})  

    function updatePossibleSelections() {
        populatePossibleEntries('category')
        populatePossibleEntries('topic')
        populatePossibleEntries('difficulty')
        populatePossibleEntries('sourceName')
        populatePossibleEntries('subtopic')
    }

                // POPULATE SELECTION'S AVAILABLE OPTIONS
                // BASED ON PARENT SELECTION'S ACTIVE OPTIONS

    function populatePossibleEntries(intName: string) {

        const i = intName as qnFilterNames

        as[i] = []

        var sc = s.category        // Selected categories.
        if (sc.length == 0) {
            sc = as.category        // If none selected, choose from all categories.
        }

        switch(i) {
            case "category":        // All categories are always displayed.
                as.category = Object.keys(paramdir)
            break
            case "topic":           // Populates all available topics based on the selected categories
                for (var cat of sc) {
                    const a = paramdir[cat as keyof typeof paramdir]
                    const b = a['topic']
                    const t = as['topic']
                    as['topic'] = t.concat(Object.keys(b))
                }
            break
            case "subtopic":        // Populates all available subtopics based on the selected categories and topics
                const st = s.topic
                
                for (var cat of sc) {
                    const a = paramdir[cat as keyof typeof paramdir]['topic']
                    const t = Object.keys(a)              // List of all available topics.
                    if (st.length == 0) {               // If no selected topics, display all available subtopics.
                        for (var tt of t) {
                            const arr = a[tt as keyof typeof a]        // Array of subtopics.
                            as.subtopic = as.subtopic.concat(arr)
                        }
                    } else {                            // Otherwise, for each selected topic, display available subtopics.
                        for (var tt of t) {
                            if (st.includes(tt)) {
                                const arr = a[tt as keyof typeof a]
                                as.subtopic = as.subtopic.concat(arr)
                            }
                        }
                    }
                }
            break
            case "difficulty":
            case "sourceName":          // Populates all available difficulties and sources based on the selected categories
                for (var cat of sc) {
                    const a = paramdir[cat as keyof typeof paramdir] 
                    const b = a[i] as string[]
                    const c = as[i] as string[]
                    as[i] = c.concat(b)
                }
            break
        }

        // console.log(selections[intName as keyof typeof selections])
    }

                // ON CHANGE OF ENTRY, UPDATE ACTIVE SELECTIONS ss

    function updateSelections(filters: string[], name: string) {
        if (name == "sourceYear") {
            s["sourceYear"] = parseInt(filters[0])
        } else {
            const n = name as qnFilterNames
            s[n] = filters
        }
        updatePossibleSelections()
        updateParent(s)
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
    <div class="question-filters-row" :id="func">
        <div class="question-filters">
            <DropdownSearch description="Category" internalName="category" :fontSize="21" 
                :activeSelections="s.category" 
                :availableSelections="as.category" 
                @update="updateSelections"
            />
        </div>
        <div class="question-filters">
            <DropdownSearch description="Topic" internalName="topic" 
                :activeSelections="s.topic" 
                :availableSelections="as.topic" 
                @update="updateSelections"
            />
            <DropdownSearch description="Subtopic" internalName="subtopic" 
                :activeSelections="s.subtopic" 
                :availableSelections="as.subtopic" 
                @update="updateSelections"
            />
            <DropdownSearch description="Difficulty" internalName="difficulty" 
                :activeSelections="s.difficulty" 
                :availableSelections="as.difficulty" 
                @update="updateSelections"
            />
        </div>
        <div class="question-filters">
            <DropdownSearch description="Source" internalName="sourceName" 
                :activeSelections="s.sourceName"
                :availableSelections="as.sourceName" 
                @update="updateSelections"
            />
            <Input description="Year" internalName="sourceYear" 
                :activeInput="s.sourceYear"
                @update="updateSelections"
            />
            <Input description="Tags" internalName="tags"
                :activeInput="s.sourceName"
                @update="updateSelections"
            />
        </div>
    </div>
</template>

<style scoped>

.question-filters-row {
    display: grid;
    grid: auto / auto auto auto;
    padding: 10px;
    gap: 10px;
    width: 100%
}

.question-filters {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 0px 7px;
    gap: 7px;
}

</style>