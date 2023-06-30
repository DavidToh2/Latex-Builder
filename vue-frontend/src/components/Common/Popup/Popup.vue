<script setup lang="ts">

    export interface Props {
        isActive?: boolean
    }

    const props = withDefaults(defineProps<Props>(), {
        isActive: false
    })

    const emits = defineEmits<{
        (e: 'close'): void
    }>()

</script>
<template>
    <div class="popup-window" :class="{ 'popup-window-active': isActive }">
        <slot name="popup-content">

        </slot>
        <div class="popup-close">
            <img src="@/assets/logo.svg" class="popup-close-button" @click="$emit('close')">
        </div>
    </div>
</template>
<style scoped>

.popup-window {
    position: fixed;
    top: 150px;
    left: 40%;
    width: 20%;
    height: 250px;
    background-color: var(--colour-background);
    z-index: 10;
    border: 3px solid var(--colour-border);
    border-radius: 30px;
    padding: 30px 30px;

    display: none;
}

.popup-window-active {
    display: block;
}

.popup-close {
    position: absolute;
    top: 20px;
    left: calc(100% - 50px);
}

.popup-close-button {
    height: 30px;
    width: 30px;
    cursor: pointer;
}
</style>