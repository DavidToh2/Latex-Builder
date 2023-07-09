<script setup lang="ts">

interface Props {
    removable?: boolean,
    colour?: string
}
const props = withDefaults(defineProps<Props>(), {
    removable: true,
    colour: 'none'
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
    width: var(--font-size);
    height: var(--font-size);
    cursor: pointer;
}

.entry-content {
    font-size: var(--font-size);
}

</style>