const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema( {
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
    email: {
        type: String,
        required: [true, 'Missing email']
    },
    groups: {
        type: [String]
    }
})

module.exports = {
    userSchema: userSchema
}