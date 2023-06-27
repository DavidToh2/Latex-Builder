class ServerError extends Error {
    constructor(message, cause, status = "Server-Error") {
        super(message)
        this.name = this.constructor.name
        this.cause = cause
        this.status = status
    }
}

class UserError extends ServerError {
    constructor(message, cause, status = "User-Error") {
        super(message, cause, status)
    }
}

class DatabaseError extends ServerError {
    constructor(message, cause, status = "Database-Error") {
        super(message, cause, status)
    }
}

function newError(err, errorString) {
    if (err instanceof UserError) {
        throw new UserError(err.message, err.cause, err.status)
    } else if (err instanceof DatabaseError) {
        throw new DatabaseError(err.message, err.cause, err.status)
    } else {
        throw new ServerError(errorString, err)
    }
}

module.exports = { ServerError, UserError, DatabaseError, newError }