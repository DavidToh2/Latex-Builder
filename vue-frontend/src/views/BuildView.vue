<script setup lang="ts">
import Title from '@/components/PageTitle.vue'
import WorksheetFilters from '@/components/SearchFilters/WorksheetFilters.vue';
import SearchTable from '@/components/SearchTable/SearchTable.vue'
import Tab from '@/components/Tab/Tab.vue';

import { ref, reactive, onMounted } from 'vue'

import type { qn, qns } from '@/types/Types'
import { useQuestionStore } from '@/stores/questionStore';

const QuestionStore = useQuestionStore()

const buildOptionsLeftTab = ['Selected Questions', 'Preview']
const buildOptionsRightTab = ['Save to Drive', 'Download']

var activeOptions = reactive([true, false])
var activeOptionID = ref<number>(0)

var buildQns : qns = reactive({
	qns : []
})

function removeFromBuild(displayID : string) {
	QuestionStore.deleteFromBuild(displayID)
}

QuestionStore.$onAction(
    ({name, store, args, after, onError }) => {
        if ((name == 'insertFromDatabaseToBuild') ) {
            after((result) => {
                if (result) {
                    const newBuildQnList = QuestionStore.getBuild() as qn[]
                    buildQns.qns = newBuildQnList
                }
            })
        }
        if (name == 'deleteFromBuild') {
            after((result) => {
                if (result) {
					const newBuildQnList = QuestionStore.getBuild() as qn[]
                    buildQns.qns = newBuildQnList
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
		case 'Preview':

		break;
		case 'Save to Drive':

		break;
		case 'Download':

		break;
	}

	activeOptions[activeOptionID.value] = true

}

function questionUp(dispID : string) {
	var i = 0
	while (buildQns.qns[i].displayID != dispID) {
		i++
	}
	if (i > 0) {
		var t = buildQns.qns[i-1]
		buildQns.qns[i-1] = buildQns.qns[i]
		buildQns.qns[i] = t
	}
}
function questionDown(dispID : string) {
	var i = 0
	while (buildQns.qns[i].displayID != dispID) {
		i++
	}
	if (i < buildQns.qns.length - 1) {
		var t = buildQns.qns[i+1]
		buildQns.qns[i+1] = buildQns.qns[i]
		buildQns.qns[i] = t
	}
}

function build(type: string) {
	var reqBody = {} as { [key : string] : string | number | Date | null }

	for (const qn of buildQns.qns) {

	}
}

onMounted(() => {
	buildQns.qns = QuestionStore.getBuild()
})

</script>

<template>
	<Title title="Worksheet Builder" />
	<Tab 
		:tab-left="buildOptionsLeftTab" :tab-right="buildOptionsRightTab" 
		:font-size=22 internalName="buildOptions" :active-i-d="activeOptionID" @change-tab="changeOptionTab"
	/>
	<WorksheetFilters />

	<div id="build-container" :class="{ 'inactive-container': !activeOptions[0] }">
		<SearchTable internal-name="build-table" :qns="buildQns.qns" @delete="removeFromBuild" @up="questionUp" @down="questionDown"/>
	</div>

	<div id="preview-container" :class="{ 'inactive-container': !activeOptions[1] }">
		<div class="preview" id="preview">
		</div>
	</div>
</template>

<style scoped>

#build-container {
	width: 100%;
}

#preview-container {
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
