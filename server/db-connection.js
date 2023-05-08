var mongoose = require('mongoose')
var async = require('async')

// Note: questiondb here is the name of the docker container

const mongoURI = "mongodb://questiondb/"
const options = { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
    authSource: 'admin',
    dbName: process.env.MONGO_SESSION_DATABASE
}

mongoose.connect(mongoURI, options)
    .then(console.log("Connection success!"))
    .catch((err) => {console.log(err)})

mongoose.connection
    .on("error", console.error.bind(console, "MongoDB connection error:"))

module.exports = { mongoose }