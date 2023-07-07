import type { qn } from "./Types"

export interface placeholder {
    displayID: 'placeholder',
    text: string
}
export interface latexHeading {
    type: 'section' | 'subsection' | 'subsubsection',
    displayID: string,
    text: string
}
export interface latexEnum {
    type: 'numeric' | 'alphabetic' | 'roman',
    displayID: string,
    template: string
}
export interface latex {
    displayID: string,
    text: string
}
export type latexTypes = latex | latexHeading | latexEnum
export type latexTypeNames = 'latex' | 'latexHeading' | 'latexEnum'
const latexTypeStrings = ['latex', 'latexHeading', 'latexEnum']

export interface worksheetElement {
    type: 'placeholder' | 'qn' | latexTypeNames
    body: placeholder | qn | latexTypes
}

export interface worksheetConfig {
    latexElements: {
        latexCount: number,
        latexHeadingCount: number,
        latexEnumCount: number
    },
    title: {
        title: string,
        author: string,
        date: string
    }
    template: string,
    packages: string[],
    setup: string,

    options: string
}

const emptyWorksheetConfig : worksheetConfig = {
    latexElements: {
        latexCount: 0,
        latexHeadingCount: 0,
        latexEnumCount: 0
    },
    title: {
        title: '',
        author: '',
        date: ''
    },
    template: 'default',
    packages: <string[]> [],
    setup: '',

    options: ''
}

export interface ws {
    elements: worksheetElement[],
    config: worksheetConfig
}

export { emptyWorksheetConfig, latexTypeStrings }