import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Topic', topicSchema);
