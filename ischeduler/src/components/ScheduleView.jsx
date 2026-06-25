import React, { useState } from "react";
import dayjs from "dayjs";
import "./ScheduleView.css";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ScheduleView({ tasks }) {
  const [selectedDay, setSelectedDay] = useState("Mon");

  const dayTasks = tasks.filter(task =>
    task.selectedDays.includes(selectedDay)
  );

  const startHour = 8;
  const endHour = 22;

  const totalMinutes = (endHour - startHour) * 60;

  return (
    <div className="schedule-wrapper">
      <h2>{selectedDay} Schedule</h2>

      <div className="day-buttons">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={day === selectedDay ? "active" : ""}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="schedule">

        {/* Header */}
        <div className="time-header">
          {Array.from(
            { length: (endHour - startHour) / 2 + 1 },
            (_, i) => startHour + i * 2
          ).map(hour => (
            <div key={hour} className="time-label">
              {dayjs().hour(hour).minute(0).format("h A")}
            </div>
          ))}
        </div>

        {/* Tasks */}
        <div className="task-area">
          {dayTasks.map(task => {
            const startMinutes =
              (task.startTime.hour() - startHour) * 60 +
              task.startTime.minute();

            const duration =
              task.endTime.diff(task.startTime, "minute");

            const left =
              (startMinutes / totalMinutes) * 100;

            const width =
              (duration / totalMinutes) * 100;

            return (
              <div
                key={task.id}
                className={`task-bar ${task.importance}`}
                style={{
                  left: `${left}%`,
                  width: `${width}%`
                }}
              >
                {task.name}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}