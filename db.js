// TODO: Change this to typescript.

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

mongoose.connect(mongoURI, options);
var db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));



const {topicData} = require("./models/question.js")
const {sourceData} = require("./models/question.js")
const {questionSchema} = require("./models/question.js")

// https://forum.freecodecamp.org/t/cant-export-require-a-module-mongoose-model-typeerror-user-is-not-a-constructor/452317/6
// Exporting the schemas rather than the models works better for some reason.

const Topic = mongoose.model("topics", topicData);
const Source = mongoose.model("sources", sourceData);
const Question = mongoose.model("questions", questionSchema);

function newQuestion(
    nhash, nquestion, ntopicData, ndifficulty, nimages, nsolution, nsolutionImages, nsourceData
) {

    const ntopic = new Topic(
        {
            topic: ntopicData[0],
            subtopic: (ntopicData.length > 1) ? ntopicData[1] : undefined,
            subSubTopic: (ntopicData.length > 2) ? ntopicData[2] : undefined,
        }
    )
    const nsource = new Source( 
        {
            sourceName: (nsourceData != undefined) ? nsourceData[0] : undefined,
            sourceYear: (nsourceData != undefined && nsourceData.length > 1) ? nsourceData[1] : undefined
        }
    )
    const quEx = new Question(
        {
            hash: nhash,
            question: nquestion,
            topicData: ntopic,
            difficulty: ndifficulty,
            images: nimages,
            solution: nsolution,
            solutionImages: nsolutionImages,
            source: (nsource.length != undefined) ? nsource : undefined,
        }
    )
    quEx.save((err) => {
        if (err) {
            console.log("Failed to save!"); 
            console.log(err);
            return false;
        }
        console.log("Saved!");
        return true;
    })
}

function findQuestion(dataDict, outputArr) {   
    var outputFields = outputArr.join(" ");
    question.find(dataDict, outputFields, (err, questions) => {
        if (err) {
            console.log("Failed to find questions!"); 
            console.log(err);
            return null;
        }
        return questions;
    })
}

module.exports = {
    newQuestion, findQuestion
};