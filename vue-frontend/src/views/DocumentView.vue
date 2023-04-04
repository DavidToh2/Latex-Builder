<script setup lang="ts">

import { ref, reactive } from 'vue'
import Title from '@/components/PageTitle.vue'
import UserTab from '@/components/Tab/UserTab.vue'
import pdf from 'vue-pdf-embed'

var activeDoc = ref('https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf')

var activeDocument = ref('http://localhost:3000/file/get/document1')
var openDocuments = reactive<string[]>(['Hi'])

</script>

<template>
    <Title title="PDF Viewer" />

    <div id="drive">
        
    </div>

    <UserTab :active-tab="activeDocument" :tab-list="openDocuments" />

    <div id="document-viewer">
        <pdf 
            :source="activeDocument"
        />
    </div>

</template>

<style>

#document-viewer {
    border: 0px solid black;
}

.vue-pdf-embed > div {
    margin-bottom: 8px;
    box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.1);
}

</style>