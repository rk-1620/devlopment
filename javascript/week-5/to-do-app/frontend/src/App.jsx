
import { CreateTodo } from './components/CreateTodo'
import { Todos } from './components/Todos'
import { useState, useEffect } from 'react'

function App() {
  const [mytodos, setmyTodos] = useState([])

  fetch("http://127.0.0.1:3000/todos")
    .then(async function(res){
      const json = await res.json();
      setmyTodos(json.alltodos)
    })

  return (
    <div>
        <CreateTodo></CreateTodo>
        <Todos todos={mytodos}></Todos>
    </div>
  )
}

export default App
