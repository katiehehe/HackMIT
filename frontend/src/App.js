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
        <Task task_name="Task 1" deadline="9/15/25" subtask_array={subtasks1} />
        <Task task_name="Task 2" deadline="9/15/25" subtask_array={subtasks2} />
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
