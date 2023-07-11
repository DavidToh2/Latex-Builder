import type { userPerms } from "./UserTypes"
import { emptyUserPerms } from "./UserTypes"

export interface qnFilters {
    category: string[]
    topic: string[]
    subtopic: string[]
    difficulty: string[]
    sourceName: string[]
    sourceYear: number

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

const emptyFilters = { 
    category: <string[]> [],
    topic: <string[]> [],
    subtopic: <string[]> [],
    difficulty: <string[]> [],
    sourceName: <string[]> [],
    sourceYear: 0,
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
    sourceYear: 0,
    tags: [],

    images: [],
    solution: [],
    solutionImages: [[]],

    lastModified: ''
    
} as qn


export { emptyFilters, emptyQn }