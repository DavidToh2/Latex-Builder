const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSocialDataSchema = new Schema( {

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

    socialData: {
        type: userSocialDataSchema,
        required: [true, 'Missing social data']
    }
})

module.exports = {
    userSchema: userSchema
}