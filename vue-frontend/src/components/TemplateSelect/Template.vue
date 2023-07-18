<script setup lang="ts">

    interface Props {
        templateTitle?: string,
        templateDescription?: string
    }

    const props = withDefaults(defineProps<Props>(), {
        templateTitle: "My Template",
        templateDescription: "This is a description of my template. Pick one of our free resume templates, fill it out, and land that dream job! Create and download your professional resume in less than 5 minutes. "
    })

    const emits = defineEmits<{
        (e: 'select', template: string): void
    }>()

    function selectTemplate(s: string) {
        emits('select', s)
    }

</script>
<template>
    <div class="template-container">
        <div class="template-title" @click="selectTemplate(props.templateTitle)">
            {{ props.templateTitle }}
        </div>
        <div class="template-description">
            {{ props.templateDescription }}
        </div>
    </div>
</template>
<style scoped>

.template-container {
    display: grid;
    grid: auto / 20% calc(80% - 10px);
    gap: 10px;
    width: 100%;
}

.template-title {
    font-size: var(--font-size-lg1);
    cursor: pointer;
}

</style>