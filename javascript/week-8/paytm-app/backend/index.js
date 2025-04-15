// const connectdb = require("./db")
import connectdb from "./db.js";
// const express = require("express");
import express from "express";

const app = express();

import cors from "cors";
// const cors = require("cors");
app.use(cors());
// express.json used as body parser
app.use(express.json());

const port = 3000;

connectdb();
import mainrouter from "./routes/index.js"
// const mainrouter = require("./routes/index");
app.use("/api/v1", mainrouter);
app.listen(port,()=>{console.log("listening at port 3000")});