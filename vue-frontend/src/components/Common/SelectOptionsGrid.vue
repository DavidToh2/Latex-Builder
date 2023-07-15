<script setup lang="ts">

    import { ref, computed } from 'vue'

    const props = defineProps<{
        selections: string[],
        internalNames: string[]
        columns: number,
        activeSelection: string
    }>()
    const columnNo = ref(props.columns)
    const columnWidth = computed(() => {
        return ((100 / props.columns) + '%')
    })

    const emits = defineEmits<{
        (e: 'update', internalName: string): void
    }>()

</script>
<template>
    <div class="select-table-container">
        <template v-for="(item, index) in internalNames">
            <div class="select-table-item" 
                :class="{'select-table-item-active' : activeSelection == item}" 
                @click="$emit('update', item)"
                v-html="selections[index]">
            </div>
        </template>
    </div>
</template>
<style scoped>

.select-table-container {
    display: grid;
    grid-template-columns: repeat(v-bind(columnNo), v-bind(columnWidth));
    width: 100%;
}

.select-table-item {
    text-align: center;
    border: 1px solid var(--colour-border);
    padding: 7px 14px;
    cursor: pointer;
}

.select-table-item-active {
    background-color: var(--colour-lighttheme-light);
}

</style>