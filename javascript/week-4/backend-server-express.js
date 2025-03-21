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

app.get("/todos", function(req, res) {
    // const id = req.query.id;
    const todos = [
        { title: "go to gym", description: "go gym at 4 pm" },
        { title: "go to sleep", description: "go sleep at 4 pm" },
        { title: "go to bath", description: "go bath at 4 pm" },
        { title: "go to play", description: "go play at 4 pm" },
        { title: "go to coding", description: "go coding at 4 pm" }
    ];

    // // Generate a random length (up to the length of the todos array)
    const randomLength = Math.floor(Math.random() * todos.length) + 1; // +1 to ensure at least one item

    // Shuffle the array and select a random subset
    const shuffledTodos = todos.sort(() => 0.5 - Math.random()); // Shuffle the array
    const randomTodos = shuffledTodos.slice(0, randomLength); // Select the first `randomLength` items
    
    // Send the random todos as a JSON response
    res.json(randomTodos);
    // res.json(todos[id-1]);
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