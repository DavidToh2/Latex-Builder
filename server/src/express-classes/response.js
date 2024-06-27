class ResponseBody {
    constructor(fn = "undefined", status = 0, body = {}) {
        this.fn = fn
        this.status = status
        this.body = body
    }
}

class ResponseError {
    constructor(fn = "undefined", status = -1, error = {}) {
        this.fn = fn
        this.status = status
        this.error = error
    }
}

module.exports = { ResponseBody, ResponseError }