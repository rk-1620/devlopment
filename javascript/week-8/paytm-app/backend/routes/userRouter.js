import express from "express"
// const express = require("express");
// const signup = require("./signup")
import signup from "./signup.js";
const routers = express.Router();

routers.post("/signup", signup);
routers.post("/login", login);
routers.post("/update", authmiddleware, update);

export default routers;
// module.exports = {routers};