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
        fontSize: "20",
    })

    // REACTIVE VARIABLES
        // These Javascript variables are bound using :value, and are automatically updated along with their bound HTML counterparts.
        // Since this is TypeScript, we have to explicitly type the empty array.    

    const search = reactive({
        searchText: '',
        activeSelections: <string[]>[],
        active: false
    })

    const dropdownDir = (props.fontSize == "20") ? "row" : "column"     // Formats direction of dropdown under styles. Note this variable is not reactive.

    // EMITS send data to the parent components of this component.
        // The update emit sends the list of selected items to the parent.

    const emits = defineEmits<{
        (e: 'update', intName: string, values: string[]): void
    }>()

        // Whenever the input text is updated, get the list of matching available selections.

    let searchAvailableSelections = (e : Event) => {

        // Sadly, TypeScript doesn't really support the use of 'this' in onclick="function(this)"
        // One workaround is to use "function($event)", which directly accesses the DOM event (in this case, onclick),
        // then use event.target to access the DOM element.

        let t1 = e.target as HTMLInputElement
        let t = t1.nextElementSibling as HTMLSelectElement

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

        // Whenever the list of active selections is updated, send this information back to the parent using an emit.

    let setActiveSelections = () => {
        emits('update', props.internalName, search.activeSelections)
    }

</script>

<template>
    <div class="dropdown-container">
        <div class="dropdown-description textbox" :style="{'font-size' : fontSize + 'px'}">
            {{ description }}
        </div>
        <div class="dropdown-search-container-outer">
            <div class="dropdown-search-container" @mouseover="search.active = true" @mouseout="search.active = false">
                <input type="text" class="dropdown-searchbar" autocomplete="off" :name="internalName" :style="{'font-size' : fontSize + 'px'}" v-model="search.searchText" @input="searchAvailableSelections($event)">

                <!-- Emits an event to update the parent component whenever the selection is changed. 
                This is to allow other DropdownSearches to access this DropdownSearch's selections. -->
                
                <select multiple class="dropdown-list" :value="search.activeSelections" @change="setActiveSelections()" :class="{'dropdown-list-active': search.active}">
                    <option class="dropdown-option" v-for="item in availableSelections">{{ item }}</option>
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
    font-size: 16px;
}

.dropdown-search-container-outer {
    flex-grow: 1;
    height: 25px;
}

.dropdown-search-container {
    width: 100%;
    position: absolute;
}

.dropdown-searchbar {
    width: 100%;
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