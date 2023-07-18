<script setup lang="ts">

    import { reactive, ref } from 'vue';
    import Input from '../SearchFilters/Input.vue';
    import SelectOptionsGrid from '../Common/SelectOptionsGrid.vue';
    import type { worksheetPage } from '@/types/WorksheetTypes';

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
    }

    function updatePageHeader(s: string, n: string) {
        if (pageMarginDimensions.includes(n)) {
            const n1 = n as "left" | "middle" | "right" | "design"
            wsPage.header[n1] = s
        }
    }

    const pageNumberingDisplaySelections = ['header', 'footer', 'none']
    const pageNumberingDisplays = ['header', 'footer', 'none']
    const pageNumberingPositionSelections = ["left odd, right even", "middle", "right odd, left even"]
    const pageNumberingPositions = ["LORE", "middle", "ROLE"]

</script>
<template>
    <div class="page-settings-container">
        <div class="page-settings-title">
            Page Settings
        </div>
        <div class="page-settings">
            <div class="page-margin">
                <div class="page-settings-name">
                    Page margins:
                </div>
                <Input description="Top" internalName="top" :fontSize="inputFontSize"
                    :activeInput="wsPage.dimensions.top"
                    @update="updatePageMargins"/>
                <Input description="Left" internalName="left" :fontSize="inputFontSize"
                    :activeInput="wsPage.dimensions.left"
                    @update="updatePageMargins"/>
                <Input description="Bottom" internalName="bottom" :fontSize="inputFontSize"
                    :activeInput="wsPage.dimensions.bottom"
                    @update="updatePageMargins"/>
                <Input description="Right" internalName="right" :fontSize="inputFontSize"
                    :activeInput="wsPage.dimensions.right"
                    @update="updatePageMargins"/>
            </div>
            <div class="page-hf">
                <div class="page-settings-name">
                    Page headers:
                </div>
                <Input description="Left" internalName="left" :fontSize="inputFontSize"
                    :activeInput="wsPage.header.left"/>
                <Input description="Middle" internalName="middle" :fontSize="inputFontSize"
                    :activeInput="wsPage.header.middle"/>
                <Input description="Right" internalName="right" :fontSize="inputFontSize"
                    :activeInput="wsPage.header.right"/>

                <div class="page-settings-name">
                    Page footers:
                </div>
                <Input description="Left" internalName="left" :fontSize="inputFontSize"
                    :activeInput="wsPage.footer.left"/>
                <Input description="Middle" internalName="middle" :fontSize="inputFontSize"
                    :activeInput="wsPage.footer.middle"/>
                <Input description="Right" internalName="right" :fontSize="inputFontSize"
                    :activeInput="wsPage.footer.right"/>
            </div>
            <div class="page-no">
                <div class="page-settings-name">
                    Page numbering:
                </div>
                <SelectOptionsGrid :selections="pageNumberingDisplaySelections" :columns="3" :internalNames="pageNumberingDisplays"
                    :activeSelection="wsPage.pageNumber.display" />
                <SelectOptionsGrid :selections="pageNumberingPositionSelections" :columns="1" :internalNames="pageNumberingPositions"
                    :activeSelection="wsPage.pageNumber.position" />

            </div>
        </div>
    </div>
</template>
<style scoped>

.page-settings-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.page-settings-title {
    font-size: var(--font-size-lg2);
}

.page-settings {
    width: 100%;
    display: grid;
    grid: auto / repeat(3, calc(33% - 10px));
    gap: 10px;
}

.page-settings-name {
    font-size: var(--font-size-lg1);
}

.page-margin, .page-hf, .page-no {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

</style>