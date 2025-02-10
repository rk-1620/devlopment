//syntax to import file from another place
const {Admin} = require("../db");
const jwt = require("jsonwebtoken");
const secret = require("../config");
//middleware handling the auth part

function adminMiddleware(req,res, next)
{
    const token = req.headers.authorization;
    const words = token.split(" ");
    const jwtToken  = words[1];

    const decodedValue = jwt.verify(jwtToken,secret.JWT_secret);

    if(decodedValue)
    {
        next();
    }
    else{
        res.status(403).json({message : "invalid user"});
    }
}
module.exports = adminMiddleware;
