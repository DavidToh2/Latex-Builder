var mongoose = require('mongoose')
var async = require('async')

// Connect to local docker mongo if in dev mode, or connect to Atlas deployment if in prod mode
// Note: questiondb here is the name of the docker container

var mongoURI

if (process.env.NODE_ENV == 'development') {
    mongoURI = process.env.MONGO_DEV_URI
} else if (process.env.NODE_ENV == 'production') {
    mongoURI = process.env.MONGO_URI
}

mongoose.connect(mongoURI)
    .then(console.log(`Connection success! Mongo URI is ${mongoURI}`))
    .catch((err) => {console.log(err)})

mongoose.connection
    .on("error", console.error.bind(console, "MongoDB connection error:"))

module.exports = { mongoose }