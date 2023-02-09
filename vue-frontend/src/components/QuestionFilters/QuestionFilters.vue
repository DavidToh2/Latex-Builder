<script setup lang="ts">

    import { reactive, ref, computed } from 'vue'
    import DropdownSearch from '@/components/QuestionFilters/DropdownSearch.vue'
    import Input from '@/components/QuestionFilters/Input.vue'
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
        source: <string[]> []
    }

    const ss = reactive({ ...defaultSelections })        // Actively selected items
    const as = reactive({ ...defaultSelections })       // Available selections

    function clearAvailableSelections() {
        Object.assign(ss, defaultSelections)
    }       // https://stackoverflow.com/questions/61184749/how-to-properly-populate-vue-composition-apis-reactive-values

    function initialiseAvailableSelections() {
        populate('category')
        populate('topic')
        populate('subtopic')
        populate('difficulty')
        populate('source')
    }

        // The following populates this selection's available options based on its parent selection's active options.

    function populate(intName: string) {

        let permittedIntNames = ['category', 'topic', 'subtopic', 'difficulty', 'source']
        if (!permittedIntNames.includes(intName)) {
            console.log("Error: Active Selection internal name " + intName + " not permitted!\n")
        }

        as[intName as keyof typeof as] = []

        let sc = ss.category        // Selected categories.
        if (sc.length == 0) {
            sc = as.category        // If none selected, choose from all categories.
        }

        switch(intName) {
            case "category":        // All categories are always displayed.
                as.category = Object.keys(paramdir)
            break
            case "topic":           // Populates all available topics based on the selected categories
                for (var cat of sc) {
                    let a = paramdir[cat as keyof typeof paramdir]
                    let b = a['topic']
                    let t = as['topic']
                    as['topic'] = t.concat(Object.keys(b))
                }
            break
            case "subtopic":        // Populates all available subtopics based on the selected categories and topics
                let st = ss.topic
                
                for (var cat of sc) {
                    let a = paramdir[cat as keyof typeof paramdir]['topic']
                    let t = Object.keys(a)              // List of all available topics.
                    if (st.length == 0) {               // If no selected topics, display all available subtopics.
                        for (var tt of t) {
                            let arr = a[tt as keyof typeof a]        // Array of subtopics.
                            as.subtopic = as.subtopic.concat(arr)
                        }
                    } else {                            // Otherwise, for each selected topic, display available subtopics.
                        for (var tt of t) {
                            if (st.includes(tt)) {
                                let arr = a[tt as keyof typeof a]
                                as.subtopic = as.subtopic.concat(arr)
                            }
                        }
                    }
                }
            break
            case "difficulty":
            case "source":          // Populates all available difficulties and sources based on the selected categories
                for (var cat of sc) {
                    let a = paramdir[cat as keyof typeof paramdir] 
                    let b = a[intName as keyof typeof a] as string[]
                    let c = as[intName as keyof typeof as]
                    as[intName as keyof typeof as] = c.concat(b)
                }
            break
        }

        // console.log(selections[intName as keyof typeof selections])
    }

        // The following function updates the active selections,
        // then updates the available child options.

    function update(intName : string, updatedSelections : string[]) {

        let permittedIntNames = ['category', 'topic', 'subtopic', 'difficulty', 'sourceName']
        if (!permittedIntNames.includes(intName)) {
            console.log("Error: Active Selection internal name " + intName + " not permitted!\n")
        }
        
        // Update the active selections of the field
        ss[intName as keyof typeof ss] = updatedSelections

        // In general, if a field is cleared by the user, treat it as "everything is possible" now --- reset the available options
        // Note that for category, everything is always displayed anyway
        if (intName == 'year' || intName == 'tags') {

        } else {
            if (updatedSelections.length == 0) {
                populate(intName)

            // Otherwise, populate the child fields.
            } else {

                switch(intName) {

                    case "category":     // The category has changed

                        // Update available topics, difficulty and sources
                        populate("topic")
                        populate("difficulty")
                        populate("source")
                    
                    case "topic":     // The topic was changed

                        // Update available subtopics
                        populate("subtopic")

                    break;
                }
            }
        }
    }

    initialiseAvailableSelections()

</script>

<!--
    Each of the following <DropdownSearch />'es contains one <textarea name=_> that will be captured by the form.
-->

<template>
    <div class="question-filters-row" :id="func">
        <div class="question-filters">
            <DropdownSearch description="Category" internalName="category" fontSize="20px" :availableSelections="as.category" @update="update"/>
        </div>
        <div class="question-filters">
            <DropdownSearch description="Topic" internalName="topic" :availableSelections="as.topic" @update="update"/>
            <DropdownSearch description="Subtopic" internalName="subtopic" :availableSelections="as.subtopic" @update="update"/>
            <DropdownSearch description="Difficulty" internalName="difficulty" :availableSelections="as.difficulty" @update="update"/>
        </div>
        <div class="question-filters">
            <DropdownSearch description="Source" internalName="sourceName" :availableSelections="as.source" @update="update"/>
            <Input description="Year" internalName="sourceYear"/>
            <Input description="Tags" internalName="tags"/>
        </div>
    </div>
</template>

<style scoped>

.question-filters-row {
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