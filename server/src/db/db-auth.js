const { mongoose } = require('./db-connection')
const { userSchema } = require('./models/user')
const crypto = require('crypto')
const { UserError, DatabaseError, newError } = require('../express-classes/error')
const Email = require('../email')
const { newToken } = require('./db-token')

const userDB = mongoose.connection.useDb('users', { useCache: true })

const Users = userDB.model('users', userSchema)

const SIGNUP_TOKEN_AGE = 30*60*1000
const CHANGE_PASSWORD_TOKEN_AGE = 5*60*1000
const DELETE_USER_TOKEN_AGE = 5*60*1000

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

        const now = new Date()

        const nU_social = {
            email: new_email,
            groups: [],
            bio: 'Default bio',
            joinDate: now
        }

        const nU = {
            id: new_userID,
            username: new_username,
            salt: new_salt,
            hashedPassword: new_hashedpassword,
            socialData: nU_social,
            accountStatus: 'inactive'
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

        // Generate new token 
        const t = await newToken(new_userID, "signup", SIGNUP_TOKEN_AGE)
        if (!t) {
            throw new UserError(errorString, "You have already submitted a signup request! Please check your email where you should have received a confirmation link. If the email is missing, please contact an administrator.")
        }

        // Send welcome email to new user
        Email.sendWelcomeSignupEmail(new_username, new_email, t)

        return 0
    } catch(err) {
        newError(err, errorString)
    }
}

async function modifyUser(userID, userdata) {

    // Only for modifying social bio.

    const errorString = 'Failed to modify social bio!'
    try {
        const name = userdata.username
        const newBio = userdata.socialData.bio
        const u = await Users.findOne({ username: name })
        if (!u) {
            throw new DatabaseError(errorString, 'User not found!')
        }
        if (u.id != userID) {
            throw new UserError(errorString, 'How did you manage to modify another person\'s data???')
        }

        u.socialData.bio = newBio
        await u.save()

        return 0
    } catch(err) {
        newError(err, errorString)
    }
}

async function deleteUser(userID) {
    const errorString = "Failed to submit delete request:"

    try {
        const u = await Users.findOne({ id: userID }).lean()
        if (!u) {
            throw new DatabaseError(errorString, 'User does not exist!')
        }
        
        // Generate new token
        const t = await newToken(u['id'], "deleteAccount", DELETE_USER_TOKEN_AGE)
        if (!t) {
            throw new UserError(errorString, "You've already submitted an account deletion request. Please check your email where you should have received a confirmation link. If the email is missing, please contact an administrator.")
        }

        u.accountStatus = "for-deletion"
        u.save()

        // Send confirmation email to user
        Email.sendDeleteAccountEmail(u['username'], u['socialData']['email'], t)
        return 0
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
            throw new DatabaseError(errorString, `findUsernameUsingID() found multiple users!`)
        } else if (userArr.length == 0) {
            throw new DatabaseError(errorString, `findUsernameUsingID() did not find any users!`)
        } else {
            return userArr[0]['username']
        }

    } catch(err) {
        newError(err, errorString)
    }
}

async function convertUserIDsToUsernames(uIDArray) {

    // Called to display question contributors' usernames

    const errorString = 'db-auth/convertUserIDsToUsernames: Failed to convert user IDs:'
    try {
        for (var i=0; i<uIDArray.length; i++) {
            uIDArray[i] = await findUsernameUsingID(uIDArray[i])
        }
        return true
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

        const userArr = await Users.find(u, 'username socialData questions accountStatus').lean()

        if (userArr.length > 1) {
            throw new DatabaseError(errorString, `findUserInfoUsingID() found multiple users!`)
        } else if (userArr.length == 0) {
            throw new DatabaseError(errorString, `findUserInfoUsingID() did not find any users!`)
        } else {
            const x = userArr[0]
            delete x['id']
            delete x['_id']
            return x
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

        if (user.accountStatus == 'inactive') {
            throw new UserError(errorString, 'You cannot log in until your account is activated!')
        }
        if (user.accountStatus == "for-deletion") {
            throw new UserError(errorString, 'Your account has been slated for deletion. Contact an administrator if you believe this was in error.')
        }

        const hashedPassword = hashPassword(password, user['salt'])
        const expectedPassword = user['hashedPassword']

        if (hashedPassword.length == expectedPassword.length
            && crypto.timingSafeEqual(Buffer.from(hashedPassword), Buffer.from(expectedPassword))) {
            userValidated = true
        }

        console.log(`User ${userstring} validated: ${userValidated}`)
        if (userValidated) {
            const r = {
                id: user.id,
                username: user.username,
                socialData: user.socialData,
                questions: user.questions,
                accountStatus: user.accountStatus
            }
            return r
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
                { $push: { questions: qnID } },
                { new: true }
            )
            if (result) {
                return true
            } else {
                return false
            }
        } else if (fn == 'remove') {
            const result = await Users.findOneAndUpdate(
                { id: userID }, 
                { $pull: { questions: qnID } },
                { new: true } 
            )
            if (result) {
                return true
            } else {
                return false
            }
        }
    } catch(err) {
        newError(err, errorString)
    }
}

async function findGroupUsingName(groupname) {

    const errorString = 'Failed to find group!'

    try {
        return false
    } catch(err) {
        newError(err, errorString)
    }
}

async function changePassword(userID, data) {
    const errorString = "Password updating failed:"
    try {
        const oldPassword = data['oldpassword']
        if (!oldPassword) {
            throw new UserError(errorString, 'Old password empty!')
        }

        uID = { id: userID }
        const u = await Users.findOne(uID).lean()
        if (!u) {
            throw new DatabaseError(errorString, 'User not found!')
        }

        var userValidated = false
        const salt = u['salt']
        const hashedPassword = hashPassword(oldPassword, salt)
        const expectedPassword = u['hashedPassword']

        if (hashedPassword.length == expectedPassword.length
            && crypto.timingSafeEqual(Buffer.from(hashedPassword), Buffer.from(expectedPassword))) {
            userValidated = true
        }

        if (userValidated) {

            const newPassword = data['newpassword']
            if (!newPassword) {
                throw new UserError(errorString, 'New password empty!')
            }

            if (newPassword != data['newpassword-2']) {
                throw new UserError(errorString, 'Your new passwords do not match!')
            }

            if (newPassword == oldPassword) {
                throw new UserError(errorString, 'Your new and old passwords cannot be identical!')
            }

            // Hash the new password and create a token that stores it
            const newHashedPassword = hashPassword(newPassword, salt)
            const t = await newToken(userID, "changePassword", CHANGE_PASSWORD_TOKEN_AGE, [newHashedPassword])
            if (!t) {
                throw new UserError(errorString, 'You already previously requested for a password change. Please check your email where you should have received a confirmation link. If the email is missing, please contact and administrator.')
            }

            // Send a confirmation email to the client
            Email.sendChangePasswordEmail(u['username'], u['socialData']['email'], t)

            return 0

        } else {
            throw new UserError(errorString, 'Invalid old password!')
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
    newUser, modifyUser, deleteUser,

    findUserInfoUsingID, findUsernameUsingID, convertUserIDsToUsernames,
    findUserIDUsingUsername, 
    authenticateUser, setUserQuestions,

    findGroupUsingName,

    changePassword,
}
