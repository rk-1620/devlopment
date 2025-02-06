const express = require("express");
const cors = require("cors");
const app = express()
app.use(cors());


// app.use(express.json());

app.get("/sum", function(req, res)
{
    const a = req.query.a;
    const b= req.query.b;
    // if (isNaN(a) || isNaN(b)) { // Validate if 'a' or 'b' is not a number
    //     return res.status(400).json({ error: "Both 'a' and 'b' must be valid numbers" });
    // }
    const sum = parseInt(a)+parseInt(b);
    res.json({sum});
    // return a+b;
});

app.get("/simpleInterest", function(req,res)
{
    const principle = req.query.principle;
    const rate = req.query.rate;
    const time = req.query.time;

    const SI = (parseFloat(principle)*parseFloat(rate)*parseFloat(time))/100;
    console.log(SI);
    res.json({SI});
} );

app.listen(3000);