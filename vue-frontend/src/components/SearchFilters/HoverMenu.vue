<script setup lang="ts">

    import { ref } from 'vue'

    export interface Props {
        description: string
    }
    const props = withDefaults(defineProps<Props>(), {
        description: "Hi!"
    })
    var isActive = ref(false)

    function switchActive(b : boolean) {
        isActive.value = b
    }
    
</script>

<template>
    <div class="hover-container">
        <div class="hover-description">
            {{ props.description }}
        </div>
        <div class="hover-button" @click="switchActive(true)">
            Click to Open
        </div>
    </div>
    <div class="hover-menu" v-show="isActive">
        <slot name="hover-content">
            <!-- Hover display content goes here -->
        </slot>
        <div class="hover-close">
            <img src="@/assets/rightarrow.png" class="hover-close-button" @click="switchActive(false)">
        </div>
    </div>
</template>

<style scoped>
.hover-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
}

.hover-description {
    font-size: 21px;
}

.hover-button {
    background-color: #aaccbb;
    width: 100%;
    padding: 5px;
    text-align: center;
    cursor: pointer;
}

.hover-menu {
    position: fixed;
    top: 25%;
    left: 25%;
    width: 50%;
    height: 50%;
    background-color: white;
    z-index: 10;
    border: 3px solid black;
    border-radius: 30px;
    padding: 30px 30px;
}

.hover-menu-inactive {
    display: none;
}

.hover-close {
    position: absolute;
    top: 20px;
    left: calc(100% - 50px);
}

.hover-close-button {
    height: 30px;
    width: 30px;
    cursor: pointer;
}
</style>