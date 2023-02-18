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