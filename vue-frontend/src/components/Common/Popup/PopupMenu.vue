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
    <div class="popup-menu-entry">
        <div class="popup-menu-description">
            {{ props.description }}
        </div>
        <div class="btn-light popup-menu-button" @click="switchActive(true)">
            Click to Open
        </div>
    </div>
    <div class="popup-menu-container" v-show="isActive">
        <div class="popup-background">

        </div>
        <div class="popup-menu-window">
            <slot>
                <!-- Hover display content goes here -->
            </slot>
            <div class="popup-menu-close">
                <img src="@/assets/svg/cross.svg" class="popup-menu-close-button icon" @click="switchActive(false)">
            </div>
        </div>
    </div>
</template>

<style scoped>
.popup-menu-entry {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
}

.popup-menu-description {
    font-size: var(--font-size-lg2);
}

.popup-menu-button {
    width: 100%;
}

.popup-menu-window {
    position: fixed;
    top: 25%;
    left: 25%;
    width: 50%;
    height: 50%;
    background-color: white;
    z-index: 10;
    border: 1px solid var(--colour-border-dark);
    border-radius: 30px;
    padding: 30px 30px;
    overflow-y: scroll;
}

.popup-menu-close {
    position: absolute;
    top: 20px;
    left: calc(100% - 50px);
}

.popup-menu-close-button {
    height: 30px;
    width: 30px;
    cursor: pointer;
}
</style>