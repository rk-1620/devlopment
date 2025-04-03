const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    post: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Blog',  // Reference to Blog model
        required: true 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',  // Reference to User model
        required: true 
    },
    text: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Comment', CommentSchema);