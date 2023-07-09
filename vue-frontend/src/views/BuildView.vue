<script setup lang="ts">

import Title from '@/components/PageTitle.vue'
import Tab from '@/components/Tab/Tab.vue';

import DisplayTable from '@/components/DisplayTable/DisplayTable.vue'
import DisplayTableAddElement from '@/components/DisplayTable/DisplayTableAddElement.vue';

import WorksheetFilters from '@/components/SearchFilters/WorksheetFilters.vue';

import { ref, reactive, onMounted, computed } from 'vue'

import type { worksheetElement, ws } from '@/types/WorksheetTypes';
import { defaultLatex, defaultLatexHeading, defaultLatexEnum, emptyWorksheetConfig, latexTypeStrings } from '@/types/WorksheetTypes'
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
        if ( (name == 'insertQnFromDatabaseToBuild') || (name == 'insertElementIntoBuild') || (name == 'deleteFromBuild') || (name == 'swapTwoElementsInBuild') ) {
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
	if (n < 2) {
		activeOptionID.value = n
		for (var i=0; i<4; i++) { activeOptions[i] = false }
		activeOptions[activeOptionID.value] = true
	}

	switch(s) {
		case buildOptionsLeftTab[0]:

		break;
		case buildOptionsLeftTab[1]:
			console.log(QuestionStore.getBuild())
			console.log(QuestionStore.getBuildIDList())
		break;
		case buildOptionsRightTab[0]:
			worksheet.elements = QuestionStore.getBuild()

			// BUILD WORKSHEET

			const responsejson = await buildWorksheet(worksheet)
			if (responsejson.status == -1) {
				// Error occured
				const error = responsejson.error
				console.log(error)

			} else if (responsejson.status == 1) {
				// Failure: LaTeX compilation error
				console.log("User error")
				QuestionStore.resetDisplayPDFName()

			} else {
				// Success
				console.log("Success")
				QuestionStore.setDisplayPDFName('output')
			}
		break;
		case buildOptionsRightTab[1]:
			
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
function removeFromBuild(displayID : string) {
	// console.log(`Deleting the following item from build: ${displayID}`)
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
			displayID: "placeholder",
			text: elementType
		}
	}
	QuestionStore.insertElementIntoBuild(p, 0)
	// console.log(QuestionStore.getBuild())
}
function swapTwoElements(a: number, b: number) {
	// console.log("Swapping two elements...")
	QuestionStore.swapTwoElementsInBuild(a, b)
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
					body: defaultLatex
				}
				n.body.displayID = `latex${li}`
				worksheet.config.latexElements.latexCount++
				break
			case 'latexHeading':
				const lhi = worksheet.config.latexElements.latexHeadingCount
				n = {
					type: "latexHeading",
					body: defaultLatexHeading
				}
				n.body.displayID = `latex${lhi}`
				worksheet.config.latexElements.latexHeadingCount++
				break
			case 'latexEnum':
				const lei = worksheet.config.latexElements.latexEnumCount
				n = {
					type: "latexEnum",
					body: defaultLatexEnum
				}
				n.body.displayID = `latex${lei}`
				worksheet.config.latexElements.latexEnumCount++
				break
			default:
				n = {
					type: "placeholder",
					body: {
						displayID: `placeholderDefault`,
						text: 'placeholder'
					}
				}
				break
		}
		QuestionStore.deleteFromBuild('placeholder')
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

// const buildIDArr = computed<string[]>(() => { return QuestionStore.getBuildIDList() })

</script>

<template>
	<div class="viewport">
		<Title title="Worksheet Builder" />
		<Tab 
			:tab-left="buildOptionsLeftTab" :tab-right="buildOptionsRightTab" 
			:font-size=22 internalName="buildOptions" :active-i-d="activeOptionID" @change-tab="changeOptionTab"
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
			<WorksheetFilters />
			<div class="latex">
				<textarea class="latex-text" name="documentClass" placeholder="documentClass:"></textarea>
				<textarea class="latex-text" name="packages" placeholder="Packages:"></textarea>
				<textarea class="latex-text" name="setup" placeholder="Setup:"></textarea>
				<textarea class="latex-text" name="title" placeholder="Title:"></textarea>
				<textarea class="latex-text" name="beginDocument" placeholder="Begin document:"></textarea>
				<textarea class="latex-text" name="body" placeholder="Type LaTeX here:"></textarea>
				<textarea class="latex-text" name="endDocument" placeholder="End document:"></textarea>
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

.latex {
	border: 1px solid black;
	padding: 7px;
	border-radius: 6px;
}

.latex-text {
	width: 100%;
	height: fit-content;
	border: 0;
	padding: 0px;
	resize: none;
}
</style>
