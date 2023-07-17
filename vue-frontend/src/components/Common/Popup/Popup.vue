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
    <div class="popup-container" v-show="isActive">
        <div class="popup-background">

        </div>
        <div class="popup-window">
            <slot>
            </slot>
            <div class="popup-close">
                <img src="@/assets/svg/cross.svg" class="popup-close-button icon-sm" @click="$emit('close')">
            </div>
        </div>
    </div>
</template>
<style scoped>

.popup-window {
    position: fixed;
    top: 150px;
    left: 40%;
    width: 20%;
    height: fit-content;
    background-color: var(--colour-background);
    z-index: 10;
    border: 3px solid var(--colour-border);
    border-radius: 12px;
    padding: 24px;
    padding-right: 48px;
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