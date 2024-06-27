const { mongoose } = require("./db-connection")
const { tokenSchema } = require("./models/token")
const { userSchema } = require('./models/user')
const { UserError, DatabaseError, newError } = require('../express-classes/error')
const crypto = require('crypto')

const tokenDB = mongoose.connection.useDb('tokens', { useCache: true })
const userDB = mongoose.connection.useDb('users', { useCache: true })
const Tokens = tokenDB.model('tokens', tokenSchema)
const Users = userDB.model('users', userSchema)

async function newToken(userID, purpose, age, data) {

    errorString = "Failed to create new token!"
    try {
        const t = await Tokens.findOne({user: userID, purpose: purpose})
        if (t) {
            // Token already exists, no need to create new token
            return false
        }

        const token = {
            token: crypto.randomBytes(32).toString('hex'),
            expiry: (Date.now() + age),
            user: userID,
            purpose: purpose,
            data: data
        } 
        const newToken = await Tokens.insertMany([token])
        if (!newToken) {
            throw new DatabaseError(errorString, "Token insertion failed!")
        }
        return token.token
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
            tok.delete()
            return formatTokenResponse('tokenExpired')
        }
        if (!tok['purpose']) {
            throw new DatabaseError(errorString, "Token does not have a designated purpose!")
        }

        var res
        const uID = tok['user']
        switch(tok['purpose']) {
            case 'signup':
                // Finish signup
                res = await newUserSignupValidation(uID)
                tok.delete()
            break
            case 'changePassword':
                // Finish changing password
                res = await changePasswordValidation(uID, tok['data'][0])
                tok.delete()
            break
            case 'deleteAccount':
                // Finish deleting account
                res = await deleteUserValidation(uID)
                tok.delete()
            break
            default:
                throw new DatabaseError(errorString, `Failed to validate token with invalid purpose ${tok['purpose']}!`)
            break
        }
        
        if (res) {
            return formatTokenResponse('error')
        }
        return formatTokenResponse(tok['purpose'])

    } catch(err) {
        newError(err, errorString)
    }
}

async function newUserSignupValidation(userID) {

    const errorString = 'Failed to validate signup!'
    try {
        const u = await Users.findOne({ id: userID })
        if (!u) {
            throw new DatabaseError(errorString, 'User not found!')
        }
        if (u.accountStatus != "inactive") {
            throw new DatabaseError(errorString, 'User already validated!')
        }
        _modifyAccountStatus(userID, "limited")
        return 0
    } catch(err) {
        newError(err, errorString)
    }

}

async function deleteUserValidation(userID) {
    const errorString = "Failed to delete user!"

    try {
        const d = await Users.deleteOne({ id: userID })
        if (d.deletedCount != 1) {
            throw new DatabaseError(errorString, 'Deletion exception: number of removed users is not 1.')
        }
        return 0
    } catch(err) {
        newError(err, errorString)
    }
}

async function changePasswordValidation(userID, newHashedPassword) {

    const errorString = "Failde to validate password change!"
    try {
        const uID = { id: userID }
        await Users.findOneAndUpdate(uID, {hashedPassword: newHashedPassword})
        return 0
    } catch(err) {
        newError(err, errorString)
    }
}

async function _modifyAccountStatus(userID, targetStatus) {

    // Only for modifying account status.
    const errorString = '_modifyAccountStatus failed'
    try {
        const u = await Users.findOne({ id: userID })
        if (!u) {
            throw new DatabaseError(errorString, 'User does not exist')
        }
        u.accountStatus = targetStatus
        await u.save()

        return 0
    } catch(err) {
        newError(err, errorString)
    }
}

function formatTokenResponse(purpose) {
    switch(purpose) {
        case 'signup':
            return "Signup confirmed! You may now login to your account."
            break
        case 'changePassword':
            return "Password change confirmed! You may now re-login to your account using the new password you set."
            break
        case 'deleteAccount':
            return "Account deleted!"
            break
        case 'tokenExpired':
            return "Your request has expired and the request was unsuccessful. What a scrub"
            break
        case 'error':
            return "Your request failed for some reason. Please contact an administrator."
            break
    }
}

function isTokenExpired(token) {
    return (token.expiry < Date.now())
}

module.exports = {
    newToken, validateToken
}