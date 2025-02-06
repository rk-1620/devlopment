const express  =  require("express");
const mongoose = require("mongoose");

const app = express();
// username rkwork1620
//password VXJ0lrJ9rCaKSBQL

// cluster link = mongodb+srv://rkwork1620:VXJ0lrJ9rCaKSBQL@cluster0.i5rc2.mongodb.net/
app.use(express.json());
mongoose.connect("mongodb+srv://rkwork1620:VXJ0lrJ9rCaKSBQL@cluster0.i5rc2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const  User = mongoose.model('Users', {name:String, email:String, password : String });

app.post("/signup", async function(req,res){

    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;

    const userexist = await User.findOne({email:username});
    if(userexist)
    {
        res.status(403).json({msg:"user already exist"});
    }

    const user = new User({
        name:name,
        email:username,
        password:password
    });

    user.save();

    res.json({"msg":"user created succesfully"});
});

app.listen(3000);