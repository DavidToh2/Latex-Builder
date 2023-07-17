<script setup lang="ts">
    import DisplayTableHeader from "./DisplayTableHeader.vue"
    import DisplayTableEntry from "./DisplayTableEntry.vue"
    import DisplayTableElement from "./DisplayTableElement.vue"
    import DisplayTableAddPlaceholder from "./DisplayTableAddPlaceholder.vue"
    import { emptyQn } from '@/types/QuestionTypes'
    import type { qn } from "@/types/QuestionTypes"
    import { defaultLatex } from "@/types/WorksheetTypes"
    import type { worksheetElement, latex, latexHeading, latexEnum, latexTypes, latexTypeNames, placeholder } from "@/types/WorksheetTypes"
    import { latexTypeStrings } from "@/types/WorksheetTypes"
    import { ref, reactive, onUpdated } from "vue"

    export interface Props {
        internalName: string
        elements?: worksheetElement[]
        qns?: qn[]

        isDragging?: boolean
    }
    const props = defineProps<Props> ()

    const emits = defineEmits<{
        (e: 'insert', ID: string, direction: string): void
        (e: 'delete', ID: string): void
        (e: 'up', i : number): void
        (e: 'down', i : number): void
        (e: 'swap', index1: number, index2: number): void
        (e: 'startDrag'): void
        (e: 'endDrag'): void
    }>()

            // Object emit functions

    async function deleteObject(ID: string) {
        emits('delete', ID)
    }
    function insertObject(ID : string, direction : string) {
        emits('insert', ID, direction)
    }
    function objectUp(i : number) {
        emits('up', i)
    }
    function objectDown(i : number) {
        emits('down', i)
    }

            // Drag and drop functions

    const draggingActive = ref(true)
    const droppedElementIndex = ref(0)
    const targetElement = reactive({
        elementIndex: 0,
        aboveMouse: false
    })

    function startElementDrag(e : DragEvent, i : number) {
        droppedElementIndex.value = i
        targetElement.elementIndex = i;
        (e.dataTransfer as DataTransfer).setData('type', 'qn')
        emits('startDrag')

        const c = e.currentTarget as HTMLDivElement
        c.classList.add("display-table-entry-row-dragged")
    }
    function identifyCurrentElement(e : DragEvent, i : number)  {
        if (targetElement.elementIndex != i) {
            targetElement.elementIndex = i
            targetElement.aboveMouse = false
            // console.log(`Current element index: ${targetElement.elementIndex}`)
        }
    }
    function detectElementAboveMouse(e : DragEvent) {
        const element = e.currentTarget as HTMLElement

        const currentAboveMouseStatus = targetElement.aboveMouse
        // console.log(`currentAboveMouseStatus: ${currentAboveMouseStatus}`)
        const rect = element.getBoundingClientRect()
        // console.log(`rect.top: ${rect.top}, rect.height: ${rect.height}, clientY: ${e.clientY}`)
        if (!currentAboveMouseStatus && (rect.top + 2 * rect.height / 3) < e.clientY) {
            targetElement.aboveMouse = true
            
        } else if (currentAboveMouseStatus && (rect.top + rect.height / 3) > e.clientY) {
            targetElement.aboveMouse = false
            
        }
        const newAboveMouseStatus = targetElement.aboveMouse
        // console.log(`currentAboveMouseStatus: ${currentAboveMouseStatus}, newAboveMouseStatus: ${newAboveMouseStatus}`)

        if (currentAboveMouseStatus != newAboveMouseStatus) {
            const t = targetElement.elementIndex
            const d = droppedElementIndex.value
            // console.log(`Original indices: target element is ${t}, dropped element is ${d}`)
            if (t != d) {
                // If droppedElement above targetElement above mouse
                if (newAboveMouseStatus && (t > d)) {
                    targetElement.elementIndex = d
                    droppedElementIndex.value = t
                    // Swap droppedElement and targetElement
                    emits('swap', d, t)
                }
                // If mouse above targetElement above droppedElement
                if (!newAboveMouseStatus && (t < d)) {
                    targetElement.elementIndex = d
                    droppedElementIndex.value = t
                    // Swap targetElement and droppedElement
                    emits('swap', d, t)
                }
            }
        }
    }

    function endElementDrag(e : DragEvent) {
        emits('endDrag')
    }

    function toggleDragAllow(s : boolean) {
        draggingActive.value = s
    }

    // Reset drop parameters once drop is finished
    onUpdated(() => {
        if (!props.isDragging) {
            targetElement.aboveMouse = false
            targetElement.elementIndex = 0
            droppedElementIndex.value = 0
        }
    })

