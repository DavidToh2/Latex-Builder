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
    type: 'numeric' | 'alphabetic' | 'roman' | "bullet" | "dash",
    behaviour: 'start' | 'end',
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
    template: "ENUM.",
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
interface worksheetPageDimensions {
    top: string,
    left: string,
    bottom: string,
    right: string
}
interface worksheetPageMargins {
    left: string,
    middle: string,
    right: string,
    alternate: boolean,
    design: string
}
interface worksheetPageNumber {
    display: 'header' | 'footer' | 'none',
    position: 'left' | 'middle' | 'right'
}
export interface worksheetPage {
    dimensions: worksheetPageDimensions,
    header: worksheetPageMargins,
    footer: worksheetPageMargins,
    pageNumber: worksheetPageNumber
}

export interface worksheetConfig {
    latexElements: {
        latexCount: number,
        latexHeadingCount: number,
        latexEnumCount: number
    },

    documentName: string,
    template: string,
    title: worksheetTitle,
    packages: string[],
    setup: string,
    page: worksheetPage,
    userPerms: userPerms
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
    alternate: false,
    design: ''
}
const emptyWorksheetPageNumber : worksheetPageNumber = {
    display: 'none',
    position: 'middle'
}
const emptyWorksheetPage : worksheetPage = {
    dimensions: emptyWorksheetPageDimensions,
    header: emptyWorksheetPageMargins,
    footer: emptyWorksheetPageMargins,
    pageNumber: emptyWorksheetPageNumber
}

const emptyWorksheetConfig : worksheetConfig = {
    latexElements: {
        latexCount: 0,
        latexHeadingCount: 0,
        latexEnumCount: 0
    },

    documentName: 'Document',
    template: 'default',
    title: {
        title: '',
        author: '',
        date: ''
    },
    packages: <string[]> [],
    setup: '',
    page: emptyWorksheetPage,
    userPerms: emptyUserPerms

}

export interface ws {
    elements: worksheetElement[],
    config: worksheetConfig
}

export { 
    latexTypeStrings, defaultLatex, defaultLatexEnum, defaultLatexHeading,
    emptyWorksheetConfig
}