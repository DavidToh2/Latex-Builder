class ResponseBody {
    constructor(fn = "undefined", status = "Success", body = {}) {
        this.fn = fn
        this.status = status
        this.body = body
    }
}

class ResponseError {
    constructor(fn = "undefined", status = "Error", error = {}) {
        this.fn = fn
        this.status = status
        this.error = error
    }
}

module.exports = { ResponseBody, ResponseError }