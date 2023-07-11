export interface ServerError {
    name: string,
    message: string,
    cause: string,
    status: string
}

export interface UserError {
    name: string,
    message: string,
    cause: string,
    status: string
}

function formatErrorMessage(e : ServerError | UserError) {
    const returnString = 
    `
        <p style="font-size: var(--font-size-lg1)">${e.name}: ${e.status}</p>
        <p>${e.message}</p>
        <p>${e.cause}</p>
    ` as string
    return returnString
}

export { formatErrorMessage } 