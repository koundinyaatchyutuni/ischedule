import React, { useState, useEffect } from "react";
import Task from "./Task";
import "../App.css";
import profilePic from '../assets/default log in img.jpg';

function Home() {

  const [tasks, setTasks] = useState([]);
  const [flag, setFlag] = useState(false);
  const [name, setName] = useState('');
  const [importance, setImportance] = useState('low');
  const [deadline, setDeadline] = useState('');
  const [user, setUser] = useState(null);
    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user")));
    }, []);
  const onclick = () => {
    setFlag(true);
  };

  const goBack = () => {
    setFlag(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTask = {
      id: Date.now(),
      name,
      importance,
      deadline,
    };

    setTasks([...tasks, newTask]);

    setFlag(false);
    setName("");
    setImportance("low");
    setDeadline("");
  };

  return (
    <>
    <div className='app-header'>
      <h1>iScheduler</h1>
      <img src={profilePic} alt="Profile" style={{
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #fff",
  }} />
<p className='user_name' style={{ marginRight: '15px' }}>
  {user ? user.username : 'Guest'}
</p>    </div>

    <div className="app-container">

      <button onClick={onclick}>Add Task</button>

      {flag && (
        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Task name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            value={importance}
            onChange={(e) => setImportance(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <button type="submit">Submit</button>

          <button type="button" onClick={goBack}>
            Go Back
          </button>

        </form>
      )}

      <div className="tasks-list">
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task.name}
            importance={task.importance}
            deadline={task.deadline}
          />
        ))}
      </div>

    </div>
    </>
  );
}

export default Home;