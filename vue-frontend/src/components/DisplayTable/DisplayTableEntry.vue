<script setup lang="ts">

    import { computed, onMounted, onUpdated, ref } from 'vue'
    import type { qn } from '@/types/QuestionTypes'

    import LatexPreview from '../Latex/LatexPreview.vue'
    import { getQnPreviewURL } from '@/aux'

    import { useQuestionStore } from '@/stores/questionStore'
    import { useUserStore } from '@/stores/userStore'
    const QuestionStore = useQuestionStore()
    const UserStore = useUserStore()

    interface Props {
        q : qn,
        internalName: string   
    }
    const props = defineProps<Props>()

    const emits = defineEmits<{
        (e: 'insert', id: string, direction: string): void
        (e: 'delete', id: string): void
        (e: 'up', id: string): void
        (e: 'down', id: string): void
    }>()

    function insertQuestion(id : string, direction : string) {
        emits('insert', id, direction)
    }
    function deleteQuestion(id : string) {
        emits('delete', id)
    }
    function questionUp(id : string) {
        emits('up', id)
    }
    function questionDown(id : string) {
        emits('down', id)
    }

    const isDatabase = computed<boolean>(() => {
        return (props.internalName == 'database-table-qn')
    })
    const isBuild = computed<boolean>(() => {
        return (props.internalName == 'build-table-qn')
    })

    const qnDisplayID = computed<string>(() => {
        return QuestionStore.getQnDisplayID(props.q)
    })

    const blobURL = ref("")
    const showRawLatex = ref(false)
    
    blobURL.value = getQnPreviewURL(props.q.id, props.q.lastModified)
    console.log(props.q)
    // console.log(`Generated blobURL ${blobURL.value}`)

    onUpdated(() => {
        blobURL.value = getQnPreviewURL(props.q.id, props.q.lastModified)
        console.log(props.q)
        // console.log(`Generated blobURL ${blobURL.value}`)
    })


</script>

<template>
    <div class="display-table-entry-row">
        <div class="display-table-entry-row-info">
            <div class="display-table-id display-table-cell" style="text-align: center;">
                {{ qnDisplayID }}
            </div>
            <div class="display-table-topic display-table-cell">
                <p>{{ q.topic.join(', ') }}</p>
                <p>{{ q.subtopic.join(', ') }}</p>
            </div>
            <div class="display-table-difficulty display-table-cell">
                <p v-for="i in q.difficulty">{{ i }}</p>
            </div>
            <div class="display-table-source display-table-cell">
                <div v-for="sn in q.sourceName">
                    <p>{{ sn }}</p>
                </div>
                <p>{{ q.sourceYear }}</p>
            </div>
            <div class="display-table-options display-table-cell">
                <div class="option-icons">
                    <img class="icon-sm" src="@/assets/svg/pencil-edit.svg" v-if="isDatabase" @click="insertQuestion(q.id, 'left')">
                    <img class="icon-sm" src="@/assets/svg/delete-circle.svg" v-if="isBuild" @click="deleteQuestion(q.id)">
                    <img class="icon-sm" src="@/assets/svg/list-edit.svg" v-if="isDatabase" @click="insertQuestion(q.id, 'right')">
                    <img class="icon-sm" src="@/assets/svg/eye.svg" @click="showRawLatex = !showRawLatex">
                    <div class="up-down-buttons" v-if="isBuild">
                        <img class="icon-sm" src="@/assets/svg/angle-up.svg" @click="questionUp(q.id)">
                        <img class="icon-sm" src="@/assets/svg/angle-down.svg" @click="questionDown(q.id)">
                    </div>
                </div>
            </div>
        </div>
        <LatexPreview :source="blobURL"/>
        <div class="display-table-question display-table-cell" v-if="showRawLatex">
            {{ q.question }}
        </div>
    </div>
</template>

<style scoped>



.display-table-entry-row {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.display-table-entry-row-dragged {
    font-weight: bold;
}

.display-table-entry-row-info {
    display: flex;
    flex-direction: row;
}

</style>