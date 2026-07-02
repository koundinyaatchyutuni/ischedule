import React, { useState } from "react";
import dayjs from "dayjs";
import "./ScheduleView.css";

const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export default function ScheduleView({ schedule, tasks }) {
  const [selectedDay, setSelectedDay] = useState("mon");

  const daySchedule = schedule[selectedDay] || [];

  const startHour = 8;
  const endHour = 22;
  const totalMinutes = (endHour - startHour) * 60;

  const getTaskColor = (hour) => {
    if (hour < 9) return "#43A047"; // Early Morning
    if (hour < 12) return "#1E88E5"; // Morning
    if (hour < 15) return "#00ACC1"; // Noon
    if (hour < 18) return "#FB8C00"; // Afternoon
    if (hour < 20) return "#E53935"; // Evening
    return "#8E24AA"; // Night
  };

  return (
    <div className="schedule-wrapper">
      <h2>{selectedDay.toUpperCase()} Schedule</h2>

      <div className="day-buttons">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={day === selectedDay ? "active" : ""}
          >
            {day.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="schedule">
        <div className="time-header">
          {Array.from(
            { length: (endHour - startHour) / 2 + 1 },
            (_, i) => startHour + i * 2
          ).map((hour) => (
            <div key={hour} className="time-label">
              {dayjs().hour(hour).minute(0).format("h A")}
            </div>
          ))}
        </div>

        <div className="task-area">
          {daySchedule.map((slot, index) => {
            const startTime = dayjs(slot.startTime);
            const endTime = dayjs(slot.endTime);

            const startMinutes =
              (startTime.hour() - startHour) * 60 +
              startTime.minute();

            const duration = endTime.diff(startTime, "minute");

            const left = (startMinutes / totalMinutes) * 100;
            const width = (duration / totalMinutes) * 100;

            const task = tasks.find(
              (t) => t.id === slot.taskId
            );

            const backgroundColor = getTaskColor(
              startTime.hour()
            );

            return (
              <div
                key={index}
                className="task-bar"
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  backgroundColor
                }}
                title={`${task?.name || "Task"} • ${startTime.format(
                  "hh:mm A"
                )} - ${endTime.format("hh:mm A")}`}
              >
                <span className="task-name">
                  {task?.name || "Task"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}