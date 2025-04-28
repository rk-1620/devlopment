const express = require('express');
// import express from 'express';
const {
    authAdmin,
    getAllBlogs,
    getAllUsers,
    deleteBlog,
    deleteUser,
    adminRegister,
 }  = require("../controllers/adminController.js");
//  import {
//     authAdmin,
//     getAllBlogs,
//     getAllUsers,
//     deleteBlog,
//     deleteUser,
//     adminRegister,
//  } from '../controllers/adminController.js';

//  import protectAdmin from "../middleware/adminMidleware.js";
// import { route } from './dbCheck';
 const protectAdmin = require("../middleware/adminMidleware");

 const router = express.Router();
 
 router.post("/login", authAdmin);
 router.post("/register", adminRegister);
 router.use(protectAdmin); // Protect everything below this line
 router.get("/getUsers", getAllUsers);
 router.get("/getBlogs", getAllBlogs);
 router.delete("/delete/user/:id", deleteUser);
 router.delete("/delete/blog/:id", deleteBlog);

// export default router
module.exports = router;
