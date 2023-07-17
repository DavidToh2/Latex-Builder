<script setup lang="ts">

    import { numberToPixels } from '@/aux'

    interface Props {
        removable?: boolean,
        colour?: string,
        fontSize?: number
    }
    const props = withDefaults(defineProps<Props>(), {
        removable: true,
        colour: 'none',
        fontSize: 16
    })

    const emits = defineEmits<{
        (e: 'close'): void
    }>()

</script>

<template>
    <div class="entry" :class="[{'entry-green' : (colour == 'green')}, {'entry-yellow' : (colour == 'yellow')}, {'entry-red' : (colour == 'red')}]">
        <div class="entry-content">
            <slot>
            </slot>
        </div>
        <img v-if=removable src="@/assets/svg/cross.svg" class="entry-close-button icon-sm" @click="$emit('close')">
    </div>

</template>

<style scoped>

.entry-close-button {
    width: calc(v-bind(numberToPixels(fontSize)));
    height: calc(v-bind(numberToPixels(fontSize)));
    cursor: pointer;
}

.entry-content {
    font-size: calc(v-bind(numberToPixels(fontSize)));
}

</style>