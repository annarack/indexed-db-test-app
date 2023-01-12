import "./App.css";
import { useEffect, useState } from "react";
import { del, get, set } from "idb-keyval";
import { v4 as uuidv4 } from "uuid";
import ImageUpload from "./ImageUpload";

function ToDo({ todo, deleteTodo }) {
  return (
    <li>
      <div className="Todo">
        {todo.text}
        <button onClick={() => deleteTodo(todo.id)}>delete</button>
      </div>
    </li>
  );
}

function App() {
  const [todos, setTodos] = useState();
  const [currentToDo, setCurrentToDo] = useState("");

  useEffect(() => {
    get("todos").then((val) => {
      console.log(val);
      if (val) setTodos(val);
      else setTodos([])
    });
  }, []);

  useEffect(() => {
    if (todos) {
      console.log(todos);
      set("todos", todos)
        .then(() => console.log("Todos are saved"))
        .catch((err) => console.log("Saving todos failed!", err));
    }
  }, [todos]);

  // add a new todo to the todos state with an unique id
  const addTodo = (e) => {
    // preventDefault() prevents a whole page rerender
    e.preventDefault();
    const newTodo = {
      id: uuidv4(),
      text: currentToDo,
    };
    setTodos([...todos, newTodo]);
    //reset the currentToDo to empty the textfield
    setCurrentToDo("");
  };

  const deleteTodo = (idToDelete) => {
    const filteredTodos = todos.filter((todo) => todo.id !== idToDelete);
    setTodos(filteredTodos);
  };

  const clearAllTodos = () => {
    setTodos();
    del("todos");
  };

  // in comparison to normal html input fields, you manually have to keep the state of it
  // if the input inside the textfield changes save it into the temporary currentToDo state
  return (
    <div className="App">
      <h2>My Todos</h2>
      <ul>
        {todos &&
          todos.map((todo) => (
            <ToDo todo={todo} key={todo.id} deleteTodo={deleteTodo} />
          ))}
      </ul>
      <form className="NewTodo" onSubmit={addTodo}>
        <input
          type="text"
          placeholder="Enter your todo"
          value={currentToDo}
          onChange={(e) => setCurrentToDo(e.target.value)}
        />
        <button type="submit">Add todo</button>
      </form>
      <button onClick={clearAllTodos}>Clear all todos</button>
      <hr />
      <ImageUpload imgID="img1" />
    </div>
  );
}

export default App;
