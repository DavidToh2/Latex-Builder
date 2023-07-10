const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSocialDataSchema = new Schema( {

    email: {
        type: String,
        required: [true, 'Missing email']
    },
    groups: [String],
    bio: String,
    joinDate: Date
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
    accountStatus: {
        type: String,
        enum: ['admin', 'active', 'limited', 'inactive', 'guest'],
        required: true
    },

    // Social info

    socialData: {
        type: userSocialDataSchema,
        required: [true, 'Missing social data']
    },
    questions: [String]
})

const userPerms = new Schema( {
    owner: {
        type: String,
        required: true
    },
    canModifyUsers: [String],
    canModifyGroups: [String],
    canReadUsers: [String],
    canReadGroups: [String],
    canAccessPublic: {
        type: String,
        required: true,
        enum: ['false', 'read', 'modify']
    }
})

module.exports = {
    userSchema: userSchema,
    userPerms: userPerms
}