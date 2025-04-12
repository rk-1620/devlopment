const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
     // Add this array to store blog references
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog', // Reference to the Blog model
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
