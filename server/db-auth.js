const async = require('async')
const { mongoose } = require('./db-connection')
const { userSchema } = require('./models/user')
const crypto = require('crypto')

const userDB = mongoose.connection.useDb('users', { useCache: true })

const Users = userDB.model('users', userSchema)

async function newUser(new_username, new_password, new_email) {

    // Called when user signs up.
    // Returns the user data if signup successful, otherwise throws error.

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

        if (findUserID(nU['username'])) {
            console.log(`User ${nU['username']} already exists!`)
            return 0
        }

        const newUser = await Users.insertMany([nU])

        if (!newUser) {
            throw new Error('newUser() method failed!')
        }

        return newUser
    } catch(err) {
        authError(err, 'Failed to save new user')
    }
}

async function findUserID(username) {

    // Called when user signs up, to check for uniqueness.
    // Also called when userID is required.

    try {
        const u = {
            username: username
        }

        const userArr = await Users.find(u).lean()

        if (userArr.length > 1) {
            throw new Error(`findUser() found multiple users for username ${username}!`)
        } else if (userArr.length == 0) {
            return 0
        } else {
            return userArr[0]['id']
        }

    } catch(err) {
        authError(err, 'Failed to find user')
    }
}

async function authenticateUser(username, password) {

    // Called when user logs in.

    try {
        const u = {
            username: username
        }

        const userArr = await Users.find(u).lean()

        if (userArr.length > 1) {
            throw new Error(`authenticateUser() found multiple users for username ${username}!`)
        }

        const user = userArr[0]
        var userValidated = false

        const hashedPassword = hashPassword(password, user['salt'])
        if (crypto.timingSafeEqual(hashedPassword = user['hashedPassword'])) {
            userValidated = true
        }

        console.log(`User ${username} validated: ${userValidated}`)
        if (userValidated) {
            return user
        } else {
            return 0
        }

    } catch(err) {
        authError(err, 'Failed to authenticate user')
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
    newUser, authenticateUser
}
