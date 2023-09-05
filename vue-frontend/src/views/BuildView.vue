<script setup lang="ts">

import Title from '@/components/PageTitle.vue'
import Tab from '@/components/Tab/Tab.vue';

import DisplayTable from '@/components/DisplayTable/DisplayTable.vue'
import DisplayTableAddElement from '@/components/DisplayTable/DisplayTableAddElement.vue';

import WorksheetFilters from '@/components/SearchFilters/WorksheetFilters.vue';

import { ref, reactive, onMounted, computed } from 'vue'

import type { worksheetConfig, worksheetElement, ws } from '@/types/WorksheetTypes';
import { defaultLatex, defaultLatexHeading, defaultLatexEnum, emptyWorksheetConfig, latexTypeStrings } from '@/types/WorksheetTypes'
import type { UserError, ServerError } from '@/types/ErrorTypes'
import { formatErrorMessage } from '@/types/ErrorTypes'

import { buildWorksheet } from '@/post/postFile';
import { useQuestionStore } from '@/stores/questionStore';
import { useUserStore } from '@/stores/userStore';

const QuestionStore = useQuestionStore()
const UserStore = useUserStore()

const buildOptionsLeftTab = ['Worksheet', 'Settings']
const buildOptionsRightTab = ['Compile', 'Save']

const activeOptions = reactive([true, false])
const activeOptionID = ref<number>(0)

const worksheet : ws = reactive({
	elements: [],
	config: emptyWorksheetConfig
})

QuestionStore.$onAction(
    ({name, store, args, after, onError }) => {
        if ( (name == 'insertQnFromDatabaseToBuild') || (name == 'insertElementIntoBuild') || (name == 'deleteElementFromBuild') || (name == 'updateElement') || (name == 'swapTwoElementsInBuild') ) {
            after((result) => {
                if (result) {
                    const newBuildQnList = QuestionStore.getBuild() as worksheetElement[]
                    worksheet.elements = newBuildQnList
                }
            })
        }
		if ( (name == 'setBuildWorksheetPage') || (name == 'setBuildWorksheetTemplate') || (name == 'setBuildWorksheetText') || (name == 'setBuildWorksheetTitle')) {
			after((result) => {
				if (result) {
					const newBuildwsConfig = QuestionStore.getBuildworksheetConfig() as worksheetConfig
					worksheet.config = newBuildwsConfig
				}
			})
		}
    }
)

async function changeOptionTab(s : string, n : number) {

    if (n == activeOptionID.value) {
        return
    }
	if (n < 2) {
		activeOptionID.value = n
		for (var i=0; i<4; i++) { activeOptions[i] = false }
		activeOptions[activeOptionID.value] = true
	}

	switch(s) {
		case buildOptionsLeftTab[0]:

		break;
		case buildOptionsLeftTab[1]:

		break;
		
		case buildOptionsRightTab[0]:
			if (!UserStore.getAuthStatus()) {
				UserStore.openPopup("You must be logged in to compile documents!")
				break;
			}
			worksheet.elements = QuestionStore.getBuild()

			// BUILD WORKSHEET

			const responsejson = await buildWorksheet(worksheet)
			if (responsejson.status == -1) {
				// Error occured
				const error = responsejson.error as ServerError
				const errormsg = formatErrorMessage(error)
				UserStore.openPopup(errormsg)
				QuestionStore.resetDisplayPDFName()

			} else if (responsejson.status == 1) {
				// Failure: LaTeX compilation error
				const error = responsejson.body as UserError
				const errormsg = error.cause
				UserStore.openBigPopup(errormsg)
				QuestionStore.resetDisplayPDFName()

			} else {
				// Success
				console.log("Success")
				QuestionStore.setDisplayPDFName('output')
			}
		break;
		case buildOptionsRightTab[1]:
			if (!UserStore.getAuthStatus()) {
				UserStore.openPopup("You must be logged in to save documents!")
				break;
			}
			console.log(QuestionStore.getBuild())
			console.log(QuestionStore.getBuildworksheetConfig())
		break;
	}
}

