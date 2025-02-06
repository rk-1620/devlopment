const express = require("express");

const app = express();
// app.get("/health-checkup", function(req,res){
//     const username = req.headers.username;
//     const password = req.headers.password;
//     const kidneyId = req.query.kidneyId;

//     if(username!="rakesh" || password!="pass")
//     {
//         res.status(400).json({"msg": "something wrong"})
//         return;

//     }
//     if(kidneyId!=1 && kidneyId!=2)
//     {
//         res.status(400).json({"msg": "something wring"})
//         return
//     }
//     res.json({
//         msg:"your kidney is fine"
//     })

// });

// app.listen(3000);

function usermiddleware(req, res, next){
    if(req.headers.username!="rakesh" || req.headers.password!="pass")
    {
        res.status(400).json({msg:"something worng"});

    }
    else{
        next();
    }
}
function kidneymiddleware(req,res, next)
{
    if(req.query.kidneyId!=1 && req.query.kidneyId!=2)
    {
        res.status(400).json({msg : "something wrong"});
    }
    else{
        next();
    }
}

app.get("/health-checkup", usermiddleware, kidneymiddleware, function (req,res){
        res.send("your health is fine");
});

app.listen(3000);