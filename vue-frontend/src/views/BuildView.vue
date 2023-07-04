<script setup lang="ts">

import Title from '@/components/PageTitle.vue'
import Tab from '@/components/Tab/Tab.vue';

import DisplayTable from '@/components/DisplayTable/DisplayTable.vue'
import DisplayTableAddElement from '@/components/DisplayTable/DisplayTableAddElement.vue';

import WorksheetFilters from '@/components/SearchFilters/WorksheetFilters.vue';

import { ref, reactive, onMounted } from 'vue'

import type { worksheetElement, ws } from '@/types/WorksheetTypes';
import { emptyWorksheetConfig, latexTypeStrings } from '@/types/WorksheetTypes'
import { useQuestionStore } from '@/stores/questionStore';

import { buildWorksheet } from '@/post/postFile';

const QuestionStore = useQuestionStore()

const buildOptionsLeftTab = ['Selected Questions', 'Document Settings']
const buildOptionsRightTab = ['Compile', 'Download']

const activeOptions = reactive([true, false])
const activeOptionID = ref<number>(0)

const worksheet : ws = reactive({
	elements: [],
	config: emptyWorksheetConfig
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
			console.log(QuestionStore.getBuild())
		break;
		case 'Compile':

		break;
		case 'Download':
			const response = await buildWorksheet(worksheet)
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

const isDragging = ref(false)
function startDrag() {
	isDragging.value = true
}
function startPlaceholderDrag(elementType : string) {
	isDragging.value = true
	const p : worksheetElement = {
		type: "placeholder",
		body: {
			text: elementType
		}
	}
	worksheet.elements.unshift(p)
}
function swapTwoElements(a: number, b: number) {
	// console.log("Swapping two elements...")
	const c = worksheet.elements[a]
	worksheet.elements[a] = worksheet.elements[b]
	worksheet.elements[b] = c
}

function addElement(e : DragEvent, i : number) {
	const elementType = (e.dataTransfer as DataTransfer).getData('type')
	// console.log(`Dropping element of type ${elementType} at position ${i}`)
	if (latexTypeStrings.includes(elementType)) {
		var n : worksheetElement
		switch(elementType) {
			case 'latex':
				const li = worksheet.config.latexElements.latexCount
				n = {
					type: "latex",
					body: {
						displayID: `latex${li}`,
						text: ''
					}
				}
				worksheet.config.latexElements.latexCount++
				break
			case 'latexHeading':
				const lhi = worksheet.config.latexElements.latexHeadingCount
				n = {
					type: "latexHeading",
					body: {
						displayID: `latexHeading${lhi}`,
						type: 'section',
						text: ''
					}
				}
				worksheet.config.latexElements.latexHeadingCount++
				break
			case 'latexEnum':
				const lei = worksheet.config.latexElements.latexEnumCount
				n = {
					type: "latexEnum",
					body: {
						displayID: `latexEnum${lei}`,
						type: 'numeric',
						template: '(*)'
					}
				}
				worksheet.config.latexElements.latexEnumCount++
				break
			default:
				n = {
					type: "latex",
					body: {
						displayID: `latexPlaceholder`,
						type: 'numeric',
						template: '(*)'
					}
				}
				break
		}
		worksheet.elements.splice(i, 1)
		QuestionStore.insertElementIntoBuild(n, i)
	}
}

onMounted(() => {
	console.log("Mounting...")

	// NOTE: the Build Store is passed by reference to worksheet.elements.

	Object.assign(worksheet.elements, QuestionStore.getBuild())

	document.addEventListener('dragover', function(event) {
		event.preventDefault()
	})
	document.addEventListener('drop', function(event : DragEvent) {
		event.preventDefault()
		isDragging.value = false
		const i = worksheet.elements.findIndex(element => (element.type == 'placeholder'))

		// If user mouse is outside the build DisplayTable, simply remove the placeholder
		const bc = document.querySelector('#build-container') as HTMLDivElement
		const bcrect = bc.getBoundingClientRect()
		if ((event.clientX < bcrect.left) || (event.clientX > bcrect.right) || (event.clientY < bcrect.top) || (event.clientY > bcrect.bottom)) {
			if (i != -1) {
				worksheet.elements.splice(i, 1)
			}

		// Otherwise, insert the element
		} else {
			addElement(event, i)
		}
	})
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
			<DisplayTableAddElement 
				@start-drag="startPlaceholderDrag"/>
			<DisplayTable internal-name="build-table" :elements="worksheet.elements" 
				@delete="removeFromBuild" @up="elementUp" @down="elementDown"
				:is-dragging="isDragging" @swap="swapTwoElements" @start-drag="startDrag"
				/>
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
