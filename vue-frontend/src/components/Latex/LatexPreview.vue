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
            // console.log("Showing latex preview")
            return true
        } else {
            // console.log("Hiding latex preview")
            return false
        }
    })

</script>
<template>
    <div class="latex-preview no-scrollbar" v-show="imageDisplayed">
        <span class="latex-preview-black-line-hotfix"></span>
        <img :src="source" class="latex-preview-img">
    </div>
</template>
<style scoped>

.latex-preview {
    height: v-bind(height); 
    max-width: 100%;
    
    padding-left: var(--latex-side-padding);
    padding-right: var(--latex-side-padding);
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: scroll;
}

.latex-preview-black-line-hotfix {
    position: absolute;
    z-index: 1;
    background-color: var(--colour-background);
    width: 100%;
    height: 3px;
}

.latex-preview-img {
    max-width: 100%;
}

</style>