<script setup lang="ts">
import Title from '@/components/PageTitle.vue'
import WorksheetFilters from '@/components/QuestionFilters/WorksheetFilters.vue';
import SearchTable from '@/components/SearchTable/SearchTable.vue'
import Tab from '@/components/Tab/Tab.vue';
import { ref } from 'vue'

const buildOptionsLeftTab = ['Selected Questions', 'Preview']
const buildOptionsRightTab = ['Export as List', 'Download']

var activeOptionID = ref<number>(0)

</script>

<template>
	<Title title="Build" />
	<Tab 
		:tab-left="buildOptionsLeftTab" :tab-right="buildOptionsRightTab" 
		:font-size=22 internalName="buildOptions" :active-i-d="activeOptionID"
	/>
	<WorksheetFilters />
	<SearchTable />
</template>

<style scoped>
</style>
