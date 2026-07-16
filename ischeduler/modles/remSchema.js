import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    task_name: String,
    email: String,
    startTime: Date,
    endTime: Date,
    reminderTime: Date,
    status: {
        type: String,
        default: "pending"
    }
});

export default mongoose.model("TaskSchedule", TaskSchema);