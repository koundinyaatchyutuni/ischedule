import React, { useState, useEffect } from "react";
import Task from "./Task";
import "../App.css";
import profilePic from '../assets/default log in img.jpg';
import axios from "axios";
import Repeat from "./Repeat";
import Clock from "./Clock";
import dayjs from "dayjs";
import ScheduleView from "./ScheduleView";

function Home() {

  const [tasks, setTasks] = useState([]);
  const [flag, setFlag] = useState(false);
  const [name, setName] = useState('');
  const [importance, setImportance] = useState('low');
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs());
  const [user, setUser] = useState(null);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [selectedDays, setSelectedDays] = useState([]);
  const [schedule,setSchedule]= useState(Object.fromEntries(days.map(day => [day, []])));

  // binary search sorted search times 
  const search=(day, startTime, endTime)=>{
    const scheduledTasks = schedule[day];
    let l=0,h=scheduledTasks.length-1;
    while(l<=h){
      const mid=Math.floor((h-l)/2)+l;
    if (scheduledTasks[mid].endTime.isSame(startTime) || scheduledTasks[mid].endTime.isBefore(startTime)) {
      l = mid + 1;
    }
    else if (
      scheduledTasks[mid].startTime.isSame(endTime) ||  scheduledTasks[mid].startTime.isAfter(endTime)
    ) {
      h = mid - 1;
    }
    else {
      return true;
    }
    }
    return false;
  };
  // verify collision for all selected days
  const verifyCollision=(scheduledays)=>{
    for (const day of scheduledays) {
      const scheduledTasks = schedule[day];
      if (!search(day, startTime, endTime)) {
        return false;
      }
    }
    return true;
  }
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
  const verifyTime = () => {
    return startTime.isBefore(endTime);
  };
  const addToSchedule = (newTask) => {
    for (const day of newTask.selectedDays) {
      const scheduledTasks = schedule[day];
      const index = scheduledTasks.findIndex(
        (task) => task.startTime.isAfter(newTask.startTime)
      );
      scheduledTasks.splice(index, 0, {startTime: newTask.startTime, endTime: newTask.endTime});
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!verifyTime()) {
      alert("End time must be after start time");
      return;
    }

    if (verifyCollision(selectedDays)) {
      alert("Task time collides with existing tasks");
      return;
    }

    const newTask = {
      id: Date.now(),
      name,
      importance,
      startTime,
      endTime,
      selectedDays
    };
    addToSchedule(newTask);
    setTasks([...tasks, newTask]);
    setFlag(false);
    setName("");
    setImportance("low");
    setStartTime(dayjs());
    setEndTime(dayjs());
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
          <p> start time: </p>
          <Clock scheduleTime={startTime} setScheduleTime={setStartTime} />
          <p> End time: </p>
          <Clock scheduleTime={endTime} setScheduleTime={setEndTime} />
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
          startTime={task.startTime.format("hh:mm A")}
          endTime={task.endTime.format("hh:mm A")}
          selectedDays={task.selectedDays}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
        ))}
      </div>
      <ScheduleView tasks={tasks} />
    </div>
    </>
  );
}

export default Home;