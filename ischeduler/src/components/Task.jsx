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
  updateTask,
  deleteTask,
}) {
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [collision, setCollision] = useState(false);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [taskName, setTaskName] = useState(task);
  const [taskstartTime, setTaskstartTime] = useState(startTime);
  const [taskendTime, setTaskendTime] = useState(endTime);
  const [taskselectedDays, settaskSelectedDays] = useState(selectedDays);

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
          <h3 className="task-name">{taskName}</h3>

          <div className="task-info">
            <p className="task-deadline">
              {taskstartTime.format("hh:mm A")}
            </p>

            <p className="task-days">
              {selectedDays.join(", ")}
            </p>
          </div>

          {show && (
            <img
              src={editIcon}
              alt="Edit"
              className="edit-icon"
              onMouseEnter={(e) =>
                (e.target.style.filter = "brightness(1.2)")
              }
              onMouseLeave={(e) =>
                (e.target.style.filter = "brightness(1)")
              }
              onClick={handleEdit}
              style={{
                cursor: "pointer",
                width: "36px",
                height: "auto",
                marginLeft: "1.5px",
                marginRight: "0px",
              }}
            />
          )}
        </div>

        {show && (
          <img
            src={deleteIcon1}
            alt="Delete"
            className="delete-icon1"
            onMouseEnter={(e) =>
              (e.target.src = deleteIcon2)
            }
            onMouseLeave={(e) =>
              (e.target.src = deleteIcon1)
            }
            onClick={() => deleteTask(id)}
            style={{
              cursor: "pointer",
              width: "auto",
              height: "36px",
              marginTop: "10px",
            }}
          />
        )}
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