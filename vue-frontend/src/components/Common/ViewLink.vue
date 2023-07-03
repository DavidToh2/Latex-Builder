<script setup lang="ts">

import { useUserStore } from '@/stores/userStore'
const UserStore = useUserStore()

const props = defineProps<{
    target: "HomeView" | "DocsView" | "ContributeView" | "DatabaseView" | "BuildView" | "DocumentView" | "DriveView" | "LatexView" | "AccountView"
}>()

function updateView(e : Event) {
    UserStore.displayView(props.target)
}

</script>
<template>
    <div @click="updateView($event)">
        <slot>

        </slot>
    </div>
</template>
<style scoped>
</style>