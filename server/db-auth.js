const async = require('async')
const { mongoose } = require('./db-connection')
const { userSchema } = require('./models/user')
const crypto = require('crypto')

const userDB = mongoose.connection.useDb('users', { useCache: true })

const Users = userDB.model('users', userSchema)

async function newUser(userdata) {

    // Called when user signs up.
    // Returns the user data if signup successful, otherwise throws error.

    try {
        const new_username = userdata['username']
        const new_password = userdata['password']
        const new_email = userdata['email']
        const new_salt = crypto.randomBytes(32).toString('hex')
        const new_userID = crypto.randomBytes(64).toString('hex')
        const new_hashedpassword = hashPassword(new_password, new_salt)

        const nU_social = {
            email: new_email,
            groups: [],
            bio: 'Default bio',
            joinDate: Date.now()
        }

        const nU = {
            id: new_userID,
            username: new_username,
            salt: new_salt,
            hashedPassword: new_hashedpassword,
            socialInfo: nU_social
        }

        if (await findUserID(nU['username'])) {
            console.log(`User ${nU['username']} already exists!`)
            return 0
        }

        console.log(`Inserting new user ${nU['username']}`)
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

async function authenticateUser(userdata) {

    // Called when user logs in.

    try {
        if (!password) {
            return 0
        }

        const userstring = userdata['username']
        var u = {
            password: userdata['password']
        }
        if (userstring.match(/@/)) {
            u['email'] = userstring
        } else if (userstring.match(/[A-Za-z0-9\-\_]/)) {
            u['username'] = userstring
        } else {
            throw new Error('Invalid userstring input format!')
        }

        const userArr = await Users.find(u).lean()

        if (userArr.length > 1) {
            throw new Error(`authenticateUser() found multiple users for username ${username}!`)
        }

        const user = userArr[0]
        var userValidated = false

        const hashedPassword = hashPassword(password, user['salt'])
        const expectedPassword = user['hashedPassword']
        console.log(`hashedPassword: ${hashedPassword}`)
        console.log(`expectedPassword: ${expectedPassword}`)

        if (hashedPassword.length == expectedPassword.length
            && crypto.timingSafeEqual(Buffer.from(hashedPassword), Buffer.from(expectedPassword))) {
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

function isAuthenticated(req, res, next) {

    // Check that user's session is authenticated
    // Check for a session in the sessionStore with the correct session cookie and userID.
    // https://stackoverflow.com/questions/73049959/express-session-middleware-to-check-authentication
    
    console.log('Authenticating session.')
    if (req.session.uID) next()
    else next('route')
    // next('route') tells the router to skip all the remaining route callbacks, i.e. go to the next route.
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
    newUser, findUserID, authenticateUser, isAuthenticated
}
