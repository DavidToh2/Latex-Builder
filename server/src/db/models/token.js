const mongoose = require('mongoose')

const Schema = mongoose.Schema

const tokenSchema = new Schema( {
    token: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        enum: ['signup', 'changePassword', 'deleteAccount'],
        required: true
    },
    expiry: {
        type: Number,
        required: true
    },
    data: {
        type: [String]
    }
})

module.exports = {
    tokenSchema: tokenSchema
}