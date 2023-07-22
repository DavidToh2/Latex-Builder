<script setup lang="ts">

    import { computed, ref, watch } from 'vue'

    export interface Props {
        size: number
    }

    const props = withDefaults(defineProps<Props>(), {
    })

    const popupSize = ref(props.size)
    watch(() => props.size, (newS, oldS) => {
        console.log(`New popup size: ${newS}`)
        popupSize.value = newS
    })

    const active = computed<boolean>(() => {
        return (popupSize.value != 0)
    })
    const sizeClass = computed(() => ({
        'popup-sm': popupSize.value == 1,
        'popup-md': popupSize.value == 2,
        'popup-lg': popupSize.value == 3
    }))

    const emits = defineEmits<{
        (e: 'close'): void
    }>()

</script>
<template>
    <div class="popup-container" v-show="active">
        <div class="popup-background">

        </div>
        <div class="popup-window" :class="sizeClass">
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
    background-color: var(--colour-background);
    z-index: 10;
    border: 3px solid var(--colour-border);
    border-radius: 12px;
    padding: 24px;
    padding-right: 48px;
    overflow-y: scroll;
    word-wrap: break-word;
    white-space: pre-wrap;
}

.popup-sm {
    left: 40%;
    width: 20%;
    height: fit-content;
}
.popup-md {
    left: 33%;
    width: 33%;
    height: 30%;
}
.popup-lg {
    left: 25%;
    width: 50%;
    height: 50%;
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