import mongoose from 'mongoose';

const wordSchema = new mongoose.Schema({

    word: {
        type: String,
        required: true
    },
    meaning: {
        type: String,
        required: true
    },
    exampleSentence1: {
        type: String,
        required: true
    },
    exampleWithGaps1: {
      type: String,
      required: true
    },
    exampleSentence2: {
        type: String,
        required: true
    },
    exampleWithGaps2: {
      type: String,
      required: true
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Word', wordSchema);
