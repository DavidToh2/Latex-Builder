<script setup lang="ts">

    import { ref, computed } from 'vue';

    const props = withDefaults(defineProps<{
        source?: string,
        height?: string
    }>(), {
        source: '',
        height: 'fit-content'
    })

    const imageDisplayed = computed<boolean>(() => {
        if (props.source){
            return true
        } else {
            return false
        }
    })

</script>
<template>
    <div class="latex-preview" v-show="imageDisplayed">
        <img :src="source" class="latex-preview-img">
    </div>
</template>
<style scoped>

.latex-preview {
    height: v-bind(height);
    padding: 30px;
    display: flex;
    flex-direction: row;
    overflow-y: scroll;
}

.latex-preview-img {
    max-width: 100%;
}

</style>