import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react';

function App() {
   const [tasks, setTasks] = useState([]); //  state for backend tasks

  //  fetch tasks from backend when App mounts
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/tasks")
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error(err));
  }, []);

  //add tasks from the frontend
  const [newTitle, setNewTitle] = useState("");
  const addTask = async () => {
  if (!newTitle) return; // optional: ignore empty titles

  const res = await fetch("http://127.0.0.1:5000/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: newTitle, deadline: "2025-09-13", subtasks: ["subtask 1", "subtask 2"]})
  });

  const newTask = await res.json();
  setTasks([...tasks, newTask]); // update frontend state
  setNewTitle(""); // clear input
};


  //original code, don't touch
  const subtasks1 = ['Subtask 1', 'Subtask 2', 'Subtask 3'];
  const subtasks2 = ['Help', 'Me', 'Please', '...'];
  
  return (
    <div className="App">  

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          tasks
        </p>
      </header>

      <main>
        <h1>
          tasks
        </h1>
        {/* <Task task_name="Task 1" deadline="9/15/25" subtask_array={subtasks1} />
        <Task task_name="Task 2" deadline="9/15/25" subtask_array={subtasks2} /> */}
        {tasks.map((task, idx) => (
          <Task key={idx} task_name={task.title} deadline= {task.deadline} subtask_array={task.subtasks || []} />
        ))}
        <div>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New task title"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      </main>  
    </div>

    
  );
}

function Task({ task_name, deadline, subtask_array }) {
  const [activeIndex, setActiveIndex] = useState(-1); // -1 = none selected

  const handleClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="App-task">
      <h3>{task_name}</h3>
      <h4>{deadline}</h4>
      <div className="subtask-container">
        {subtask_array.map((subtask, index) => (
          <div
            key={index}
            className={`subtask ${index <= activeIndex ? 'active' : ''}`}
            onClick={() => handleClick(index)}
          >
            {subtask}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
