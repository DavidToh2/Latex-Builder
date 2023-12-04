var mongoose = require('mongoose')

// Connect to local docker mongo if in dev mode, or connect to Atlas deployment if in prod mode
// Note: questiondb here is the name of the docker container

var mongoURI

console.log(`Node Environment: ${process.env.NODE_ENV}`)

if (process.env.NODE_ENV.trim() == 'development') {
    console.log("Setting local mongoURI")
    mongoURI = process.env.MONGO_DEV_URI
} else if (process.env.NODE_ENV.trim() == 'production') {
    console.log("Setting production mongoURI")
    mongoURI = process.env.MONGO_URI
}

mongoose.connect(mongoURI)

mongoose.connection
    .on("error", console.error.bind(console, "MongoDB connection error:")) 

module.exports = { mongoose, mongoURI }