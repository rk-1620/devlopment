//syntax to import file from another place
const {Admin} = require("../db");

//middleware handling the auth part

function adminMiddleware(req,res, next)
{
    const username = req.headers.username;
    const password = req.headers.password; 

    // finding the username and password in the databses
    Admin.findOne({
        //these username and password is passed t findone
        username:username,
        password:password
    })//it returns the true or false 
        .then(function(value){
            if(value)
            {
                next();
            }
            else{
                res.status(403).json({msg:"admin not exist"})
            }
        })
}
module.exports = adminMiddleware;
