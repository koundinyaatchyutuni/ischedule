import "./Repeat.css";

function Repeat({ days, selectedDays, toggleDay }) {
  return (
    <div>
      <h3>Repeat</h3>

      {days.map((day) => (
        <button
          key={day}
          type="button"
          onClick={() => toggleDay(day)}
          style={{
            backgroundColor: selectedDays.includes(day)
              ? "lightblue"
              : "white",
            color: selectedDays.includes(day)
              ? "white"
              : "black",
          }}
        >
          {day}
        </button>
      ))}
    </div>
  );
}

export default Repeat;