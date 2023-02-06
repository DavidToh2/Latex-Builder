export interface qn {
    id: string
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