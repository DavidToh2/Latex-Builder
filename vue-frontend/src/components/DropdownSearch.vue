<script setup lang="ts">

export interface Props {
  description: string
  internalName: string
  fontSize?: string
}

const props = withDefaults(defineProps<Props>(), {
  fontSize: "20"
})

const dropdownDir = (props.fontSize == "20") ? "row" : "column"

</script>

<template>
    <div class="dropdown-container">
        <div class="dropdown-description textbox" :style="{'font-size' : fontSize + 'px'}">
            {{ description }}
        </div>
        <div class="dropdown-search-container">
            <input type="text" class="dropdown-searchbar" :name="internalName" :style="{'font-size' : fontSize + 'px'}">
            <ul class="dropdown-list">
                <li>"Hi"</li>
            </ul>
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

.dropdown-search-container {
    flex: 1;
}

.dropdown-searchbar {
    width: 100%;
}

.dropdown-list {
    display: none;
    position: absolute;
    list-style: none;
}
</style>