import React, { useState } from "react";
import dayjs from "dayjs";
import "./ScheduleView.css";

const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export default function ScheduleView({ schedule, tasks }) {
  const [selectedDay, setSelectedDay] = useState('mon');

  const daySchedule = schedule[selectedDay] || [];

  const startHour = 8;
  const endHour = 22;
  const totalMinutes = (endHour - startHour) * 60;

  return (
    <div className="schedule-wrapper">
      <h2>{selectedDay.toUpperCase()} Schedule</h2>

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

        <div className="task-area">
          {daySchedule.map((slot, index) => {
            const startTime = dayjs(slot.startTime, "HH:mm");
            const endTime = dayjs(slot.endTime, "HH:mm");

            const startMinutes =
              (startTime.hour() - startHour) * 60 +
              startTime.minute();

            const duration =
              endTime.diff(startTime, "minute");

            const left =
              (startMinutes / totalMinutes) * 100;

            const width =
              (duration / totalMinutes) * 100;

            const task = tasks.find(
              t => t.id === slot.taskId
            );

            return (
              <div
                key={index}
                className="task-bar"
                style={{
                  left: `${left}%`,
                  width: `${width}%`
                }}
              >
                {task?.name || "Task"}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}