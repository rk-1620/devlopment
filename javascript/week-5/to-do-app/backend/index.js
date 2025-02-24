const express = require("express");
const { createTodo, updateTodo } = require("./types");
const app = express();

const {todo} = require("./db");
app.use(express.json());

// it is good practice to validate the user input it can be done using zod
app.post("/todo", async function(req,res){
    const createPayload = req.body;
    const parsePayload = createTodo.safeParse(createPayload);
    if(!parsePayload.success)
    {
        res.status(411).json({msg: "wrong inputs"});

        return;
    }

    //put the data in db
    await todo.create({
        title: createPayload.title,
        description: createPayload.description,
        completed : false
    })


    res.json({msg : "todo created"});
})

app.get("/todos", async function(req,res){
    const alltodos = await todo.find({});

    res.json({
        alltodos,
    })
})

app.put("/completed", async function(req,res){
    const updatePayload = req.body;
    const parsePayload = updateTodo.safeParse(updatePayload);

    if(!parsePayload.success)
    {
        res.status(411).json({msg:"wrong input"});
        return;
    }

    await todo.updateOne({
        _id:req.body.id
    },{
        completed:true
    })

    res.json({msg:"to do completed"});
})

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});