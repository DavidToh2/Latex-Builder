const async = require('async')
const { mongoose } = require('./db-connection')
const { userSchema } = require('./models/user')
const crypto = require('crypto')

const userDB = mongoose.connection.useDb('users', { useCache: true })

const Users = userDB.model('users', userSchema)

async function newUser(new_username, new_password, new_email) {
    try {
        console.log("Inserting new user...")

        const new_salt = crypto.randomBytes(32)
        const new_userID = crypto.randomBytes(64).toString('hex')
        const new_hashedpassword = hashPassword(new_password, new_salt)

        const nU = {
            id: new_userID,
            username: new_username,
            salt: new_salt,
            hashedPassword: new_hashedpassword,
            email: new_email,
            groups: []
        }

        var newUser = await Users.insertMany([nU])
    } catch(err) {
        authError(err, 'Failed to save new user')
    }
}



function hashPassword(pwd, salt) {
    const hashedPasswordBlob = crypto.pbkdf2Sync(pwd, salt, 100000, 64, 'sha512')
    const hashedPassword = hashedPasswordBlob.toString('hex')
    return hashedPassword
}

function authError(err, errorMsg) {
    throw new Error(`Authentication error: ${errorMsg}`, { cause: err } )
}

module.exports = {
    newUser
}
