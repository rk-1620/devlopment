//syntax to import file from another place
const {Admin} = require("../db");
const jwt = require("jsonwebtoken");
const secret = require("../config");
//middleware handling the auth part

function userMiddleware(req,res, next)
{
    const token = req.headers.authorization;
    const words = token.split(" ");
    const jwtToken  = words[1];

    const decodedValue = jwt.verify(jwtToken, secret.JWT_secret);

    if(decodedValue.username)
    {
        //this is the way through which we can propagate the oject from various routes and middelware
        // by passing in the req
        req.username = decodedValue.username;
        next();
    }
    else{
        res.status(403).json({message : "invalid user"});
    }
}
module.exports = userMiddleware;
