import type { qn } from "./QuestionTypes"
import type { userPerms } from "./UserTypes"
import { emptyUserPerms } from "./UserTypes"

export interface placeholder {
    id: 'placeholder',
    text: string
}
export interface latex {
    id: string,
    text: string
}
export interface latexEnum {
    id: string,
    type: 'numeric' | 'alphabetic' | 'roman' | 'bullet' | 'dash' | 'arrow',
    behaviour: 'start' | 'startAt' | 'resume' | 'stop',
    template: string,
    options: string
}
export interface latexHeading {
    id: string,
    type: 'section' | 'subsection' | 'subsubsection',
    text: string
}
export type latexTypes = latex | latexHeading | latexEnum
export type latexTypeNames = 'latex' | 'latexHeading' | 'latexEnum'
const latexTypeStrings = ['latex', 'latexHeading', 'latexEnum']

const defaultLatex : latex = {
    id: "latex",
    text: ""
}
const defaultLatexEnum : latexEnum = {
    id: "latexEnum",
    type: "numeric",
    behaviour: "start",
    template: "",
    options: ""
}
const defaultLatexHeading : latexHeading = {
    id: "latexHeading",
    type: "section",
    text: ""
}

export interface worksheetElement {
    type: 'placeholder' | 'qn' | latexTypeNames
    body: placeholder | qn | latexTypes
}

export interface worksheetTitle {
    title: string,
    author: string,
    date: string
}
export interface worksheetPageDimensions {
    top: string,
    left: string,
    bottom: string,
    right: string
}
export interface worksheetPageMargins {
    left: string,
    middle: string,
    right: string,
    thickness: string
}
export interface worksheetPageNumber {
    display: 'header' | 'footer' | 'none',
    position: "LORE" | "middle" | "ROLE"
}
export interface worksheetPage {
    dimensions: worksheetPageDimensions,
    header: worksheetPageMargins,
    footer: worksheetPageMargins,
    pageNumber: worksheetPageNumber
}
export interface worksheetText {
    paragraphSpacing: string,
    paragraphIndent: string
}

export interface worksheetConfig {
    latexElements: {
        latexCount: number,
        latexHeadingCount: number,
        latexEnumCount: number
    },

    template: string,
    title: worksheetTitle,
    packages: string[],
    setup: string,
    page: worksheetPage,
    text: worksheetText,
    preamble: string
}

const emptyWorksheetPageDimensions : worksheetPageDimensions = {
    top: '',
    left: '',
    bottom: '',
    right: ''
}
const emptyWorksheetPageMargins : worksheetPageMargins = {
    left: '',
    middle: '',
    right: '',
    thickness: '0pt'
}
const emptyWorksheetPageNumber : worksheetPageNumber = {
    display: 'none',
    position: 'middle'
}
const emptyWorksheetPage : worksheetPage = {
    dimensions: emptyWorksheetPageDimensions,
    header: {...emptyWorksheetPageMargins},
    footer: {...emptyWorksheetPageMargins},
    pageNumber: emptyWorksheetPageNumber
}
const emptyWorksheetText : worksheetText = {
    paragraphIndent: '',
    paragraphSpacing: ''
}

const emptyWorksheetConfig : worksheetConfig = {
    latexElements: {
        latexCount: 0,
        latexHeadingCount: 0,
        latexEnumCount: 0
    }, 

    template: 'default',
    title: {
        title: '',
        author: '',
        date: ''
    },
    packages: <string[]> [],
    setup: '',
    page: emptyWorksheetPage,
    text: emptyWorksheetText,
    preamble: ''
}

export interface ws {
    elements: worksheetElement[],
    config: worksheetConfig
}

export { 
    latexTypeStrings, defaultLatex, defaultLatexEnum, defaultLatexHeading,
    emptyWorksheetConfig
}