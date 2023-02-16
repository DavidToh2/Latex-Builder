export interface qn {
    displayID: string
    question: string

    category: string[]
    topic: string[]
    subtopic: string[]
    difficulty: string
    sourceName: string
    sourceYear: number

    images: string[]

    solution: string
    solutionImages: string[]

    lastModified: string

    tags: string[]
}

export interface qns {
    qns: qn[]
}