export interface ServerError {
    message: string,
    cause: string,
    status: string
}

function formatErrorMessage(e : ServerError) {
    const returnString = 
    `
        <p style="font-size: var(--font-size-lg1)">Error: ${e.status}</p>
        <p>${e.message}</p>
        <p>${e.cause}</p>
    ` as string
    return returnString
}

export { formatErrorMessage } 