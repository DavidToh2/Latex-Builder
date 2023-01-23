<script setup lang="ts">

    import { ref, reactive, computed } from 'vue'

    // PROPS receive data from the parent components of this component.
        // When the child component is refreshed, the list of available selections is received from the parent.

    export interface Props {
        description: string
        internalName: string
        availableSelections?: string[]
        fontSize?: string
    }

        // Define the default value of props

    const props = withDefaults(defineProps<Props>(), {
        fontSize: "16px",
    })

    // REACTIVE VARIABLES
        // These Javascript variables are bound using :value, and are automatically updated along with their bound HTML counterparts.
        // Since this is TypeScript, we have to explicitly type the empty array.    

    const search = reactive({
        searchText: '',
        activeSelections: <string[]>[],
        active: false
    })

    const dropdownDir = (props.fontSize == "16px") ? "row" : "column"     // Formats direction of dropdown under styles. Note this variable is not reactive.
    const dropdownRows = (props.fontSize == "16px") ? 2 : 1

    // EMITS send data to the parent components of this component.
        // The update emit sends the list of selected items to the parent.

    const emits = defineEmits<{
        (e: 'update', intName: string, values: string[]): void
    }>()

    // When a user clicks on the input box, clear the searchText and let them type and search.

    let initialiseSearch = (e : Event) => {

        // Sadly, TypeScript doesn't really support the use of 'this' in onclick="function(this)"
        // One workaround is to use "function($event)", which directly accesses the DOM event (in this case, onclick),
        // then use event.target to access the DOM element.

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
        for (var item of search.activeSelections) {
            str += item += ", "
        }
        str = str.slice(0, -2)
        search.searchText = str
    }

    // Whenever the list of active selections is updated, send this information back to the parent using an emit.

    let setActiveSelections = () => {
        displayActiveSelections()
        emits('update', props.internalName, search.activeSelections)
    }

</script>

<template>
    <div class="dropdown-container">
        <div class="dropdown-description textbox">
            {{ description }}
        </div>
        <div class="dropdown-search-container-outer">
            <div class="dropdown-search-container" @mouseenter="search.active = true" @mouseleave="search.active = false">
                <textarea :rows="dropdownRows" class="dropdown-searchbar" autocomplete="off" :name="internalName" style="resize: none;" :value="search.searchText" @focus="initialiseSearch($event)" @input="searchAvailableSelections($event)" @blur="displayActiveSelections()"></textarea>

                <!-- Emits an event to update the parent component whenever the selection is changed. 
                This is to allow other DropdownSearches to access this DropdownSearch's selections. -->
                
                <select multiple class="dropdown-list" v-model="search.activeSelections" @change="setActiveSelections()" :class="{'dropdown-list-active': search.active}">
                    <option class="dropdown-option" v-for="item in availableSelections" :value="item">{{ item }}</option>
                </select>
            </div>
        </div>
    </div>
</template>

<style scoped>

.dropdown-container {
    display: flex;
    flex-direction: v-bind('dropdownDir');
    justify-content: center;
    gap: 7px;
    padding: 0px 7px;
    position: relative;
}

.dropdown-description {
    font-size: v-bind('fontSize');
}

.dropdown-search-container-outer {
    flex-grow: 1;
    height: calc(3 * v-bind('fontSize'));
}

.dropdown-search-container {
    width: 100%;
    position: absolute;
}

.dropdown-searchbar {
    width: 100%;
    font-family: 'Gothic A1', sans-serif;
    font-size: calc(v-bind(fontSize) - 2px);
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
    font-size: 16px;
}

.dropdown-option-inactive {
    display: none;
}
</style>