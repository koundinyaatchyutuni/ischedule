import React, { useState } from "react";
import "./Task.css";
import editIcon from "../assets/edit-icon2.png";
import deleteIcon1 from "../assets/delete-icon1.png";
import deleteIcon2 from "../assets/delete-icon2.png";

function Task({
  id,
  task,
  startTime,
  endTime,
  selectedDays,
  remainderEndDate,
  deleteTask,
  onEdit,
}) {
  const [show, setShow] = useState(false);

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
              <h3 className="task-name">{task}</h3>

              <p className="task-time">
                🕒 {startTime.format("hh:mm A")} - {endTime.format("hh:mm A")}
              </p>
            </div>

            {show && (
              <div className="task-actions">

                <img
                  src={editIcon}
                  alt="Edit"
                  className="action-icon"
                  onClick={onEdit}
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
            {selectedDays.map((day) => (
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
              {remainderEndDate}
            </span>

          </div>

        </div>
      </div>
    </>
  );
}

export default Task;