import React, { useState, useEffect } from "react";
import Task from "./Task";
import "../App.css";
import profilePic from '../assets/default log in img.jpg';
import axios from "axios";
import Repeat from "./Repeat";
import Clock from "./Clock";
import dayjs from "dayjs";


function Home() {

  const [tasks, setTasks] = useState([]);
  const [flag, setFlag] = useState(false);
  const [name, setName] = useState('');
  const [importance, setImportance] = useState('low');
  const [scheduleTime, setScheduleTime] = useState(dayjs());
  const [user, setUser] = useState(null);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [selectedDays, setSelectedDays] = useState([]);
  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };
    useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    setUser(storedUser);
    console.log("Stored user:", storedUser);
    if (storedUser) {
        const fetchTasks = async () => {
            console.log("fetchTasks called");

            try {
                const response = await axios.post(
                    "http://localhost:3001/gettasks",
                    {
                        username: storedUser.username,
                    }
                );

                setTasks(response.data.tasks);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTasks();
    }
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
      scheduleTime,
      selectedDays
    };

    setTasks([...tasks, newTask]);

    setFlag(false);
    setName("");
    setImportance("low");
    setScheduleTime("");
  };

  const updateTask = (id, updatedTask) => {
  setTasks(
    tasks.map((task) =>
      task.id === id ? { ...task, ...updatedTask } : task
    )
  );
};
const deleteTask = (id) => {
  setTasks(tasks.filter((task) => task.id !== id));
}
  const handleSave = async (e)=>{
    e.preventDefault();
    // setTasks([...tasks]);
    const username = user.username;
    const responce = await axios.post('http://localhost:3001/savetasks',{ username, tasks });
    if (responce.status === 200) {
      alert("Tasks saved successfully");
    } else {
      alert("Failed to save tasks");
    }
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
      <button onClick={handleSave}>Submit</button>
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
          <Clock scheduleTime={scheduleTime} setScheduleTime={setScheduleTime} />

        <Repeat
        days={days}
        selectedDays={selectedDays}
        toggleDay={toggleDay}
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
          id={task.id}
          task={task.name}
          importance={task.importance}
          scheduleTime={task.scheduleTime.format("hh:mm A")}
          selectedDays={task.selectedDays}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
        ))}
      </div>

    </div>
    </>
  );
}

export default Home;