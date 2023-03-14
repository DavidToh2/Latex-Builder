<script setup lang="ts">

    import { reactive, computed, watch } from 'vue'
    import { numberToPixels } from '@/aux'

    export interface Props {
        description: string
        internalName: string
        activeSelections?: string[]
        availableSelections?: string[]
        fontSize?: number
    }

        // Define the default value of props

    const props = withDefaults(defineProps<Props>(), {
        activeSelections: Object.assign(<string[]>[]),
        fontSize: 18
    })

    const search = reactive({
        searchText: '',
        active: false,
        activeSelections: <string[]> [...props.activeSelections as string[]]
    })

    watch(() => props.activeSelections, (newActive, oldActive) => {
        search.activeSelections = [...newActive as string[]]
        displayActiveSelections()
    }, {deep: true})

    const dropdownDir = (props.fontSize == 18) ? "row" : "column"     // Formats direction of dropdown under styles. Note this variable is not reactive.

    const searchbarRows = computed<number>(() => {
        if (search.searchText.length >= 25) {
            return 2
        } else {
            return 1
        }
    })
    const inputContainerHeight = computed<number>(() => {
        const p : number = (1 + searchbarRows.value) * 16 - 7
        return p
    })

    const emits = defineEmits<{
        (e: 'update', values: string[], intName: string): void
    }>()

    // When a user clicks on the input box, clear the searchText and let them type and search.

    let initialiseSearch = (e : Event) => {
        let t = e.target as HTMLInputElement
        search.searchText = ""
        t.value = ""
    }

        // Whenever the input text is updated, get the list of matching available selections.

    let searchAvailableSelections = (e : Event) => {

        let t1 = e.target as HTMLInputElement
        let t = t1.nextElementSibling as HTMLSelectElement
        search.searchText = t1.value        // The javascript searchText variable and HTML t1.value have to be manually synced up.

        // Search and display:

        for (var child of t.children as HTMLCollection) {

            child.classList.remove('dropdown-option-inactive')

            let s : string = search.searchText
            let s1 : string = child.innerHTML
            let i : number = s.length
            let j : number = s1.length
            let r : boolean = false

            for (let x=0; x<j-i; x++) {
                if (s.substring(x, x+i).toLowerCase() == s1.substring(x, x+i).toLowerCase()) {
                    r = true
                }
            }

            if (!r) {
                child.classList.add('dropdown-option-inactive')
            }
        }
    }

    // When a user clicks away from the input box, display their selected options.

    let displayActiveSelections = () => {
        let str = ''
        if (search.activeSelections.length > 0) {
            for (var item of search.activeSelections) {
                str += item += ", "
            }
            str = str.slice(0, -2)
        }
        search.searchText = str
    }

    // Whenever the list of active selections is updated, send this information back to the parent using an emit.

    let setActiveSelections = () => {
        displayActiveSelections()
        emits('update', search.activeSelections, props.internalName)
    }

</script>

<template>
    <div class="dropdown-container">
        <div class="dropdown-description textbox">
            {{ description }}
        </div>
        <div class="dropdown-search-container-outer">
            <div class="dropdown-search-container" @mouseenter="search.active = true" @mouseleave="search.active = false">
                <textarea :rows="searchbarRows" class="dropdown-searchbar" autocomplete="off" style="resize: none;" 
                    :name="internalName"
                    :value="search.searchText" 
                    @focus="initialiseSearch($event)" 
                    @input="searchAvailableSelections($event)" 
                    @blur="displayActiveSelections()">
                </textarea>
              
                <select multiple class="dropdown-list" :class="{'dropdown-list-active': search.active}"
                    @change="setActiveSelections()" 
                    v-model="search.activeSelections">

                    <option class="dropdown-option" v-for="item in availableSelections" :value="item">{{ item }}</option>
                </select>
            </div>
        </div>
    </div>
</template>

<style scoped>

.dropdown-container {
    display: flex;
    height: calc(v-bind(numberToPixels(inputContainerHeight)));
    flex-direction: v-bind('dropdownDir');
    justify-content: center;
    gap: 7px;
    padding: 0px 7px;
    position: relative;
}

.dropdown-description {
    font-size: calc(v-bind(numberToPixels(fontSize)));
}

.dropdown-search-container-outer {
    flex-grow: 1;
}

.dropdown-search-container {
    width: 100%;
    position: absolute;
}

.dropdown-searchbar {
    width: 100%;
    font-family: 'Gothic A1', sans-serif;
    font-size: calc(v-bind(numberToPixels(fontSize - 2)));
    resize: none;
}

.dropdown-list {
    display: none;
    list-style: none;
}

.dropdown-list-active {
    display: block;
    z-index: 1;
    max-height: 200px;
    width: 100%;
}

.dropdown-option {
    font-size: calc(v-bind(numberToPixels(fontSize - 2)));
}

.dropdown-option-inactive {
    display: none;
}
</style>