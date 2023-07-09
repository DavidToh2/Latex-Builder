
const { mongoose } = require('./db-connection')
const { userSchema } = require('./models/user')
const crypto = require('crypto')
const { UserError, DatabaseError, newError } = require('./express-classes/error')

const userDB = mongoose.connection.useDb('users', { useCache: true })

const Users = userDB.model('users', userSchema)

async function newUser(userdata) {

    // Called when user signs up.
    // Returns the user data if signup successful, otherwise throws error.

    const errorString = 'Failed to signup:'

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
            socialData: nU_social
        }

        // User error: user already exists
        if (await findUserIDUsingUsername(nU['username'])) {
            throw new UserError(errorString, `User ${nU['username']} already exists!`)
        }

        console.log(`Inserting new user ${nU['username']}`)
        const newUser = await Users.insertMany([nU])

        // Database error: insert operation failed
        if (!newUser) {
            throw new DatabaseError(errorString, 'newUser() method failed!')
        }

        return newUser
    } catch(err) {
        newError(err, errorString)
    }
}

async function findUserIDUsingUsername(username) {

    // Called when user signs up, to check for uniqueness.
    // Also called when userID is required.

    const errorString = 'db-auth/findUserIDUsingUsername: Failed to find user ID:'

    try {
        const u = {
            username: username
        }

        const userArr = await Users.find(u).lean()

        if (userArr.length > 1) {
            throw new DatabaseError(errorString, `findUser() found multiple users for username ${username}!`)
        } else if (userArr.length == 0) {
            return 0
        } else {
            return userArr[0]['id']
        }

    } catch(err) {
        newError(err, errorString)
    }
}

async function findUsernameUsingID(userID) {

    // Called when user signs up, to check for uniqueness.
    // Also called when userID is required.

    const errorString = 'db-auth/findUsernameUsingID: Failed to find username:'

    try {
        const u = {
            id: userID
        }

        const userArr = await Users.find(u).lean()

        if (userArr.length > 1) {
            throw new DatabaseError(errorString, `findUser() found multiple users for username ${username}!`)
        } else if (userArr.length == 0) {
            return 0
        } else {
            return userArr[0]['username']
        }

    } catch(err) {
        newError(err, errorString)
    }
}

async function findUserInfoUsingID(userID) {

    // Called to fetch user info using user ID.

    const errorString = 'db-auth/findUserInfoUsingID: Failed to find user information:'

    try {
        const u = {
            id: userID
        }

        const userArr = await Users.find(u).lean()

        if (userArr.length > 1) {
            throw new DatabaseError(errorString, `findUser() found multiple users for userID ${username}!`)
        } else if (userArr.length == 0) {
            return 0
        } else {
            const r = {
                username: userArr[0]['username'],
                socialInfo: userArr[0]['socialInfo'],
                accountStatus: userArr[0]['accountStatus'],
                questions: userArr[0]['questions']
            }
            return r
        }

    } catch(err) {
        newError(err, errorString)
    }
}

async function authenticateUser(userdata) {

    // Called when user logs in.

    const errorString = 'Failed to authenticate user:'

    try {
        const password = userdata['password']
        if (!password) {
            throw new UserError(errorString, 'Password empty!')
        }

        const userstring = userdata['username']
        if (!userstring) {
            throw new UserError(errorString, 'Username empty!')
        }
        var u = {}

        if (userstring.match(/@/)) {
            u['email'] = userstring
        } else if (userstring.match(/[\w\-_]+/)) {
            u['username'] = userstring
        } else {
            throw new UserError(errorString, 'Invalid userstring input format!')
        }

        const userArr = await Users.find(u).lean()

        if (userArr.length > 1) {
            throw new DatabaseError(errorString, `authenticateUser() found multiple users for username ${username}!`)
        } else if (userArr.length == 0) {
            throw new UserError(errorString, `Invalid credentials!`)
        }

        const user = userArr[0]
        var userValidated = false

        const hashedPassword = hashPassword(password, user['salt'])
        const expectedPassword = user['hashedPassword']

        if (hashedPassword.length == expectedPassword.length
            && crypto.timingSafeEqual(Buffer.from(hashedPassword), Buffer.from(expectedPassword))) {
            userValidated = true
        }

        console.log(`User ${userstring} validated: ${userValidated}`)
        if (userValidated) {
            return user
        } else {
            throw new UserError(errorString, 'Invalid credentials!')
        }

    } catch(err) {
        newError(err, errorString)
    }
}

async function setUserQuestions(userID, fn, qnID) {
    const errorString = 'Failed to set user\'s personal question array!'
    try {
        if (fn == 'add') {
            const result = await Users.findOneAndUpdate(
                { id: userID }, 
                { $push: { questions: qnID } }
            )
            if (result.length > 0) {
                return true
            } else {
                return false
            }
        } else if (fn == 'remove') {
            const result = await Users.findOneAndUpdate(
                { id: userID }, 
                { $pullAll: { questions: qnID } }
            )
            if (result.length > 0) {
                return true
            } else {
                return false
            }
        }
    } catch(err) {
        newError(err, errorString)
    }
}

function hashPassword(pwd, salt) {
    const errorString = "Password hashing failed:"
    try {
        const hashedPasswordBlob = crypto.pbkdf2Sync(pwd, salt, 100000, 64, 'sha512')
        const hashedPassword = hashedPasswordBlob.toString('hex')
        return hashedPassword
    } catch(err) {
        newError(err, errorString)
    }
}

module.exports = {
    newUser, 
    findUserInfoUsingID, findUsernameUsingID, findUserIDUsingUsername, 
    authenticateUser,

    setUserQuestions
}