</script>

<template>
    <div class="display-table">
        <DisplayTableHeader />
        <template v-if="props.internalName == 'database-table'">
            <div class="display-table-results" v-for="(item, index) in qns">
                <DisplayTableEntry :internalName="props.internalName + '-qn'" :q="item" 
                    @insert="insertObject" @delete="deleteObject" @up="objectUp(index)" @down="objectDown(index)"/>
            </div>
        </template>
        <template v-if="props.internalName == 'build-table'">
            <div class="display-table-results" v-for="(item, index) in elements" :key="item.body.id">
                <DisplayTableEntry v-if="item.type == 'qn'"
                    :internalName="props.internalName + '-qn'" 
                    :q="(item.body as qn)" 
                    @insert="insertObject" 
                    @delete="deleteObject" 
                    @up="objectUp(index)" 
                    @down="objectDown(index)"
                    :draggable="draggingActive" 
                    class="draggable" 
                    @dragstart="startElementDrag($event, index)" 
                    @dragend="endElementDrag"
                    :class="{'display-table-entry-row-dragged': (droppedElementIndex == index) && isDragging}"
                    @dragenter="identifyCurrentElement($event, index)" 
                    @dragover="detectElementAboveMouse"/>

                <DisplayTableAddPlaceholder v-else-if="(item.type == 'placeholder') && isDragging"
                    :internalName="props.internalName + '-placeholder'" 
                    :text="(item.body as placeholder).text"
                    :class="{'display-table-entry-row-dragged': (droppedElementIndex == index) && isDragging}" 
                    @dragenter="identifyCurrentElement($event, index)" 
                    @dragover="detectElementAboveMouse"/>

                <DisplayTableElement v-else-if="latexTypeStrings.includes(item.type)"
                    :internalName="props.internalName + '-element'" 
                    :item="item"
                    @insert="insertObject" 
                    @delete="deleteObject" 
                    @up="objectUp(index)" 
                    @down="objectDown(index)"
                    :draggable="draggingActive" 
                    class="draggable" 
                    @dragstart="startElementDrag($event, index)" 
                    @dragend="endElementDrag"
                    :class="{'display-table-entry-row-dragged': (droppedElementIndex == index) && isDragging}"
                    @dragenter="identifyCurrentElement($event, index)" 
                    @dragover="detectElementAboveMouse"
                    @allow-drag="toggleDragAllow"/>
            </div>
        </template>
    </div>
</template>

<style scoped>


.display-table {
    padding: 0px 10px;
    --display-table-id-width: 40px;
    --display-table-topic-width: 130px;
    --display-table-difficulty-width: 80px;
    --display-table-source-width: 70px;
    --display-table-options-width: 80px;
    --display-table-questions-width: calc(100% - var(--display-table-id-width) - var(--display-table-topic-width) - var(--display-table-difficulty-width) - var(--display-table-source-width) - var(--display-table-options-width));
    --display-table-element-width: calc(100% - var(--display-table-id-width) - var(--display-table-options-width));
    flex-grow: 1;
    width: 100%;
    height: 100%;
}

.display-table-results {
    width: 100%;
    display: flex;
    flex-direction: column;
    font-size: 14px;
}

.display-table :deep(.display-table-entry-row) {
    width: 100%;
    display: flex;
    flex-direction: row;
}

.display-table :deep(.display-table-entry-row-dragged) {
    font-weight: bold;
}

.display-table :deep(.display-table-cell) {
    padding: 10px 8px;
    flex-shrink: 0;
    flex-grow: 0;
    font-weight: inherit;
}

.display-table :deep(.display-table-id) {
    flex-basis: var(--display-table-id-width);
}
.display-table :deep(.display-table-question) {
    flex-basis: var(--display-table-questions-width);
    white-space: pre;
}
.display-table :deep(.display-table-topic) {
    flex-basis: var(--display-table-topic-width);
}
.display-table :deep(.display-table-difficulty) {
    flex-basis: var(--display-table-difficulty-width);
}
.display-table :deep(.display-table-source) {
    flex-basis: var(--display-table-source-width);
}
.display-table :deep(.display-table-options) {
    flex-basis: var(--display-table-options-width);
}

.display-table :deep(.display-table-element) {
    flex-basis: var(--display-table-element-width);
}

.display-table :deep(.option-icons) {
    display: flex;
    flex-direction: row;
    gap: 3px;
    align-items: center;
    justify-content: center;
}

.display-table :deep(.up-down-buttons) {
    display: flex;
    flex-direction: column;
    height: 40px;
}

</style>