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
    displayID: string
    question: string

    images: string[]

    solution: string
    solutionImages: string[]

    lastModified: string
}

export interface qns {
    qns: qn[]
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
    displayID: '0',
    category: [],
    question: '',

    topic: [],
    subtopic: [],
    difficulty: [],
    sourceName: [],
    sourceYear: 0,

    images: [],
    solution: '',
    solutionImages: [],
    lastModified: '',
    tags: []
} as qn

function syncFiltersWithQn(filters : qnFilters, q : qn) {
    const a = ['category', 'topic', 'subtopic', 'difficulty', 'sourceName', 'tags']
    for (var key of a) {
        const k = key as qnFilterNames
        filters[k] = q[k]
    }
    filters['sourceYear'] = q['sourceYear']
}
function syncQnWithFilters(q : qn, filters : qnFilters) {
    const a = ['category', 'topic', 'subtopic', 'difficulty', 'sourceName', 'tags']
    for (var key of a) {
        const k = key as qnFilterNames
        q[k] = filters[k]
    }
    q['sourceYear'] = filters['sourceYear']
}


export { emptyFilters, emptyQn, syncFiltersWithQn, syncQnWithFilters }