<script setup lang="ts">

    import { reactive, ref } from 'vue';
    import Input from '@/components/SearchFilters/Input.vue'
    import SelectOptionsGrid from '@/components/Common/SelectOptionsGrid.vue'
    import type { worksheetConfig, worksheetPage } from '@/types/WorksheetTypes'

    const inputFontSize = ref(16)

    const props = defineProps<{
        pageSettings: worksheetPage
    }>()
    const wsPage = reactive({...props.pageSettings})

    const pageMarginDimensions = ['top', 'left', 'bottom', 'right']

    function updatePageMargins(s: string, n: string) {
        if (pageMarginDimensions.includes(n)) {
            const n1 = n as "top" | "left" | "bottom" | "right"
            wsPage.dimensions[n1] = s
        }
        configUpdate()
    }

    const pageHFKeys = ['left', 'middle', 'right', 'thickness']

    function updatePageHeader(s: string, n: string) {
        if (pageHFKeys.includes(n)) {
            const n1 = n as "left" | "middle" | "right" | "thickness"
            wsPage.header[n1] = s
        }
        configUpdate()
    }

    function updatePageFooter(s: string, n: string) {
        if (pageHFKeys.includes(n)) {
            const n1 = n as "left" | "middle" | "right" | "thickness"
            wsPage.footer[n1] = s
        }
        configUpdate()
    }

    function updatePageNo(internalName : string) {
        switch(internalName){
            case "header":
            case "footer":
            case "none":
                wsPage.pageNumber.display = internalName
            break

            case "LORE":
            case "ROLE":
            case "middle":
                wsPage.pageNumber.position = internalName
            break
        }
        configUpdate()
    }

    const emits = defineEmits<{
        (e: 'update', newPage: worksheetPage): void
    }>()

    function configUpdate() {
        emits('update', wsPage)
    }

    const pageNumberingDisplaySelections = ['header', 'footer', 'none']
    const pageNumberingDisplays = ['header', 'footer', 'none']
    const pageNumberingPositionSelections = ["left odd, right even", "middle", "right odd, left even"]
    const pageNumberingPositions = ["LORE", "middle", "ROLE"]

</script>
<template>
    <div class="page-settings-container">
        <div class="subheader">
            Page Settings
        </div>
        <div class="page-settings">
            <div class="page-settings-column-1">
                <div class="page-margin">
                    <div class="subsubheader">
                        Page margins:
                    </div>
                    <div class="page-margin-inputs">
                        <Input description="Top" internalName="top" :fontSize="inputFontSize" :text-dir="'row'"
                            :activeInput="wsPage.dimensions.top"
                            @update="updatePageMargins"/>
                        <Input description="Left" internalName="left" :fontSize="inputFontSize" :text-dir="'row'"
                            :activeInput="wsPage.dimensions.left"
                            @update="updatePageMargins"/>
                        <Input description="Bottom" internalName="bottom" :fontSize="inputFontSize" :text-dir="'row'"
                            :activeInput="wsPage.dimensions.bottom"
                            @update="updatePageMargins"/>
                        <Input description="Right" internalName="right" :fontSize="inputFontSize" :text-dir="'row'"
                            :activeInput="wsPage.dimensions.right"
                            @update="updatePageMargins"/>
                    </div>
                    <div class="page-margin-text">
                        Margin values are interpreted in milimetres (mm). Leave blank to use default setting.
                    </div>
                </div>
                <div class="page-no">
                    <div class="subsubheader">
                        Page numbering:
                    </div>
                    <SelectOptionsGrid :selections="pageNumberingDisplaySelections" :columns="3" :internalNames="pageNumberingDisplays"
                        :activeSelection="wsPage.pageNumber.display"
                        @update="updatePageNo"/>
                    <SelectOptionsGrid :selections="pageNumberingPositionSelections" :columns="1" :internalNames="pageNumberingPositions"
                        :activeSelection="wsPage.pageNumber.position"
                        @update="updatePageNo"/>
                </div>
            </div>
            <div class="page-header">
                <div class="subsubheader">
                    Page headers:
                </div>
                <Input description="Left" internalName="left" :fontSize="inputFontSize"
                    :activeInput="wsPage.header.left"
                    @update="updatePageHeader"/>
                <Input description="Middle" internalName="middle" :fontSize="inputFontSize"
                    :activeInput="wsPage.header.middle"
                    @update="updatePageHeader"/>
                <Input description="Right" internalName="right" :fontSize="inputFontSize"
                    :activeInput="wsPage.header.right"
                    @update="updatePageHeader"/>
                <Input description="Thickness" internalName="thickness" :fontSize="inputFontSize" :text-dir="'row'"
                    :activeInput="wsPage.header.thickness"
                    @update="updatePageHeader"/>
            </div>
            <div class="page-footer">
                <div class="subsubheader">
                    Page footers:
                </div>
                <Input description="Left" internalName="left" :fontSize="inputFontSize"
                    :activeInput="wsPage.footer.left"
                    @update="updatePageFooter"/>
                <Input description="Middle" internalName="middle" :fontSize="inputFontSize"
                    :activeInput="wsPage.footer.middle"
                    @update="updatePageFooter"/>
                <Input description="Right" internalName="right" :fontSize="inputFontSize"
                    :activeInput="wsPage.footer.right"
                    @update="updatePageFooter"/>
                <Input description="Thickness" internalName="thickness" :fontSize="inputFontSize" :text-dir="'row'"
                    :activeInput="wsPage.footer.thickness"
                    @update="updatePageFooter"/>
            </div>
        </div>
    </div>
</template>
<style scoped>

.page-settings-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 10px 0px;
    border-top: 1px solid var(--colour-border);
}

.page-settings {
    width: 100%;
    display: grid;
    grid: auto / repeat(3, calc(33% - 10px));
    gap: 10px;
}

.page-settings-column-1 {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.page-margin, .page-header, .page-footer, .page-no {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.page-margin-inputs {
    display: grid;
    grid: auto / 50% 50%;
}

.page-margin-text {
    font-size: var(--font-size-sm1);
}

</style>