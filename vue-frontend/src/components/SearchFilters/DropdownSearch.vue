<script setup lang="ts">

    import { reactive, computed, watch } from 'vue'
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
        search.availableSelections = props.availableSelections as string[]
    }, {deep: true})

    // watch(() => props.availableSelections, (newS, oldS) => {
    //     search.availableSelections = newS as string[]
    // })

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
        <div class="dropdown-description textbox">
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
                <textarea :rows="searchbarRows" class="dropdown-search" autocomplete="off"
                    :name="internalName"
                    v-model="search.searchText">
                </textarea>
            </div>
            
            <select multiple class="dropdown-list" :class="{'dropdown-list-active': search.active}"
                @change="setActiveSelections()" 
                v-model="search.activeSelections">

                <option class="dropdown-option" 
                    v-for="item in props.availableSelections"
                    v-show="search.availableSelections.includes(item)" 
                    :value="item">
                    {{ item }}
                </option>
            </select>
        </div>
    </div>
</template>

<style scoped>

.dropdown-container {
    display: flex;
    flex-direction: v-bind('dropdownDir');
    /* align-items: center; */
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
    font-size: var(--font-size-lg1);
    height: 100%;
}

.dropdown-search-container {
    width: 100%;
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
    border: none;
    resize: none;
}

.dropdown-list {
    display: none;
    list-style: none;
    position: absolute;
}

.dropdown-list-active {
    display: block;
    z-index: 1;
    max-height: 200px;
    width: 100%;
}

.dropdown-option {
    font-size: var(--font-size);
}

</style>