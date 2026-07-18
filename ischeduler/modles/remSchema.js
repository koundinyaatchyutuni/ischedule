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
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 82800 // 23 hours in seconds
    }
});

export default mongoose.model("TaskSchedule", TaskSchema);