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
  const [newDeadline, setNewDeadline] = useState("");
  const addTask = async () => {
    if (!newTitle) return; // optional: ignore empty titles
    if (!newDeadline) {
      const curDate = new Date();
      const year = curDate.getFullYear();
      const month = String(curDate.getMonth() + 1).padStart(2, "0");
      const day = String(curDate.getDate()).padStart(2, "0");
      setNewDeadline(`${year}-${month}-${day}`);
    }

    const res = await fetch("http://127.0.0.1:5000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, deadline: newDeadline, subtasks: [""]})
    });

    const newTask = await res.json();
    setTasks([...tasks, newTask]); // update frontend state
    setNewTitle(""); // clear input

};

const handleDelete = (task_id) => {
  setTasks(tasks.filter((task) => task.id !== task_id));
  };

  const addSubtask = async (taskId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/tasks/${taskId}/subtasks`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
  
      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? updatedTask : task
          )
        );
      } else {
        console.error("Failed to add subtask");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //original code, don't touch
  //const subtasks1 = ['Subtask 1', 'Subtask 2', 'Subtask 3'];
  //const subtasks2 = ['Help', 'Me', 'Please', '...'];
  
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

        {/**Makes the button that adds the tasks and input thingy */}
        <div>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New task title"
        />
        <input
          type="date"
          value={newDeadline}
          onChange={(e) => setNewDeadline(e.target.value)}
          placeholder="Select deadline"
        />
        <button onClick={addTask}>Add Task</button>
      </div>

        {tasks.map((task) => (
        <Task
        key={task.id}
        task_id={task.id}          // pass the task ID
        task_name={task.title}
        deadline={task.deadline}
        subtask_array={task.subtasks || []}
        onAddSubtask={addSubtask}
        onDelete={handleDelete}    // pass the handler
        />
))}
      </main>  
    </div>

    
  );
}

function Task({ task_id, task_name, deadline, subtask_array, onAddSubtask, onDelete }) {
  const [activeIndex, setActiveIndex] = useState(-1); // -1 = none selected

  const handleClick = (index) => {
    setActiveIndex(index==activeIndex ? -1 : index);
  };

  const deleteTask = async() => {
    await fetch(`http://127.0.0.1:5000/api/tasks/${task_id}`, {
      method: "DELETE",
    });
    onDelete(task_id);
  }  
  

  return (
    <div className="App-task">
      <div className="titles-container">
        <h3>{task_name}</h3>
        <h4> deadline: {deadline}</h4>
        <button onClick={() => onAddSubtask(task_id)}>Add Subtask</button>
        <button onClick={deleteTask}>delete task</button>
      </div>
      <div className="subtask-container">
        {subtask_array.map((subtask, index) => (
          <div
            key={index}
            className={`subtask ${index <= activeIndex ? 'active' : ''}`}
            onClick={() => handleClick(index)}
          >
            <p>
              {subtask}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
