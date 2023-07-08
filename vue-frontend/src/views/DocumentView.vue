<script setup lang="ts">

import { ref, reactive, onMounted } from 'vue'
import Title from '@/components/PageTitle.vue'
import Tab from '@/components/Tab/Tab.vue'
import pdf from 'vue-pdf-embed'
import { useQuestionStore } from '@/stores/questionStore'
import { getPDF } from '@/post/postFile'

const activeTabID = ref(0)
const documentTab = ['Document', 'Console Output']

const blobURL = ref('')

const QuestionStore = useQuestionStore()

onMounted(async () => {
    const pdfName = ''
    const x = await displayPDF(pdfName)
    pdfDisplayWidth.value = getPDFDisplayWidth()
})

QuestionStore.$onAction(
    ({name, store, args, after, onError }) => {
        if ( (name == 'setDisplayPDFName') || (name == 'resetDisplayPDFName') ) {
            after(async (result) => {
                if (result) {
                    const pdfName = QuestionStore.getDisplayPDFName()
                    console.log(pdfName)
                    const x = await displayPDF(pdfName)
                }
            })
        }
    }
)

async function displayPDF(pdfName : string) {
    try {
        const pdfBlob = await getPDF(pdfName)
        blobURL.value = URL.createObjectURL(pdfBlob)
        console.log(`Displaying PDF ${pdfName}`)
        return true
    } catch(err) {
        console.log(err)
        return false
    }
}

const pdfDisplayWidth = ref(300)

function getPDFDisplayWidth() {
    const d = document.querySelector('#document-viewer') as HTMLDivElement
    const rect = d.getBoundingClientRect()
    return (rect.right - rect.left)
}

</script>

<template>
    <div class="viewport">
        <Title title="PDF Viewer" />
        <div id="drive">
        
        </div>
        <Tab internal-name="DocumentViewTab" :tab-left=documentTab :active-i-d=activeTabID :tab-right="[]" />
        <div id="document-viewer">
            <pdf
                :source="blobURL"
                :width="pdfDisplayWidth + 'px'"
                :scale="3"
            />
        </div>
    </div>

</template>

<style>

#document-viewer {
    border: 0px solid black;
    width: 90%;
}

.vue-pdf-embed > div {
    margin-bottom: 8px;
    box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.1);
}

</style>