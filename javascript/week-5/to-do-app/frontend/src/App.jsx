import { CreateTodo } from './components/CreateTodo'
import { Todos } from './components/Todos'
import { useState, useEffect } from 'react'

function App() {
  const [mytodos, setmyTodos] = useState([])

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch("http://127.0.0.1:3000/todos?" + new Date().getTime()); // Bypass cache
        const json = await res.json();
        console.log(json);
        setmyTodos(json.alltodos);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos(); // Fetch immediately on mount

    intervalRef.current = setInterval(fetchTodos, 5000); // Fetch every 5 sec

    return () => clearInterval(intervalRef.current); // Cleanup on unmount

  }, []); // Runs only once when component mounts
  
  return (
    <div>
      <CreateTodo />
      <Todos todos={mytodos} />
    </div>
  )
}

export default App;
