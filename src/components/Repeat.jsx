import "./Repeat.css";

function Repeat({ days, selectedDays, toggleDay }) {
  return (
    <div className="repeat-container">
      <h3>Repeat</h3>

      <div className="repeat-buttons">
        {days.map((day) => (
          <button
            key={day}
            type="button"
            className={`repeat-btn ${
              selectedDays.includes(day) ? "active" : ""
            }`}
            onClick={() => toggleDay(day)}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Repeat;