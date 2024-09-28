import React from "react";
import { useState } from "react";

function Todolist() {
  const [todoList, setTodoList] = useState([]);
  const [newTask, setNewTask] = useState("");

  const handleChange = (event) => {
    setNewTask(event.target.value);
  };

  const addTask = () => {
    if (newTask.trim() === "") return;
    const task = {
      id: todoList.length === 0 ? 1 : todoList[todoList.length - 1].id + 1,
      taskName: newTask,
      timestamp: new Date().toLocaleString(),
      completed: false,
    };
    setTodoList([...todoList, task]);
    setNewTask(""); // Clear input after adding
  };

  const deleteTask = (id) => {
    const newTodoList = todoList.filter((task) => task.id !== id);
    setTodoList(newTodoList);
  };

  const completeTask = (id) => {
    setTodoList(
      todoList.map((task) => {
        if (task.id === id) {
          return { ...task, completed: true };
        } else {
          return task;
        }
      })
    );
  };

  return (
    <div className="App">
      <div className="addTask">
        <h1 style={{ color: "#218838", marginBottom: "15px" }}>TO-DO-LIST</h1>
        <input
          value={newTask}
          onChange={handleChange}
          placeholder="Enter a new task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <div className="list">
        {todoList.map((task) => (
          <div
            key={task.id}
            className="taskItem"
            style={{ backgroundColor: task.completed ? "#c4ffc2" : "white" }}
          >
            <h1>{task.taskName}</h1>
            <h1 style={{ color: "grey" }}>{task.timestamp}</h1>
            <button onClick={() => deleteTask(task.id)}>X</button>
            <button
              onClick={() => completeTask(task.id)}
              style={{ backgroundColor: "#638062" }}
            >
              Done
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Todolist;
