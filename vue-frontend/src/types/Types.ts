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
    const qn = {...q}
    for (var key of a) {
        const k = key as qnFilterNames
        filters[k] = qn[k]
    }
    filters['sourceYear'] = qn['sourceYear']
}
function syncQnWithFilters(q : qn, filters : qnFilters) {
    const a = ['category', 'topic', 'subtopic', 'difficulty', 'sourceName', 'tags']
    const f = {...filters}
    for (var key of a) {
        const k = key as qnFilterNames
        q[k] = f[k]
    }
    q['sourceYear'] = f['sourceYear']
}


export interface userSocialData {
    email: string,
    groups: string[],
    bio: string,
    joinDate: string
}

export interface userData {
    username: string
    socialData: userSocialData
}

const emptyUserSocialData = {
    email: '',
    groups: <string[]>[],
    bio: '',
    joinDate: ''
}

const emptyUserData = {
    username: '',
    socialData: emptyUserSocialData
} as userData


export { emptyFilters, emptyQn, syncFiltersWithQn, syncQnWithFilters, emptyUserData }