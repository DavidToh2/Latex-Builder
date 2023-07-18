<script setup lang="ts">

    import Template from './Template.vue';

</script>
<template>
    <div class="template-select-container">
        <div class="template-select-title">
            Select Template
        </div>
        <div class="template-select-list">
            <Template template-title="Default" internal-name="default"/>
            <Template template-title="Worksheet" internal-name="worksheet"/>
        </div>
    </div>
</template>
<style scoped>

.template-select-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 100%;
}

.template-select-title {
    font-size: var(--font-size-lg3);
}

.template-select-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: scroll;
    flex-grow: 1;
}

</style>