
import { CreateTodo } from './components/CreateTodo'
import { Todos } from './components/Todos'
import { useState, useEffect } from 'react'

function App() {
  const [alltodos, setTodos] = useState([])

  fetch("http://127.0.0.1:3000/todos")
    .then(async function(res){
      const json = await res.json();
      console.log("hh");
      console.log( alltodos)
      setTodos(json.alltodos);
    })

  return (
    <div>
        <CreateTodo></CreateTodo>
        <Todos todos={alltodos}></Todos>
    </div>
  )
}

export default App
