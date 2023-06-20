const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSocialInfoSchema = new Schema( {

    email: {
        type: String,
        required: [true, 'Missing email']
    },
    groups: {
        type: [String]
    },
    bio: {
        type: String
    },
    joinDate: {
        type: Date
    }
})

const userSchema = new Schema( {

    // Authentication info

    id: {
        type: String,
        required: [true, 'Missing User ID']
    },
    username: {
        type: String,
        required: [true, 'Missing username']
    },
    hashedPassword: {
        type: String,
        required: [true, 'Missing password']
    },
    salt: {
        type: String,
        required: true
    },

    // Social info

    socialInfo: {
        type: userSocialInfoSchema,
        required: [true, 'Missing social info']
    }
})

module.exports = {
    userSchema: userSchema
}