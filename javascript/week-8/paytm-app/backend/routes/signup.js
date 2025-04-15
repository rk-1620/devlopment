

// CommonJS (Traditional Node.js Modules)
// Uses require() to import modules
// Uses module.exports or exports to export
// // Exporting
// const mongoose = require('mongoose');
// module.exports = mongoose.model('User', UserSchema);
// // Importing
// const User = require('./UserModel');

// ES Modules (Modern JavaScript Modules)
// Uses import/export syntax
// Became standard in Node.js (v12+)
// // Exporting
// import mongoose from 'mongoose';
// export default mongoose.model('User', UserSchema);
// // Importing
// import User from './UserModel.js';

// CommonJS: require("./file") (no extension)
// ES Modules: import "./file.js" (must include .js)



import zod from "zod";
// const zod = require("zod");
import jwt from "jsonwebtoken";
// const jwt = require("jsonwebtoken");

import User from '../model/UserModel.js'
// const User = require("../model/UserModel");
import {JWT_secret} from "../config.js"
// const JWT_secret = require("../config");
// const User = require('../model/UserModel');
// const JWT_secret = require("../config");

const signup =  async (req,res)=>{
    // const username = req.body("username");
    // const name = req.body("name");
    // const firstname = req.body("firstname");
    // const lastname = req.body("lastname");

    const body = req.body;
    // const password = req.headers("password");

    const signupschema = zod.object({
        username: zod.string(),
        name: zod.string(),
        firstname: zod.string(),
        lastname: zod.string(),
    });

    // const newuser = await User.safeParse({
    //     username:username,
    //     name:name,
    //     firstname:firstname,
    //     lastname:lastname
    // })
    const {success}  = signupschema.safeParse(body);
    // const newuser = await User.findOne(username);
    if(!success)
    {
        return res.status(411).json({ message: "Invalid inputs" });
    }

    const newuser = await User.findOne({
        username: body.username});

    // if(!newuser)
    if (newuser) {
        return res.status(409).json({ message: "User already exists" });
    }
    const createuser = await User.create(body);
    const token = jwt.sign({
        userId:createuser._id
    }, JWT_secret);

    res.json({
        message:"user created successfully",
        token:token,
    })


}

export default signup;
// module.exports={signup};