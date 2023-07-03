<script setup lang="ts">

import { ref, computed } from 'vue';
import { numberToPixels } from '@/aux'

const props = withDefaults(defineProps<{
    hoverText : string,
    light?: boolean,
    maxWidth?: number,
    isActive?: boolean
}>(), {
    light: false,
    maxWidth: 90,
    isActive: false
})

const isHovering = ref(false)
const isHoveringLight = computed<boolean>(() => {
    return (isHovering.value && props.light)
})
const isHoveringDark = computed<boolean>(() => {
    return (isHovering.value && !props.light)
})

</script>
<template>
    <div class="icon-hover" :class="{'icon-hovering': isHoveringDark, 'icon-hovering-light': isHoveringLight}" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
        <div :class="{'icon-lg': props.light, 'icon-lg-l': !props.light}">
            <slot>
            </slot>
        </div>
        <Transition>
            <div class="hover-text-container" v-if="isHovering">
                <div :class="{'hover-text': !props.light, 'hover-text-light': props.light}">{{ hoverText }}</div>
            </div>
        </Transition>
    </div>
</template>
<style scoped>

.icon-hover {
    display: flex;
    flex-direction: row;
    align-items: center;

    padding: 4px;
    padding-right: 8px;
    gap: 4px;

    border-radius: 6px;
}

.icon-hovering-light {
    background-color: var(--colour-lighttheme-hover);
}
.icon-hovering {
    background-color: var(--colour-theme-hover);
}

.hover-text-container {
    cursor: pointer;
    max-width: calc(v-bind(numberToPixels(maxWidth)));
    overflow-x: hidden;
}

.hover-text {
    width: max-content;
    color: var(--colour-text-light);
}
.hover-text-light {
    width: max-content;
}

.v-enter-active, .v-leave-active {
    transition: all 1s;
}
.v-enter-from, .v-leave-to {
    max-width: 0;
}
</style>