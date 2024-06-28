<script setup lang="ts">

    import { reactive, computed, watch, onUpdated } from 'vue'
    import { numberToPixels } from '@/aux' 
    import Entry from '@/components/Common/Entry.vue'

    export interface Props {
        description: string
        internalName: string
        activeSelections?: string[]
        availableSelections?: string[]

        dropdownDir?: "row" | "column"
        maxRows?: number
    }

        // Define the default value of props

    const props = withDefaults(defineProps<Props>(), {
        activeSelections: Object.assign(<string[]>[]),
        availableSelections: Object.assign(<string[]>[]),
        dropdownDir: "row",
        maxRows: 2
    })

    const search = reactive({
        searchText: '',
        active: false,
        activeSelections: props.activeSelections as string[],
        availableSelections: props.availableSelections as string[]
    })

    watch(() => props.activeSelections as string[], (newS, oldS) => {
        search.activeSelections = props.activeSelections as string[]
        searchAvailableSelections(search.searchText)
    }, {deep: true})

    const searchbarRows = computed<number>(() => {
        if (search.searchText.length >= 25) {
            return 2
        } else {
            return 1
        }
    })
    const containerHeight = computed<number>(() => {
        const p : number = (1 + searchbarRows.value) * 16
        return p
    })

    const emits = defineEmits<{
        (e: 'update', values: string[], intName: string): void
    }>()

        // Whenever the input text is updated, get the list of matching available selections.

    watch(() => search.searchText, (newS, oldS) => {
        searchAvailableSelections(newS)
    })

    function searchAvailableSelections(s : string) {

        search.availableSelections = []
        const j : number = s.length

        // Search and display:

        for (var item of (props.availableSelections as string[])) {

            const i : number = item.length
            var r = false

            for (var x=0; x<i-j; x++) {
                const a = s.substring(x, x+j).toLowerCase()
                const b = item.substring(x, x+j).toLowerCase()
                if (a == b) {
                    r = true
                }
            }

            if (r) {
                search.availableSelections.push(item)
            }
        }
    }

    function removeItem(s : string) {
        const i = search.activeSelections.indexOf(s)
        search.activeSelections.splice(i, 1)
    }

    function setActiveSelections() {
        emits('update', search.activeSelections, props.internalName)
    }

</script>

<template>
    <div class="dropdown-container">
        <div class="textbox dropdown-description">
            {{ description }}
        </div>
        <div class="dropdown-search-container" @mouseenter="search.active = true" @mouseleave="search.active = false">
            <div class="dropdown-searchbar input-sm">
                <div class="dropdown-active-selections">
                    <template v-for="item in search.activeSelections">
                        <Entry colour="green" :font-size="14" @close="removeItem(item)">
                            {{ item }}
                        </Entry>
                    </template>
                </div>
            </div>
            
            <ul class="dropdown-list" v-show="search.active">
                <textarea :rows="searchbarRows" class="dropdown-search" autocomplete="off"
                    :name="internalName" placeholder="Search here"
                    v-model="search.searchText">
                </textarea>
                <li v-for="item in props.availableSelections"
                    v-show="search.availableSelections.includes(item)"
                    class="dropdown-option-container">
                    <input type="checkbox" class="dropdown-option" 
                        :value="item" :id="item"
                        v-model="search.activeSelections"
                        @change="setActiveSelections">
                    <label :for="item" style="flex-grow: 1;">{{ item }}</label>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>

.dropdown-container {
    display: flex;
    flex-direction: v-bind('dropdownDir');
    align-items: flex-start;
    justify-content: center;
    gap: 7px;
    padding: 0px 7px;
    position: relative;
}
.dropdown-container-row {
    height: 32px;
    flex-direction: row;
}
.dropdown-container-column {
    height: 64px;
    flex-direction: row;
}

.dropdown-description {
    padding-top: 5px;
    font-size: var(--font-size-lg1);
}

.dropdown-search-container {
    width: 100%;
}

.dropdown-searchbar {
    min-height: 32px;
}

.dropdown-active-selections {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    width: 100%;
    font-size: var(--font-size);

    max-height: 64px;
    overflow-y: scroll;
    position: relative;
}

.dropdown-search {
    width: 100%;
    padding: 5px 8px;
    
    border-bottom: 1px solid var(--colour-border);
    resize: none;
}

.dropdown-list {
    display: inline;
    position: absolute;

    z-index: 1;
    background-color: var(--colour-background);
    max-height: 200px;
    overflow-y: scroll;
    width: 100%;

    list-style: none;
    padding: 0px;
    border: 1px solid var(--colour-border);
}

.dropdown-option-container {
    padding: 5px 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid var(--colour-border);

    font-size: var(--font-size-sm1);
}

</style>