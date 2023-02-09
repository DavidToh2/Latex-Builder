

var mongoose = require('mongoose')
var async = require('async')

const mongoURI = "mongodb://questiondb/questions"
const options = { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
    authSource: 'admin'
};

mongoose.connect(mongoURI, options)
.then(() => console.log("Connection success!"))
.catch((error) => console.log(error));

var db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"))

const {questionSchema} = require("./models/question.js")

// https://forum.freecodecamp.org/t/cant-export-require-a-module-mongoose-model-typeerror-user-is-not-a-constructor/452317/6
// Exporting the schemas rather than the models works better for some reason.

const Question = mongoose.model("questions", questionSchema);

function newQuestion(nQ) {

    console.log("Setting new question...")
    Question.insertMany([nQ], function(err) {
        if (err) {
            console.log("Failed to save!")
            console.log(err)
            return err.message
        }
        console.log("Done!")
        return "Saved!"
    })
}

// Question.find({}) returns all questions.

function findQuestions(dataDict) {   
    return Question.find(dataDict, (err, questions) => {
        if (err) {
            console.log("Failed to find questions!"); 
            console.log(err);
            return err;
        }
        return questions;
    }).lean()
}

// Exact ID and not questionID for now
function findQuestionByID(id) {   
    var outputFields = outputArr.join(" ");
    Question.findById(id, outputFields, (err, question) => {
        if (err) {
            console.log(`Failed to find question with ID ${id}!`);
            console.log(err);
            return err;
        }
        return question;
    })
}

function deleteQuestionByID(id) {
    Question.findByIdAndDelete(id, (err) => {
        if (err) {
            console.log(`Failed to delete question with ID ${id}!`);
            console.log(err);
            return false;
        }
        return true;
    })
}

function saveQuestion(
    id,
    dataDict
) {
    let q = findQuestionByID(id)
    Object.keys(dataDict).forEach(function(key) {
        q.key = dataDict[key]
    })

    q.save((err) => {
        if (err) {
            console.log("Failed to save!")
            console.log(err)
            return err.message
        }
        return "Saved!"
    })
}

module.exports = {
    newQuestion, findQuestions, findQuestionByID, deleteQuestionByID, saveQuestion
};