const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const questionSchema = new Schema( {
    question: {
        type: String,
        required: [true, 'Missing question!']
    },
    category: {
        type: String,
        required: [true, 'Missing category!'],
        enum: ['Mathematics', 'Computer Science']
    },
    topic: {
        type: [String],
        required: [true, 'Missing topic data!']
    },
    subtopic: {
        type: [String]
    },

    difficulty: {
        type: String,
        enum: ['Primary', 'Junior (A)', 'Junior (B)', 'Junior (C)', 'Senior', 'Open', 'National', 'Unknown'],
        required: [true, 'Missing difficulty!']
    },
    images: [String],

    solution: {
        type: String
    },
    solutionImages: [String],
    
    sourceName: {
        type: String,
        uppercase: true
    },
    sourceYear: {
        type: Number,
        min: 1800
    },

    tags: {
        type: [String]
    }
}, 
/* {
    virtuals: {
        qnID: {
            get() {
                if (this.category == 'Mathematics') {
                    return 'M' + this.id
                } else if (this.category == 'Computer Science') {
                    return 'CS' + this.id
                }
            }
        }
    }
} */
)

module.exports = {
    questionSchema: questionSchema
}

