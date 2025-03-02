import { useState, useEffect } from "react";

function Todos({ todos }) {
  const [myTodos, setMyTodos] = useState(todos);

  useEffect(() => {
    setMyTodos(todos);
  }, [todos]); // Update state when new todos arrive

  function toggle(id) {
    console.log(id);
    fetch("http://127.0.0.1:3000/completed", {
      method: "PUT",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        const json = await res.json();
        console.log(json);

        // Update UI after marking as completed
        setMyTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo._id === id ? { ...todo, completed: !todo.completed } : todo
          )
        );
      })
      .catch((err) => console.error("Error updating todo:", err));
  }

  return (
    <div>
      {myTodos.map((todo) => (
        <div key={todo._id}> {/* Added key */}
          <h1>{todo.title}</h1>
          <h2>{todo.description}</h2>
          <button onClick={() => toggle(todo._id)}>
            {todo.completed ? "Completed" : "Mark as Completed"}
          </button>
        </div>
      ))}
    </div>
  );
}

export { Todos };
