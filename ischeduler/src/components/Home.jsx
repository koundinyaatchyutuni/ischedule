import React, { useState, useEffect } from "react";
import Task from "./Task";
import "../App.css";
import profilePic from '../assets/default log in img.jpg';
import axios from "axios";
import Repeat from "./Repeat";
import Clock from "./Clock";
import dayjs from "dayjs";
import ScheduleView from "./ScheduleView";
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [flag, setFlag] = useState(false);
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs());
  const [user, setUser] = useState(null);
  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const [selectedDays, setSelectedDays] = useState([]);
  const [schedule,setSchedule]= useState(Object.fromEntries(days.map(day => [day, []])));
  const [remainderEndDate, setRemainderEndDate] = useState(dayjs().add(7, 'day').format('YYYY-MM-DD'));
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
                const loadedSchedule = {};
                for (const day in response.data.schedule) {
                  loadedSchedule[day] = response.data.schedule[day].map(slot => ({
                    startTime: dayjs(slot.startTime),
                    endTime: dayjs(slot.endTime),
                    taskId: slot.taskId
                  }));
                }
              setSchedule(loadedSchedule);
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
  const newSchedule = { ...schedule };

  for (const day of newTask.selectedDays) {
    const scheduledTasks = [...newSchedule[day]];

    scheduledTasks.push({
      startTime: newTask.startTime,
      endTime: newTask.endTime,
      taskId: newTask.id
    });

    scheduledTasks.sort(
      (a, b) => a.startTime.valueOf() - b.startTime.valueOf()
    );

    newSchedule[day] = scheduledTasks;
  }

  setSchedule(newSchedule);
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
      startTime,
      endTime,
      selectedDays,
      remainderEndDate
    };
    addToSchedule(newTask);
    setTasks([...tasks, newTask]);
    setFlag(false);
    setName("");
    setStartTime(dayjs());
    setEndTime(dayjs());
    setRemainderEndDate(dayjs().add(7, 'day').format('YYYY-MM-DD'));
  };

function updateTask(id, updatedTask) {
  console.log("updateTask called");
  console.log(id);
  console.log(updatedTask);

  const oldTask = tasks.find(task => task.id === id);

  const newSchedule = {};
    for (const day in schedule) {
      newSchedule[day] = [...schedule[day]];
    }

  // Remove old entries 
  for (const day of oldTask.selectedDays) {
    newSchedule[day] = newSchedule[day].filter(
      t =>
        !(
          t.startTime.isSame(oldTask.startTime) &&
          t.endTime.isSame(oldTask.endTime) &&
          t.taskId === oldTask.id
        )
    );
  }

 for (const day of updatedTask.selectedDays) {
  newSchedule[day].push({
    startTime: updatedTask.startTime,
    endTime: updatedTask.endTime,
    taskId: id
  });

  newSchedule[day].sort(
    (a, b) => a.startTime.valueOf() - b.startTime.valueOf()
  );
}
  setRemainderEndDate(updatedTask.remainderEndDate);
  setSchedule(newSchedule);

  setTasks(tasks =>
    tasks.map(task =>
      task.id === id ? { ...task, ...updatedTask } : task
    )
  );
}
const deleteTask = (id) => {
  const newSchedule = {};

  for (const day in schedule) {
    newSchedule[day] = schedule[day].filter(
      (task) => task.taskId !== id
    );
  }

  setSchedule(newSchedule);

  setTasks(tasks.filter((task) => task.id !== id));
};
  const handleSave = async (e)=>{
    e.preventDefault();
    // setTasks([...tasks]);
    const username = user.username;
    const responce = await axios.post('http://localhost:3001/savetasks',{ username, tasks, schedule });
    if (responce.status === 200) {
      alert("Tasks saved successfully");
    } else {
      alert("Failed to save tasks");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/Login");
  }

  return (
    <>
 <div className="app-header">
  <h1>iScheduler</h1>

  <img
    src={profilePic}
    alt="Profile"
    style={{
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "3px solid #fff",
    }}
  />

  <div className="user-dropdown">
    <p className="user_name">
      {user ? user.username : "Guest"}
    </p>

    <div className="dropdown-menu">
      {user && (
        <div
          className="dropdown-item"
          onClick={() => navigate("/profile")}
        >
          Profile
        </div>
      )}

      <div
        className="dropdown-item"
        onClick={handleLogout}
      >
        {user? "Log Out" : "Log In"}
      </div>
    </div>
  </div>
</div>

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
          <p> start time: </p>
          <Clock scheduleTime={startTime} setScheduleTime={setStartTime} />
          <p> End time: </p>
          <Clock scheduleTime={endTime} setScheduleTime={setEndTime} />
        <Repeat
        days={days}
        selectedDays={selectedDays}
        toggleDay={toggleDay}
      />
          <p>Remainder End Date:</p>
          <input type='date' value={remainderEndDate} onChange={(e) => setRemainderEndDate(e.target.value)} />
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
        startTime={dayjs(task.startTime)}
        endTime={dayjs(task.endTime)}
        selectedDays={task.selectedDays}
        remainderEndDate={task.remainderEndDate}
        schedule={schedule}
        updateTask={updateTask}
        deleteTask={deleteTask}
      />
      ))}
      </div>
      <ScheduleView schedule={schedule} tasks={tasks} />
    </div>
    </>
  );
}

export default Home;