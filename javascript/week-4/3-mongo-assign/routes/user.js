const express = require("express");
const usermiddleware = require("../middleware/user");

const router = express.Router();
  
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
    const username  = req.headers.username;

    // abb course table me update krdo
    await User.updateOne({
        username:username
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
