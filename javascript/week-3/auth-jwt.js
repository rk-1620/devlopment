const express = require("express");
const jwt = require("jsonwebtoken");
const jwtPassword = "123456";

const app = express();

const ALL_USERS = [
    {
        username : "harkirat@gmail.com",
        password : "123",
        name : "harkirat",
    },
    {
        username : "rakesh@gmail.com",
        password : "456",
        name : "rakesh",
    },
    {
        username : "rohan@gmail.com",
        password : "789",
        name : "rohan",
    },
];

function userExist(username, password)
{
    let userExist = false;
    for(let i=0; i<ALL_USERS.length; i++)
    {
        if(ALL_USERS[i].username== username && ALL_USERS[i].password==password)
        {
            userExist = true;
        }
        
    }
    return userExist;
}

app.use(express.json());

app.post("/signin", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    if(!userExist(username, password))
    {
        return res.status(403).json({masg: "invalid username"})
    }

    var token = jwt.sign({username : username}, jwtPassword);
    return res.json({
        token,
    });
});

app.get("/users", function(req, res){
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, jwtPassword);
    const username = decoded.username;

    res.json({
        users:ALL_USERS,
    })
});

app.listen(3000);