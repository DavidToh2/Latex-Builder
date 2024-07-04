<script setup lang="ts">

import { ref, reactive, onMounted } from 'vue'
import Title from '@/components/PageTitle.vue'
import Tab from '@/components/Tab/Tab.vue'
import VuePdfEmbed from 'vue-pdf-embed'
import { useQuestionStore } from '@/stores/questionStore'
import { getPDF } from '@/post/postFile'
import { useUserStore } from '@/stores/userStore'
import type { UserError, ServerError } from '@/types/ErrorTypes'
import { formatErrorMessage } from '@/types/ErrorTypes'

const activeTabID = ref(0)
const documentTab = ['Document', 'Console Output']

const blobURL = ref('')

const pdfDisplayWidth = ref(300)

const QuestionStore = useQuestionStore()
const UserStore = useUserStore()

onMounted(async () => {
    const pdfName = ''
    const x = await displayPDF(pdfName)
    pdfDisplayWidth.value = getPDFDisplayWidth()
})

QuestionStore.$onAction(
    ({name, store, args, after, onError }) => {
        if ( (name == 'setDisplayPDFName') ) {
            after(async (result) => {
                if (result) { 
                    const pdfName = QuestionStore.getDisplayPDFName()
                    await displayPDF(pdfName)
                }
            })
        }
    }
)

async function displayPDF(pdfName : string) {
    if (!UserStore.getAuthStatus()) {
        return false
    }
    try {
        console.log(`Getting pdf ${pdfName}...`)
        const pdfResponse = await getPDF(pdfName)
        if (pdfResponse instanceof Blob) {
            // PDF successfully fetched
            blobURL.value = URL.createObjectURL(pdfResponse)
            console.log(`Displaying PDF at URL ${blobURL.value} with width ${pdfDisplayWidth.value}`)
            return true
        } else {
            console.log(pdfResponse)
            if (pdfResponse.status == -1) {
                // Error
                const error = pdfResponse.error as ServerError
                const errormsg = formatErrorMessage(error)
                UserStore.openPopup(errormsg)
                return false

            } else if (pdfResponse.status == 1) {
                // Failure
                const error = pdfResponse.body as UserError
                const errormsg = error.cause
                UserStore.openPopup(errormsg)
                return false
            }
        }
    } catch(err) {
        console.log(err)
        return false
    }
}

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
        <Tab internal-name="DocumentViewTab" :tab-left=documentTab :active-tab-index=activeTabID :tab-right="[]" />
        <div id="document-viewer">
            <VuePdfEmbed
                :source="blobURL"
                :width="pdfDisplayWidth"
                :scale="3"
            />
        </div>
    </div>

</template>

<style>

#document-viewer {
    border: 1px solid black;
    width: 90%;
}

.vue-pdf-embed > div {
    margin-bottom: 8px;
    box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.1);
}

</style>