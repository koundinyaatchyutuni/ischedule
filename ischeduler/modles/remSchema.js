import mongoose from "mongoose";

const TaskScheduleSchema = new mongoose.Schema({
    taskId: {
        type: String,
        required: true
    },
    task_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    reminderTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "sent", "cancelled"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 82800 // 23 hours
    }
});

export default mongoose.model("TaskSchedule", TaskScheduleSchema);