// import { useEffect, useState } from 'react'
// import './App.css'
// import axios from "axios"

// function App() {
  
//   const [todos, setTodos] = useState([]);

//   useEffect(() => {
//   axios.get("http://127.0.0.1:3000/todos")
//     .then(function(response){
//       // console.log("Todos:", response.data);
//       setTodos(response.data)
//     })
//   },[])
//   return (
//     <>
//       {todos.map((todo,index)=><Todo key={index} title = {todo.title} description={todo.description}/>)}
//     </>
//   )
  
// }

// function Todo({title, description}){
//   return<div>
//     <h1>{title}</h1>
//     <h5>{description}</h5>
//   </div>
// }

// export default App



/*************************************************************************************** */




// import { useEffect, useState } from 'react'
// import './App.css'
// import axios from "axios"

// function App() {  
//   const [select, selected] = useState(1);
//   return (
//     <>

//       <button onClick={function(){selected(1)}}>1</button>
//       <button onClick={function(){selected(2)}}>2</button>
//       <button onClick={function(){selected(3)}}>3</button>
//       <button onClick={function(){selected(4)}}>4</button>
//       <Todo id={select}/>
//     </>
//   )
  
// }

// function Todo({id}){

//   const [todo, setTodo] = useState({})

//   useEffect(()=>{
//     axios.get(`http://127.0.0.1:3000/todos?id=${id}`)
//       .then(response =>{
//         // console.log(response.data)
//         setTodo(response.data)
//       })
//   },[id])
//   return<div>
//     <h1>{todo.title}</h1>
//     <h5>{todo.description}</h5>
//   </div>
// }

// export default App




/********************************************************************************************** */


/*                                            useMemo                                     *-****/


// import { useEffect,useState, useMemo } from "react";


// function App()
// {

//   const [Count,setCount] = useState(0);
//   const [sum, setsum] = useState(0);

//   // this is the not the optimal way to do the total sum beacuse whenever we 
//   // click on counter button the Count variable changes and it triggers the rerender 
//   // due to which the rerender is going through all code from the begining again and that is
//   //  not a good way because if there is no change in input values we donot need render
//   // unnecessarily so we have to skip the operation to do the sum

//   // let count = 0;
//   // for(let i=1; i<=sum; i++)
//   // {
//   //   count = count + i;
//   // }


//   // use of memoization where we stores the values in variable and it updates only
//   // when there is change in input values only

//   let total = useMemo(()=>{
//       let finalcount = 0;
//       for(let i=1; i<=sum; i++)
//       {
//         finalcount = finalcount + i;
//       }
//       return finalcount;
//   }, [sum]) // this is the part where user input changes then only it rerender the for loop logic





//   return <div>
//     <input type="text" placeholder="find sum 1 to n" onChange={function(e){setsum(e.target.value)}}/>
//     <br/>
//     {/* Sum from 1 to {sum} is {count}; */}
//     Sum from 1 to {sum} is {total};
//     <br/>
//     <button onClick={()=>{
//       setCount(Count+1);
//     }}>Count({Count})</button>

//   </div>
// }

// export default App;









/******************************************************************************************** */

/**                                           useCallback                          */

// import { memo, useState, useCallback } from "react";

// function App()
// {

//   const [count, setCount] = useState(0);

//   const inputFunction = useCallback(()=>{
//     console.log("hi from usecallbeack inputfunction");
//   }, [])

//   // function inputFunction()
//   // {
//   //   console.log("hi from usecallbeack inputfunction");
//   // }

//   return<>
//     <ButtonComponent inputFunction={inputFunction} />
//     <button onClick={()=>{setCount(count+1)}}>Click me{count}</button>
//   </>
// }

// // button component
// const ButtonComponent = memo(({inputFunction})=>{
//   console.log("child render");

//   return<>
//   <br/>
//     <button onClick={inputFunction}>
//       button clicked
//     </button>
//   </>
// })

// export default App;


/*********************************************************************************************** */

/**                                           custom hooks                                        */



import { useEffect, useState } from 'react'
import './App.css'
import axios from "axios"

function useTodos()
{
  const [todos, setTodos] = useState({});

  useEffect(() => {
    axios.get("http://127.0.0.1:3000/todos")
      .then((response)=>{
        console.log("Todos:", response.data);
        const todosArray = Object.values(response.data);
        setTodos(todosArray);
      })
  },[])

  
  return todos;
}

function App() {
  
  const todos = useTodos([]);
  // console.log(todos);
  return (
    // <>
    // {/* {todos.map((todo,index)=><Todo key={index} title = {todo.title} description={todo.description}/>)} */}
    // {todos}
    //   {/* {todos.map((todo,index)=><Todo key={index} title = {todo.title} description={todo.description}/>)} */}
    // </>
    <ul>
      {Object.keys(todos).map((key) => (
        <li key={todos[key].id}>
          {todos[key].title} - {todos[key].completed ? "Completed" : "Pending"}
        </li>
      ))}
    </ul>
  )
  
}

function Todo({title, description}){
  return<div>
    <h1>{title}</h1>
    <h5>{description}</h5>
  </div>
}

export default App
