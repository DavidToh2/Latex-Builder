<script setup lang="ts">

    import { reactive, ref, computed } from 'vue'
    import DropdownSearch from '@/components/DropdownSearch.vue'
    import paramdir from '@/assets/dropdown.json'

    export interface Props {
        func: string
    }

    const props = withDefaults(defineProps<Props>(), {
        
    })

    const defaultSelections = {
        category: <string[]> [],
        topic: <string[]> [],
        subtopic: <string[]> [],
        difficulty: <string[]> [],
        source: <string[]> [],
        tags: <string[]> [],
    }

    const selections = reactive({ ...defaultSelections })

    function clearAvailableSelections() {
        Object.assign(selections, defaultSelections)
    }       // https://stackoverflow.com/questions/61184749/how-to-properly-reset-vue-composition-apis-reactive-values

    function initialiseAvailableSelections() {
        reset('category')
        reset('topic')
        reset('subtopic')
        reset('difficulty')
        reset('source')
    }

        // The following function populates a selection with all its permissible values, or clears it (year, tags)

    function reset(intName: string) {

        let permittedIntNames = ['category', 'topic', 'subtopic', 'difficulty', 'source', 'tags']
        if (!permittedIntNames.includes(intName)) {
            console.log("Error: Active Selection internal name " + intName + " not permitted!\n")
        }

        selections[intName as keyof typeof selections] = []

        switch(intName) {
            case "category":
                selections.category = Object.keys(paramdir)
            break
            case "topic":           // Populates all available topics based on the selected categories
                console.log(selections.category)
                for (var cat of selections.category) {
                    let a = paramdir[cat as keyof typeof paramdir]
                    let b = a['topic']
                    let t = selections['topic']
                    selections['topic'] = t.concat(Object.keys(b))
                }
            break
            case "subtopic":        // Populates all available subtopics based on the selected categories and topics
                let s = selections.topic
                for (var cat of selections.category) {
                    let a = paramdir[cat as keyof typeof paramdir]['topic']
                    let t = Object.keys(a)
                    for (var tt of t) {
                        if (s.includes(tt)) {
                            let st = a[tt as keyof typeof a]
                            selections.subtopic = selections.subtopic.concat(st)
                        }
                    }
                }
            break
            case "difficulty":
            case "source":          // Populates all available difficulties and sources based on the selected categories
                for (var cat of selections.category) {
                    let a = paramdir[cat as keyof typeof paramdir] 
                    let b = a[intName as keyof typeof a] as string[]
                    let c = selections[intName as keyof typeof selections]
                    selections[intName as keyof typeof selections] = c.concat(b)
                }
            break
        }

        console.log(selections[intName as keyof typeof selections])
    }

        // The following function is called whenever a selection is updated.

    function update(intName : string, updatedSelections : string[]) {

        let permittedIntNames = ['category', 'topic', 'subtopic', 'difficulty', 'source', 'tags']
        if (!permittedIntNames.includes(intName)) {
            console.log("Error: Active Selection internal name " + intName + " not permitted!\n")
        }
        
        // Update the field itself
        selections[intName as keyof typeof selections] = updatedSelections

        // In general, if a field is cleared by the user, reset it --- treat it as "everything is possible" now.
        if (updatedSelections.length == 0) {
            reset(intName)

        // Otherwise, reset the child fields.
        } else {

            switch(intName) {

                case "category":     // The category has changed

                    // Update available topics, difficulty and sources
                    reset("topic")
                    reset("difficulty")
                    reset("source")
                
                case "topic":     // The topic was changed

                    // Update available subtopics
                    reset("subtopic")

                break;
            }
        }
    }
    
    function updateYear() {

    }

    initialiseAvailableSelections()

</script>

<template>
    <form :id="func" style="width: 100%" autocomplete="false">
        <div id="question-filters-row">
            <div class="question-filters">
                <DropdownSearch description="Category" internalName="category" fontSize="24" :availableSelections="selections.category" @update="update"/>
            </div>
            <div class="question-filters">
                <DropdownSearch description="Topic" internalName="topic" :availableSelections="selections.topic" @update="update"/>
                <DropdownSearch description="Subtopic" internalName="subtopic" :availableSelections="selections.subtopic" @update="update"/>
                <DropdownSearch description="Difficulty" internalName="difficulty" :availableSelections="selections.difficulty" @update="update"/>
            </div>
            <div class="question-filters">
                <DropdownSearch description="Source" internalName="sourceName" :availableSelections="selections.source" @update="update"/>
                <DropdownSearch description="Year" internalName="sourceYear" @update="updateYear"/>
                <DropdownSearch description="Tags" internalName="tags" @update="update"/>
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