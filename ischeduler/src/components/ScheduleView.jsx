import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import "./ScheduleView.css";

const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export default function ScheduleView({ schedule, tasks }) {
  const [selectedDay, setSelectedDay] = useState("mon");
  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000); // update every minute

    return () => clearInterval(timer);
  }, []);

  const daySchedule = schedule[selectedDay] || [];

  const startHour = 8;
  const endHour = 22;
  const totalMinutes = (endHour - startHour) * 60;

  const currentMinutes =
    (currentTime.hour() - startHour) * 60 +
    currentTime.minute();

  const currentLeft = Math.max(
    0,
    Math.min((currentMinutes / totalMinutes) * 100, 100)
  );

  const getTaskColor = (hour) => {
    if (hour < 9) return "#43A047";
    if (hour < 12) return "#1E88E5";
    if (hour < 15) return "#00ACC1";
    if (hour < 18) return "#FB8C00";
    if (hour < 20) return "#E53935";
    return "#8E24AA";
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

          {/* Current Time Indicator */}
          {currentTime.hour() >= startHour &&
            currentTime.hour() <= endHour && (
              <div
                className="current-time-line"
                style={{ left: `${currentLeft}%` }}
              >
                <div className="current-time-dot"></div>
              </div>
            )}

          {daySchedule.map((slot, index) => {
            const startTime = dayjs(slot.startTime);
            const endTime = dayjs(slot.endTime);

            const startMinutes =
              (startTime.hour() - startHour) * 60 +
              startTime.minute();

            const duration = endTime.diff(startTime, "minute");

            const left = (startMinutes / totalMinutes) * 100;
            const width = (duration / totalMinutes) * 100;

            const task = tasks.find((t) => t.id === slot.taskId);

            const backgroundColor = getTaskColor(startTime.hour());

            return (
              <div
                key={index}
                className="task-bar"
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  backgroundColor,
                }}
                title={`${task?.name || "Task"} • ${startTime.format(
                  "hh:mm A"
                )} - ${endTime.format("hh:mm A")}`}
              >
                <div className="task-content">
                  <div className="task-title">
                    {task?.name || "Task"}
                  </div>

                  <div className="task-time">
                    {startTime.format("hh:mm A")} -{" "}
                    {endTime.format("hh:mm A")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}