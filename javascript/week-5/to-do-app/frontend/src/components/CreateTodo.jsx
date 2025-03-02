import { useState } from "react";

export function CreateTodo()
{

        const [title, setTitle] = useState("");
        const [description, setDescription] = useState("");


    return <div>   

        <input type="text" placeholder="todo" onChange={function(e){
            const value = e.target.value;
            console.log(value);
            setTitle(e.target.value);
        }} /><br/>
        <input type="text" placeholder="description" onChange={function(e){
            const value = e.target.value;
            setDescription(e.target.value);
        }}/><br/>
        
        <button onClick={()=>{
            fetch("http://127.0.0.1:3000/todo",{
                method : "POST",
                body: JSON.stringify({
                    title:title,
                    description:description
                }),
                headers: {
                    "content-Type" : "application/json"
                }

                
            }).then(async function (res) {
                 const json = await res.json();
                 alert("To do added");
            })


        }}>Add to do</button>
    </div>
}