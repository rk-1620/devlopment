const express = require("express");
const adminMiddleware = require("../middleware/admin");

const router = express.Router();
const secret = require("../config");
const jwt = require("jsonwebtoken");
  
const { Admin, Course } = require("../db");

// Route for creating a new admin
router.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    await Admin.create({
        username: username,
        password: password
    })
    res.json({ "msg": "admin created successfully" });
});

// Route for creating a new admin
router.post('/signin',async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const admin = await Admin.findOne(
        {
            username,
            password
        })
    console.log(username);
    console.log(admin);
    if(admin)
    {
        const token = jwt.sign({
            username
        }, secret.JWT_secret);
        res.json({token});
    }
    else{
        res.status(411).json({"msg":"invalid user"});
    }


});

router.post('/courses',adminMiddleware, async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const imageLink = req.body.imageLink;
    const price = req.body.price;

    const newCourse = await Course.create({
        title,
        description,
        imageLink,
        price
    })

    console.log(newCourse); //
    res.json({message:"course created succesfully", courseId:newCourse._id})

});

// Protect '/courses' route with adminMiddleware
router.get('/courses', adminMiddleware, async (req, res) => {
    // Logic to fetch all courses
    const allCourses = await Course.find({}) // finding all if to find by specificdata write in brackets

    res.json({
        courses : allCourses
    })
});

module.exports = router;
