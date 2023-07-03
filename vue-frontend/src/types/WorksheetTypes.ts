import type { qn, qns, qnFilters } from "./Types"
import { emptyFilters, emptyQn } from "./Types"

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

export interface worksheetElement {
    type: 'qn' | 'latex' | 'latexHeading' | 'latexEnum',
    body: qn | latex | latexHeading | latexEnum
}

export interface ws {
    elements: worksheetElement[],
    config: string
}