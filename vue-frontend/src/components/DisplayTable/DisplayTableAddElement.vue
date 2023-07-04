<script setup lang="ts">

import HoverIcon from '@/components/Common/HoverIcon.vue';
import PopupMenu from '../Common/Popup/PopupMenu.vue';

const emits = defineEmits<{
    (e: 'startDrag', elementType: string): void 
}>()

function startDrag(e : DragEvent) {
    const eid = (e.currentTarget as HTMLDivElement).id as string
    var eType = 'none'
    switch(eid) {
        case 'add-latex':
            eType = 'latex'
            break
        case 'add-latex-heading':
            eType = 'latexHeading'
            break
        case 'add-latex-enum':
            eType = 'latexEnum'
            break
    }
    (e.dataTransfer as DataTransfer).setData('type', eType)
    emits('startDrag', eType)
}

</script>
<template>
    <div id="build-add-elements-container">
        <div id="build-add-elements-left">
            <div class="build-add-description">
                Add LaTeX
            </div>
            <div id="build-add-latex-element-container">
                <HoverIcon id="add-latex" hoverText="Raw latex" :light=true draggable="true" @dragstart="startDrag">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M13,19A1,1 0 0,0 14,20H16V22H13.5C12.95,22 12,21.55 12,21C12,21.55 11.05,22 10.5,22H8V20H10A1,1 0 0,0 11,19V5A1,1 0 0,0 10,4H8V2H10.5C11.05,2 12,2.45 12,3C12,2.45 12.95,2 13.5,2H16V4H14A1,1 0 0,0 13,5V19Z" />
                    </svg>
                </HoverIcon>
                
                <HoverIcon id="add-latex-heading" hoverText="Headings" :light=true draggable="true" @dragstart="startDrag">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -7 24 24" preserveAspectRatio="xMinYMin">
                    <path d="M2 4h4V1a1 1 0 1 1 2 0v8a1 1 0 1 1-2 0V6H2v3a1 1 0 1 1-2 0V1a1 1 0 1 1 2 0v3zm9.52.779H10V3h3.36v7h-1.84V4.779z">
                    </path></svg>
                </HoverIcon>

                <HoverIcon id="add-latex-enum" hoverText="Lists" :light=true draggable="true" @dragstart="startDrag">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M7,13V11H21V13H7M7,19V17H21V19H7M7,7V5H21V7H7M3,8V5H2V4H4V8H3M2,17V16H5V20H2V19H4V18.5H3V17.5H4V17H2M4.25,10A0.75,0.75 0 0,1 5,10.75C5,10.95 4.92,11.14 4.79,11.27L3.12,13H5V14H2V13.08L4,11H2V10H4.25Z" />
                    </svg>
                </HoverIcon>
            </div>
        </div>
        <div id="build-add-elements-center">

        </div>
        <div id="build-add-elements-right">
            <PopupMenu description="Insert Images">
                Placeholder
            </PopupMenu>
        </div>
    </div>
</template>
<style scoped>
#build-add-elements-container {
    width: 100%;

    display: grid;
    grid: auto / 33% 33% 33%;
    padding: 20px;
    gap: 10px;
}

.build-add-description {
    font-size: var(--font-size-lg2)
}

#build-add-elements-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
}
#build-add-latex-element-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    padding: 8px;

    background-color: var(--colour-lighttheme);
}
</style>