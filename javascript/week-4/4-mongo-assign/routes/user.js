const express = require("express");
const usermiddleware = require("../middleware/user");

const router = express.Router();
const jwt = require("jsonwebtoken");

const secret = require("../config");
const { User, Course } = require("../db");
const { route } = require("./admin");

// Route for creating a new admin
router.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    await User.create({
        username: username,
        password: password
    })
    res.json({ "msg": "user created successfully" });
});

// Route for creating a new admin
router.post('/signin', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne(
    {
        username,
        password
    })

    if(user)
    {
        const token = jwt.sign({
            username
        }, secret.JWT_secret);
        res.json({token});
        res.json({ "msg": "user signed in successfully" });
    }
    else{
        res.status(411).json({message:"invalid user"});
    }
});

// Example route for adding courses
router.get('/courses',  async (req, res) => {    
    // getting the all courses that is publically published by admin for this logic is not written
    const allCourses = await Course.find({});

    res.json({courses:allCourses});
});

// Protect '/courses' route with adminMiddleware
// purchase logic in the user
router.post('/courses/:courseId', usermiddleware, async (req, res) => {
    //exctracting the courseID from the body params
    const courseId = req.params.courseId;
    const username  = req.username;
    
    console.log(courseId);
    console.log(username);
    // abb course table me update krdo
    await User.updateOne({
        username
    },{
        "$push":{
            // mongo syntax
            purchasedCourses:courseId
        }
    });

    res.json({message:"purchase complete"});

});

router.get("/purchasedCourses", usermiddleware, async(req,res)=>{
    const user = await User.findOne({
        username:req.headers.username
    });

    const courses = await Course.find({
        _id:{
            "$in":user.purchasedCourses
        }
    })

    res.json({
        courses:courses
    })
});

module.exports = router;
