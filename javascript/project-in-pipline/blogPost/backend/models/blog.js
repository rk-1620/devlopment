const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    // author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
//     comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // Array of comments
//     createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', BlogSchema);
