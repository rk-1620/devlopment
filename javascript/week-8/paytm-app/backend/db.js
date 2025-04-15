import mongoose from "mongoose";
// const mongoose = require("mongoose");
const url = "mongodb+srv://rkwork1620:VXJ0lrJ9rCaKSBQL@cluster0.i5rc2.mongodb.net/paytm-app";

const  connectdb = async ()=>{
// async function connectdb(){
    await mongoose.connect(url)
};

export default connectdb;
// module.exports = {connectdb};