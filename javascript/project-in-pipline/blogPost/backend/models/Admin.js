// import mongoose from 'mongoose';
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")
// import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
    username:{type:String, required : true, unique:true},
    password:{type: String, required: true},
    createdAt: { type: Date, default: Date.now}

}, {timestamps:true});

// hasing the password
adminSchema.pre('save', async function (next) {
    
    if(!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

adminSchema.methods.matchPassword = async function (enteredpassword) {
    return bcrypt.compare(enteredpassword, this.password);    
}

const Admin = mongoose.model('Admin', adminSchema);

// export default Admin;
module.exports = Admin;

