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
  const [showSchedule, setShowSchedule] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [editName, setEditName] = useState("");
const [editStartTime, setEditStartTime] = useState(dayjs());
const [editEndTime, setEditEndTime] = useState(dayjs());
const [editSelectedDays, setEditSelectedDays] = useState([]);
const [editReminderEndDate, setEditReminderEndDate] = useState("");
const [editCollision, setEditCollision] = useState(false);
  useEffect(() => {
  if (!editTask) return;

  const collision = verifyCollision(
    editSelectedDays,
    editStartTime,
    editEndTime,
    editTask.id
  );

  setEditCollision(collision);
}, [
  editStartTime,
  editEndTime,
  editSelectedDays,
  editTask,
]);
  const toggleEditDay = (day) => {
  setEditSelectedDays((prev) =>
    prev.includes(day)
      ? prev.filter((d) => d !== day)
      : [...prev, day]
  );
};
// binary search sorted search times 
  const search = (day, startTime, endTime, ignoreTaskId = null) => {
  const scheduledTasks = schedule[day];

  let l = 0;
  let h = scheduledTasks.length - 1;

  while (l <= h) {
    const mid = Math.floor((h - l) / 2) + l;

    // Ignore the task currently being edited
    if (scheduledTasks[mid].taskId === ignoreTaskId) {
      let i = mid - 1;
      while (i >= l) {
        if (
          scheduledTasks[i].taskId !== ignoreTaskId &&
          startTime.isBefore(scheduledTasks[i].endTime) &&
          endTime.isAfter(scheduledTasks[i].startTime)
        ) {
          return true;
        }
        i--;
      }

      i = mid + 1;
      while (i <= h) {
        if (
          scheduledTasks[i].taskId !== ignoreTaskId &&
          startTime.isBefore(scheduledTasks[i].endTime) &&
          endTime.isAfter(scheduledTasks[i].startTime)
        ) {
          return true;
        }
        i++;
      }

      return false;
    }

    if (
      scheduledTasks[mid].endTime.isSame(startTime) ||
      scheduledTasks[mid].endTime.isBefore(startTime)
    ) {
      l = mid + 1;
    } else if (
      scheduledTasks[mid].startTime.isSame(endTime) ||
      scheduledTasks[mid].startTime.isAfter(endTime)
    ) {
      h = mid - 1;
    } else {
      return true;
    }
  }

  return false;
};
  // verify collision for all selected days
 const verifyCollision = (
  daysToCheck,
  start,
  end,
  ignoreTaskId = null
) => {
  for (const day of daysToCheck) {
    if (search(day, start, end, ignoreTaskId)) {
      return true;
    }
  }

  return false;
};
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

                const loadedTasks = response.data.tasks.map(task => ({
                  ...task,
                  startTime: dayjs(task.startTime),
                  endTime: dayjs(task.endTime)
                  }));

                setTasks(loadedTasks);
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

   if (verifyCollision(selectedDays,startTime,endTime)) {
      alert("Task time collides with existing tasks");
      return;
    }

   const newTask = {
    id: crypto.randomUUID(),
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
const handleEditTask = (task) => {
  setEditTask(task);

  setEditName(task.name);
  setEditStartTime(dayjs(task.startTime));
  setEditEndTime(dayjs(task.endTime));
  setEditSelectedDays([...task.selectedDays]);
  setEditReminderEndDate(task.remainderEndDate);

  setEditCollision(false);
};
const handleEditSave = () => {

  if (editCollision) {
    alert("Schedule collision detected");
    return;
  }

  if (!editStartTime.isBefore(editEndTime)) {
    alert("End time must be after start time");
    return;
  }

  updateTask(editTask.id, {
    name: editName,
    startTime: editStartTime,
    endTime: editEndTime,
    selectedDays: editSelectedDays,
    remainderEndDate: editReminderEndDate,
  });

  setEditTask(null);
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
<div className="home-page">

  {/* ================= HEADER ================= */}

  <header className="top-navbar">

    <div className="logo-section">
      <h1>iScheduler</h1>
      <p>Smart Daily Planner</p>
    </div>

    <div className="profile-section">

      <img
        src={profilePic}
        alt="profile"
        className="profile-image"
      />

      <div className="user-dropdown">

        <div className="profile-info">
          <span className="username">
            {user ? user.username : "Guest"}
          </span>

          <span className="subtitle">
            Productivity Dashboard
          </span>
        </div>

        <div className="dropdown-menu">

          {user && (
            <div
              className="dropdown-item"
              onClick={() => navigate("/profile")}
            >
              👤 Profile
            </div>
          )}

          <div
            className="dropdown-item"
            onClick={handleLogout}
          >
            🚪 {user ? "Logout" : "Login"}
          </div>

        </div>

      </div>

    </div>

  </header>

  {/* ================= BODY ================= */}

  <main className="dashboard">

    {/* LEFT PANEL */}

    <aside className="dashboard-left">

      <button
        className="primary-btn"
        onClick={onclick}
      >
        + Add Task
      </button>

      <button
        className="secondary-btn"
        onClick={handleSave}
      >
        💾 Save Schedule
      </button>

    </aside>

    {/* CENTER */}

    <section className="dashboard-center">

      {/* Weekly Schedule Button */}

      <div className="schedule-top">

        <button
          className="view-schedule-btn"
          onClick={() => setShowSchedule(true)}
        >
          📅 View Weekly Schedule
        </button>

      </div>

      {/* Tasks */}

      <div className="tasks-panel">

        <div className="tasks-header">

          <h2>My Tasks</h2>

          <span>{tasks.length} Active</span>

        </div>

        <div className="tasks-list">

          {tasks.map(task => (

<Task
    key={task.id}
    id={task.id}
    task={task.name}
    startTime={dayjs(task.startTime)}
    endTime={dayjs(task.endTime)}
    selectedDays={task.selectedDays}
    remainderEndDate={task.remainderEndDate}
    deleteTask={deleteTask}
    onEdit={() => handleEditTask(task)}
/>

          ))}

        </div>
{editTask && (
  <div className="modal-overlay">
    <div className="task-form">

      <h2>Edit Task</h2>

      <input
        type="text"
        placeholder="Task Name"
        value={editName}
        onChange={(e) => setEditName(e.target.value)}
      />

      <label>Start Time</label>

      <Clock
        scheduleTime={editStartTime}
        setScheduleTime={setEditStartTime}
      />

      <label>End Time</label>

      <Clock
        scheduleTime={editEndTime}
        setScheduleTime={setEditEndTime}
      />

      <label>Repeat</label>

      <Repeat
        days={days}
        selectedDays={editSelectedDays}
        toggleDay={toggleEditDay}
      />

      <label>Reminder Until</label>

      <input
        type="date"
        value={editReminderEndDate}
        onChange={(e) =>
          setEditReminderEndDate(e.target.value)
        }
      />

      {editCollision && (
        <p className="collision-text">
          Time slot overlaps with another task.
        </p>
      )}

      <div className="modal-buttons">

        <button
          className="secondary-btn"
          onClick={() => setEditTask(null)}
        >
          Cancel
        </button>

        <button
          className="primary-btn"
          onClick={handleEditSave}
          disabled={editCollision}
        >
          Save Changes
        </button>

      </div>

    </div>
  </div>
)}
      </div>

    </section>

  </main>

  {/* ================= ADD TASK ================= */}

  {flag && (

    <div className="modal-overlay">

      <div className="task-form">

        <h2>Add New Task</h2>

        <input
          type="text"
          placeholder="Task Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Start Time</label>

        <Clock
          scheduleTime={startTime}
          setScheduleTime={setStartTime}
        />

        <label>End Time</label>

        <Clock
          scheduleTime={endTime}
          setScheduleTime={setEndTime}
        />

        <label>Repeat</label>

        <Repeat
          days={days}
          selectedDays={selectedDays}
          toggleDay={toggleDay}
        />

        <label>Reminder Until</label>

        <input
          type="date"
          value={remainderEndDate}
          onChange={(e) => setRemainderEndDate(e.target.value)}
        />

        <div className="modal-buttons">

          <button
            className="secondary-btn"
            onClick={goBack}
          >
            Cancel
          </button>

          <button
            className="primary-btn"
            onClick={handleSubmit}
          >
            Create Task
          </button>

        </div>

      </div>

    </div>

  )}

  {/* ================= SCHEDULE POPUP ================= */}

  {showSchedule && (

    <div className="schedule-modal">

      <div className="schedule-container">

        <div className="schedule-header">

          <h2>Weekly Schedule</h2>

          <button
            onClick={() => setShowSchedule(false)}
            style={{ background: "transparent", border: "none", fontSize: "1.5rem", cursor: "pointer" }}
          >
            ❌
          </button>

        </div>

        <ScheduleView
          schedule={schedule}
          tasks={tasks}
        />

      </div>

    </div>

  )}

</div>
</>
);
}

export default Home;