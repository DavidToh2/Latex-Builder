<script setup lang="ts">
import { useRouter } from 'vitepress';
const router = useRouter()
const props = defineProps<{
    title: string,
    desc: string,
    href?: string
}>()

function nav() {
    if (props.href) {
        console.log("Navigating")
        router.go(props.href)
    }
}

</script>

<template>
    <div class="docs-feature" :onClick="nav">
        <slot>

        </slot>
        <div class="docs-feature-info">
            <div class="docs-feature-title">{{ title }}</div>
            <div class="docs-feature-desc">{{ desc }}</div>
        </div>
    </div>
</template>

<style>

.docs-feature {
    display: flex;
    flex-direction: row;
    max-width: 100%;
    column-gap: 10px;
    row-gap: 20px;
    padding: 10px;
    cursor: pointer;
}

.docs-feature:hover {
    background-color: var(--background-light);
}

.docs-feature-info {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.docs-feature-title {
    font-size: var(--font-size-lg2);
}

</style>