function elementUp(i : number) {
	if (i > 0) {
		QuestionStore.swapTwoElementsInBuild(i, i-1)
	}
}
function elementDown(i : number) {
	if (i < worksheet.elements.length - 1) {
		QuestionStore.swapTwoElementsInBuild(i, i+1)
	}
}
function removeFromBuild(id : string) {
	// console.log(`Deleting the following item from build: ${id}`)
	QuestionStore.deleteElementFromBuild(id)
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
			id: "placeholder",
			text: elementType
		}
	}
	QuestionStore.insertElementIntoBuild(p, 0)
	// console.log(QuestionStore.getBuild())
}
function swapTwoElements(a: number, b: number) {
	console.log(`Swapping elements in positions ${a} and ${b}`)
	QuestionStore.swapTwoElementsInBuild(a, b)
}

function addElement(e : DragEvent, i : number) {
	const elementType = (e.dataTransfer as DataTransfer).getData('type')
	if (latexTypeStrings.includes(elementType)) {
		// console.log(`Inserting element ${elementType} at index ${i}`)
		switch(elementType) {
			case 'latexHeading':
				const lhi = worksheet.config.latexElements.latexHeadingCount
				const n2 : worksheetElement = {
					type: "latexHeading", 
					body: defaultLatexHeading
				}
				n2.body.id = `latexHeading${lhi}`
				worksheet.config.latexElements.latexHeadingCount++
				QuestionStore.insertElementIntoBuild(n2, i)
				break
			case 'latexEnum':
				const lei = worksheet.config.latexElements.latexEnumCount
				const n3 : worksheetElement = {
					type: "latexEnum",
					body: defaultLatexEnum
				}
				n3.body.id = `latexEnum${lei}`
				worksheet.config.latexElements.latexEnumCount++
				QuestionStore.insertElementIntoBuild(n3, i)
				break
			case 'latex':
				const li = worksheet.config.latexElements.latexCount
				const n1 : worksheetElement = {
					type: "latex",
					body: defaultLatex
				}
				n1.body.id = `latex${li}` 
				worksheet.config.latexElements.latexCount++
				QuestionStore.insertElementIntoBuild(n1, i)
				break
			default:
				const n4 : worksheetElement = {
					type: "placeholder",
					body: {
						id: `placeholderDefault`,
						text: 'placeholder'
					}
				}
				QuestionStore.insertElementIntoBuild(n4, i)
				break
		}
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
		event.stopImmediatePropagation()
		isDragging.value = false
		const i = worksheet.elements.findIndex(element => (element.type == 'placeholder'))
		if (i != -1) {
			QuestionStore.deleteElementFromBuild('placeholder')

			// If user mouse is outside the build DisplayTable, simply remove the placeholder
			const bc = document.querySelector('#build-container') as HTMLDivElement
			const bcrect = bc.getBoundingClientRect()
			if ((event.clientX < bcrect.left) || (event.clientX > bcrect.right) || (event.clientY < bcrect.top) || (event.clientY > bcrect.bottom)) {

			// Otherwise, insert the element
			} else {
				addElement(event, i) 
			}
		}
	})
})

</script>

<template>
	<div class="viewport">
		<Title title="Worksheet Builder" />
		<Tab 
			:tab-left="buildOptionsLeftTab" :tab-right="buildOptionsRightTab" 
			:font-size=22 internalName="buildOptions" :active-tab-index="activeOptionID" @change-tab="changeOptionTab"
		/>
		<!-- <div v-for="item in buildIDArr">{{ item }}</div> -->

		<div id="build-container" :class="{ 'inactive-container': !activeOptions[0] }">
			<DisplayTableAddElement 
				@start-drag="startPlaceholderDrag"/>
			<DisplayTable internal-name="build-table" :elements="worksheet.elements" 
				@delete="removeFromBuild" @up="elementUp" @down="elementDown"
				:is-dragging="isDragging" @swap="swapTwoElements" @start-drag="startDrag"
				/>
		</div> 

		<div id="document-settings-container" :class="{ 'inactive-container': !activeOptions[1] }">
			<WorksheetFilters :ws-config="worksheet.config"/>
			
		</div>
	</div>
</template>

<style scoped>

#build-container {
	width: 100%;
	height: 100%;
}

#document-settings-container {
	width: 100%;
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
