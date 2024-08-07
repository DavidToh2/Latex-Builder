import type { userPerms } from "./UserTypes"
import { emptyUserPerms } from "./UserTypes"

export interface qnFilters {
    category: string[]
    topic: string[]
    subtopic: string[]
    difficulty: string[]
    sourceName: string[]
    sourceYear: string

    tags: string[]
}
export type qnFilterNames = 'category' | 'topic' | 'subtopic' | 'difficulty' | 'sourceName' | 'tags'

export interface qn extends qnFilters {
    id: string
    question: string

    images: string[]

    solution: string[]
    solutionImages: string[][]

    lastModified: string
}

export interface qns {
    qns: qn[]
    // Required for typescript to correctly parse reactive qn[] arrays
}

export interface pageData {
    skip: number,
    display: number
}

const emptyFilters = { 
    category: <string[]> [],
    topic: <string[]> [],
    subtopic: <string[]> [],
    difficulty: <string[]> [],
    sourceName: <string[]> [],
    sourceYear: '',
    tags: <string[]> []
} as qnFilters

const emptyQn = {
    id: '0',
    category: [],
    question: '',

    topic: [],
    subtopic: [],
    difficulty: [],
    sourceName: [],
    sourceYear: '',
    tags: [],

    images: [],
    solution: [''],
    solutionImages: [[]],

    lastModified: ''
} as qn

const emptyPageData = {
    skip: 0,
    display: 10
} as pageData


export { emptyFilters, emptyQn, emptyPageData }