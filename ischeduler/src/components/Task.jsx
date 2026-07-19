import React, { useState } from "react";
import "./Task.css";
import editIcon from "../assets/edit-icon2.png";
import deleteIcon1 from "../assets/delete-icon1.png";
import deleteIcon2 from "../assets/delete-icon2.png";
import Clock from "./Clock";
import Repeat from "./Repeat";

function Task({
  id,
  task,
  startTime,
  endTime,
  selectedDays,
  schedule,
  remainderEndDate,
  updateTask,
  deleteTask,
}) {
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [collision, setCollision] = useState(false);
  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const [taskName, setTaskName] = useState(task);
  const [taskstartTime, setTaskstartTime] = useState(startTime);
  const [taskendTime, setTaskendTime] = useState(endTime);
  const [taskselectedDays, settaskSelectedDays] = useState(selectedDays);
  const [taskRemainderEndDate, setTaskRemainderEndDate] = useState(remainderEndDate);
  const verifyCollision = (
    newStartTime,
    newEndTime,
    daysToCheck = taskselectedDays
  ) => {
    for (const day of daysToCheck) {
      const scheduledTasks = schedule[day] || [];

      for (const scheduledTask of scheduledTasks) {
        // Ignore current task being edited
        if (
          scheduledTask.startTime.isSame(startTime) &&
          scheduledTask.endTime.isSame(endTime)
        ) {
          continue;
        }

        const overlap =
          newStartTime.isBefore(scheduledTask.endTime) &&
          newEndTime.isAfter(scheduledTask.startTime);

        if (overlap) {
          setCollision(true);
          return true;
        }
      }
    }

    setCollision(false);
    return false;
  };

  const toggleDay = (day) => {
    const updatedDays = taskselectedDays.includes(day)
      ? taskselectedDays.filter((d) => d !== day)
      : [...taskselectedDays, day];

    settaskSelectedDays(updatedDays);

    verifyCollision(
      taskstartTime,
      taskendTime,
      updatedDays
    );
  };

  const handleEdit = () => {
    setEdit(true);

    verifyCollision(
      taskstartTime,
      taskendTime,
      taskselectedDays
    );
  };

  const handleSave = () => {
    if (
      verifyCollision(
        taskstartTime,
        taskendTime,
        taskselectedDays
      )
    ) {
      alert("Schedule collision detected");
      return;
    }

    updateTask(id, {
      name: taskName,
      startTime: taskstartTime,
      endTime: taskendTime,
      selectedDays: taskselectedDays,
      remainderEndDate: taskRemainderEndDate
    });

    setEdit(false);
  };

  return (
  <>
    <div
      className="task-wrapper"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <div className="task-container">

        <div className="task-header">

          <div className="task-title-section">
            <h3 className="task-name">{taskName}</h3>

            <p className="task-time">
              🕒 {taskstartTime.format("hh:mm A")} - {taskendTime.format("hh:mm A")}
            </p>
          </div>

          {show && (
            <div className="task-actions">

              <img
                src={editIcon}
                alt="Edit"
                className="action-icon"
                onClick={handleEdit}
              />

              <img
                src={deleteIcon1}
                alt="Delete"
                className="action-icon"
                onMouseEnter={(e) => (e.target.src = deleteIcon2)}
                onMouseLeave={(e) => (e.target.src = deleteIcon1)}
                onClick={() => deleteTask(id)}
              />

            </div>
          )}

        </div>

        <div className="task-days">
          {taskselectedDays.map((day) => (
            <span
              key={day}
              className="day-chip"
            >
              {day.toUpperCase()}
            </span>
          ))}
        </div>

        <div className="task-footer">

          <span className="reminder">
            🔔 Reminder Until
          </span>

          <span className="reminder-date">
            {taskRemainderEndDate}
          </span>

        </div>

      </div>
    </div>

    {edit && (
      <div className="edit-form">
        <input
          type="text"
          placeholder="Task name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />

        <p>Start Time:</p>

        <Clock
          scheduleTime={taskstartTime}
          setScheduleTime={setTaskstartTime}
          onChange={(newStartTime) =>
            verifyCollision(
              newStartTime,
              taskendTime,
              taskselectedDays
            )
          }
        />

        <p>End Time:</p>

        <Clock
          scheduleTime={taskendTime}
          setScheduleTime={setTaskendTime}
          onChange={(newEndTime) =>
            verifyCollision(
              taskstartTime,
              newEndTime,
              taskselectedDays
            )
          }
        />

        <p>Selected Days:</p>

        <Repeat
          days={days}
          selectedDays={taskselectedDays}
          toggleDay={toggleDay}
        />

        <p>Reminder End Date:</p>

        <input
          type="date"
          value={taskRemainderEndDate}
          onChange={(e) => setTaskRemainderEndDate(e.target.value)}
        />

        {collision && (
          <p
            style={{
              color: "red",
              marginTop: "10px",
            }}
          >
            Time slot overlaps with another task.
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={collision}
          style={{
            cursor: collision ? "not-allowed" : "pointer",
          }}
        >
          Save
        </button>
      </div>
    )}
  </>
);
}

export default Task;