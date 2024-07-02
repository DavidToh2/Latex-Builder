<script setup lang="ts">

    import type { latex, latexEnum, latexHeading } from '@/types/WorksheetTypes';
    import { reactive, ref, computed } from 'vue';
    import SelectOptionsGrid from '../Common/SelectOptionsGrid.vue';

    const props = defineProps<{
        content: latexEnum
    }>()
    const latexEnumContent = reactive(props.content)

    const enumTypeSelections = ['1, 2, 3', 'a, b, c', 'i, ii, iii', '&#8226; Bullet', '- Dash', '&#8594; Arrow']
    const enumTypes = ['numeric', 'alphabetic', 'roman', 'bullet', 'dash', 'arrow']
    function updateEnumType(internalName : string) {
        const i = internalName as 'numeric' | 'alphabetic' | 'roman' | 'bullet' | 'dash' | 'arrow'
        latexEnumContent.type = i
        updateLatexEnum()
    }
    const enumBehaviourSelections = ['Start', 'Start at', 'Resume', 'Stop']
    const enumBehaviours = ['start', 'startAt', 'resume', 'stop']
    function updateEnumBehaviour(internalName : string) {
        const i = internalName as 'start' | 'startAt' | 'resume'
        latexEnumContent.behaviour = i
        if (i == 'start') {
            latexEnumStart.value = '1'
        } else if (i == 'resume') {
            latexEnumStart.value = '0'
        }
        updateLatexEnum()
    }

    const latexEnumStart = ref('1')
    const latexEnumStartNumber = ref(1)
    const latexEnumStartValid = ref(true)
    function updateLatexEnumStart() {
        if (/^\d{0,3}$/.test(latexEnumStart.value)) {
            const c = Number(latexEnumStart.value)
            if (c != latexEnumStartNumber.value) {
                latexEnumStartNumber.value = c
            }
            latexEnumStartValid.value = true
            updateLatexEnum()
        } else {
            latexEnumStartValid.value = false
        }
    }

    const latexEnumTemplateValid = computed(() => {
        if (latexEnumContent.template.includes('LABEL')) {
            updateLatexEnum()
            return true
        } else {
            return false
        }
    })

    const emits = defineEmits<{
        (e: 'updateEnum', newEnum: latexEnum): void
    }>()
    function updateLatexEnum() {
        if (latexEnumStartValid.value && latexEnumContent.behaviour == 'startAt') {
            latexEnumContent.options = `start=${latexEnumStartNumber.value-1}`
        }
        emits('updateEnum', latexEnumContent)
    }

</script>
<template>
    <div class="latex-element-title">
        List
    </div>
    <div class="latex-enum-container">
        <div class="latex-enum-settings latex-enum-behaviour">
            <div class="latex-enum-settings-title">
                Behaviour:
            </div>
            <div class="latex-enum-settings-behaviour">
                <SelectOptionsGrid :columns="2"
                    :selections="enumBehaviourSelections" :internal-names="enumBehaviours"
                    :active-selection="latexEnumContent.behaviour"
                    @update="updateEnumBehaviour"/>
            </div>
            <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 10px;"
                v-show="(latexEnumContent.behaviour != 'stop')">
                <div style="display: flex; flex-direction: row; gap: 20px;">
                    <div style="width: min-content;">Starting index:</div>
                    <input class="input-sm latex-enum-settings-startindex" 
                        v-model="latexEnumStart" @focusout="updateLatexEnumStart">
                </div>
                <div class="latex-enum-settings-error" v-if="!latexEnumStartValid">
                    Starting index should be between 0 and 999.
                </div>
            </div>
        </div>
        <div class="latex-enum-settings latex-enum-template"
            v-show="(latexEnumContent.behaviour != 'stop')">
            <div class="latex-enum-settings-title">
                Template:
            </div>
            <input class="latex-text input-sm" id="latex-enum-settings-template"
                v-model="latexEnumContent.template" @focusout="updateLatexEnum">
            <div class="latex-enum-settings-error" v-if="!latexEnumTemplateValid">
                Template must contain the word LABEL inside it.
            </div>
        </div>
        <div class="latex-enum-settings latex-enum-type"
            v-show="(latexEnumContent.behaviour != 'stop')">
            <div class="latex-enum-settings-title">
                Type:
            </div>
            <div class="latex-enum-settings-type">
                <SelectOptionsGrid :columns="3" 
                    :selections="enumTypeSelections" :internal-names="enumTypes"
                    :active-selection="latexEnumContent.type"
                    @update="updateEnumType"/>
            </div>
        </div>
        <!-- <div class="latex-enum-settings latex-enum-options">
            <div class="latex-enum-settings-title">
                Options:
            </div>
            <div>
                <input class="latex-text input-sm" id="latex-enum-settings-options">
            </div>
        </div> -->
    </div>
</template>
<style scoped>

.latex-enum-container {
    width: 100%;
    display: grid;
    column-gap: 30px;
    row-gap: 10px;
    grid: auto / 65% 30%;
}

.latex-enum-settings {
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: center;
}

.latex-enum-behaviour {
    display: grid;
    grid-template-columns: 20% 40% 20%;
}

.latex-enum-settings-title {
    font-size: var(--font-size-sm1);
}

.latex-enum-settings-type {
    width: 100%;
}

.latex-enum-template {
    display: flex; 
    flex-direction: column; 
    align-items: left;
    gap: 7px; 
    width: 100%;
}

.latex-enum-settings-behaviour {
    width: 100%;
}

.latex-enum-settings-startindex {
    width: 60px;
    font-size: var(--font-size);
}

.latex-enum-settings-error {
    color: var(--colour-text-error);
}
</style>