<script setup lang="ts">

import { ref, computed } from 'vue';
import { numberToPixels } from '@/aux'

const props = withDefaults(defineProps<{
    hoverText : string,
    theme?: 'normal' | 'light' | 'bg',
    maxWidth?: number
}>(), {
    theme: 'normal',
    maxWidth: 90
})

const isHovering = ref(false)
const hovertheme = computed<string>(() => {
    if (!isHovering.value) {
        return 'none'
    }
    return props.theme
})

</script>
<template>
    <div class="icon-hover" :class="{
            'icon-hovering': hovertheme == 'normal', 
            'icon-hovering-light': hovertheme == 'light',
            'icon-hovering-bg': hovertheme == 'bg'
        }" 
        @mouseenter="isHovering = true" @mouseleave="isHovering = false">
        <div :class="{
            'icon-lg': ((theme == 'light') || (theme == 'bg')),
            'icon-lg-l': theme == 'normal'
        }">
            <slot>
            </slot>
        </div>
        <Transition>
            <div class="hover-text-container" v-if="isHovering">
                <div :class="{
                    'hover-text': hovertheme == 'normal', 
                    'hover-text-light-bg': (hovertheme == 'light') || (hovertheme == 'bg')
                }">{{ hoverText }}</div>
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

.icon-hovering-bg {
    background-color: var(--colour-background-hover);
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
    font-size: var(--font-size);
}
.hover-text-light-bg {
    width: max-content;
}

.hover-text {
    width: max-content;
    color: var(--colour-text-light);
}

.v-enter-active, .v-leave-active {
    transition: all 1s;
}
.v-enter-from, .v-leave-to {
    max-width: 0;
}
</style>