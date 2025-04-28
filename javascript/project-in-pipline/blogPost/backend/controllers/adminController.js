// import Admin from "../models/Admin.js";
const Admin = require("../models/Admin");
// import jwt from 'jsonwebtoken'
const jwt = require("jsonwebtoken");
// import User from "../models/User.js"
const User = require("../models/User");
// const User = require("../models/User.js")
// import Blog from "../models/blog.js";
const Blog = require("../models/blog");

const adminRegister = async (req,res)=>{
    const {username, password} = req.body;
    const exists = await Admin.findOne({username});
    if(exists)
    {
        return res.status(411).json({message:"username already exists"});
    }

    // const checkPassword = await exists.matchPassword(password)
    // if(!checkPassword)
    // {
    //     return res.status(411).json({message:"invalid username and password"});
    // }

    const newAdmin = new Admin(req.body);
    await newAdmin.save();
    // const token = jwt.sign({id:newAdmin._id}, process.env.JWT_SECRET, {expiresIn:'7d'})
    res.status(201).json({ message: "User registered successfully" });
}
const authAdmin = async(req, res)=>{
    const {username, password} = req.body;
    const admin = await Admin.findOne({username});

    if(!admin)
    {
        return res.status(401).json({message: "user and password is invalid"});
    }

    const checkPassword = await admin.matchPassword(password);
    if(!checkPassword)
    {
        return res.status(401).json({message: "user and password is invalid"});
    }

    res.json({
        _id:admin.id,
        username: admin.username,
        token: jwt.sign({id:admin._id}, process.env.JWT_SECRET, {expiresIn:'7d'}),
    });
}

const getAllUsers = async (req,res)=>{

    const allUser = await User.find({});
    res.json({allUser});
}

const deleteUser = async (req, res)=>{
    const user = await User.findById(req.params.id); //Gets the ID from the URL parameters (like /users/123 where 123 is the ID)
    if(user)
    {
        await user.deleteOne();
        res.json({message:"user removed"});
    }
    else{
        res.status(404).json({message:"user not found"})
    }

}

const getAllBlogs = async (req,res)=>{
    const blogs = await Blog.find({}).populate('author', 'name email');
    // const blogs = await Blog.find({})
    //         .populate('author', 'name email')  // Now populating 'author' instead of 'user'
    //         .select('-__v');  // Optionally exclude version key
    res.json(blogs);
}

const deleteBlog = async (req, res)=>{
    const blog = await Blog.findById(req.params.id);
    if(blog)
    {
        await blog.deleteOne();
        res.json({ message: 'Blog deleted' });
    } else {
      res.status(404);
      throw new Error('Blog not found');
    }
};

module.exports = {getAllBlogs,getAllUsers,deleteBlog,deleteUser,authAdmin, adminRegister, };








