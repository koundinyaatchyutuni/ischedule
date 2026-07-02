import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

export default function Clock({
  scheduleTime,
  setScheduleTime,
  onChange,
}) {
  console.log("Clock received onChange:", onChange);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        value={scheduleTime}
        onChange={(newValue) => {
          console.log("TimePicker changed:", newValue);

          setScheduleTime(newValue);

          if (onChange) {
            console.log("Calling parent onChange");
            onChange(newValue);
          }
        }}
      />
    </LocalizationProvider>
  );
}