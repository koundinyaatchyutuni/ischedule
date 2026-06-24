import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

export default function Clock({ scheduleTime, setScheduleTime }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        value={scheduleTime}
        onChange={(newValue) => setScheduleTime(newValue)}
      />
    </LocalizationProvider>
  );
}