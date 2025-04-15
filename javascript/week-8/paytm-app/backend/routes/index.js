// const express = require('express');
import express from "express"
// const routers = require('./userRouter');
import routers from './userRouter.js';


const router = express.Router();


router.use("/user", routers);

export default router;
// module.exports = {router};