// const mongoose = require("mongoose")
import mongoose from "mongoose";

const User = new mongoose.Schema({
    username:String,
    name:String,
    firstname:String,
    lastname:String,
    password:String,
});

export default mongoose.model('User',User);
// module.exports = new mongoose.model('User',User);