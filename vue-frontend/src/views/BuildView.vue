<script setup lang="ts">

import Title from '@/components/PageTitle.vue'
import Tab from '@/components/Tab/Tab.vue';

import DisplayTable from '@/components/DisplayTable/DisplayTable.vue'
import DisplayTableAddElement from '@/components/DisplayTable/DisplayTableAddElement.vue';

import WorksheetFilters from '@/components/SearchFilters/WorksheetFilters.vue';

import { ref, reactive, onMounted } from 'vue'

import type { qn, qns } from '@/types/Types'
import type { worksheetElement, ws } from '@/types/WorksheetTypes';
import { useQuestionStore } from '@/stores/questionStore';

const QuestionStore = useQuestionStore()

const buildOptionsLeftTab = ['Selected Questions', 'Document Settings']
const buildOptionsRightTab = ['Compile', 'Download']

const activeOptions = reactive([true, false])
const activeOptionID = ref<number>(0)

var buildQns : qns = reactive({
	qns : []
})

const worksheet : ws = reactive({
	elements : [],
	config: ''
})

QuestionStore.$onAction(
    ({name, store, args, after, onError }) => {
        if ( (name == 'insertQnFromDatabaseToBuild') || (name == 'deleteFromBuild') || (name == 'swapTwoElementsInBuild') ) {
            after((result) => {
                if (result) {
                    const newBuildQnList = QuestionStore.getBuild() as worksheetElement[]
                    worksheet.elements = newBuildQnList
                }
            })
        }
    }
)

async function changeOptionTab(s : string, n : number) {

    if (n == activeOptionID.value) {
        return
    }
    activeOptionID.value = n

	for (var i=0; i<4; i++) { activeOptions[i] = false }

	switch(s) {
		case 'Selected Questions':

		break;
		case 'Document Settings':

		break;
		case 'Compile':

		break;
		case 'Download':

		break;
	}

	activeOptions[activeOptionID.value] = true
}

function elementUp(dispID : string) {
	QuestionStore.swapTwoElementsInBuild(dispID, 'up')
}
function elementDown(dispID : string) {
	QuestionStore.swapTwoElementsInBuild(dispID, 'down')
}
function removeFromBuild(displayID : string) {
	QuestionStore.deleteFromBuild(displayID)
}

onMounted(() => {
	worksheet.elements = QuestionStore.getBuild()
})

</script>

<template>
	<div class="viewport">
		<Title title="Worksheet Builder" />
		<Tab 
			:tab-left="buildOptionsLeftTab" :tab-right="buildOptionsRightTab" 
			:font-size=22 internalName="buildOptions" :active-i-d="activeOptionID" @change-tab="changeOptionTab"
		/>

		<div id="build-container" :class="{ 'inactive-container': !activeOptions[0] }">
			<DisplayTableAddElement />
			<DisplayTable internal-name="build-table" :elements="worksheet.elements" @delete="removeFromBuild" @up="elementUp" @down="elementDown"/>
		</div>

		<div id="document-settings-container" :class="{ 'inactive-container': !activeOptions[1] }">
			<WorksheetFilters />
			<div class="preview" id="preview">
			</div>
		</div>
	</div>
</template>

<style scoped>

#build-container {
	width: 100%;
}

#document-settings-container {
	width: 100%;
    padding: 0px 10px;
}

.inactive-container {
	display: none !important;
}
.preview {
	width: 100%;
	height: 500px;
	max-height: none;
    border: 1px solid #000000;

    overflow-y: scroll;
}
</style>
