const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema( {
    id: {
        type: Number,
        required: [true, 'Missing User ID']
    },
    username: {
        type: String,
        required: [true, 'Missing username']
    },
    password: {
        type: String,
        required: [true, 'Missing password']
    },
    email: {
        type: String,
        required: [true, 'Missing email']
    }
})