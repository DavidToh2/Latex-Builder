const { mongoose } = require("./db-connection")
const { tokenSchema } = require("./models/token")
const { UserError, DatabaseError, newError } = require('../express-classes/error')

const tokenDB = mongoose.connection.useDb('tokens', { useCache: true })

const Tokens = tokenDB.model('tokens', tokenSchema)

const TOKEN_AGE = 5*60*1000

async function newToken(userID, purpose) {

    errorString = "Failed to create new token!"
    try {
        const t = await Tokens.findOne({user: userID, purpose: purpose})
        if (t) {
            // Token already exists, no need to create new token
            return false
        }

        const token = {
            token: crypto.randomBytes(32).toString('hex'),
            expiry: (Date.now() + TOKEN_AGE),
            user: userID,
            purpose: purpose
        } 
        const newToken = await Tokens.insertMany([token])
        if (!newToken) {
            throw new DatabaseError(errorString, "Token insertion failed!")
        }
        return true
    } catch(err) {
        newError(err, errorString)
    }
}

async function validateToken(t) {
    errorString = "Failed to validate token!"
    try {
        const tok = await Tokens.findOne({token: t})
        if (!tok) {
            throw new DatabaseError(errorString, "Token does not exist!")
        }
        if (isTokenExpired(tok)) {
            await deleteToken(tok.token)
            return false
        }
        return true
    } catch(err) {
        newError(err, errorString)
    }
}

async function deleteToken(token) {
    errorString = "Failed to delete token!"
    try {
        const t = await Tokens.deleteMany({token: token})
        if (!t) {
            throw new DatabaseError(errorString, "Token does not exist!")
        }
        return 0
    } catch(err) {
        newError(err, errorString)
    }
}

function isTokenExpired(token) {
    return (token.expiry > Date.now())
}

module.exports = {
    newToken, validateToken, deleteToken
}