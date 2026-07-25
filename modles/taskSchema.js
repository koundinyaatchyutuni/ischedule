import mongoose from "mongoose";

const TimeSlotSchema = new mongoose.Schema({
    taskId: String,
    startTime: String,
    endTime: String
}, { _id: false });

const TaskItemSchema = new mongoose.Schema({
    id: String,
    name: String,
    startTime: String,
    endTime: String,
    selectedDays: [String],
    remainderEndDate: String
}, { _id: false });

const TaskSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true
    },
    task_list: [TaskItemSchema],
    Schedule: {
        mon: [TimeSlotSchema],
        tue: [TimeSlotSchema],
        wed: [TimeSlotSchema],
        thu: [TimeSlotSchema],
        fri: [TimeSlotSchema],
        sat: [TimeSlotSchema],
        sun: [TimeSlotSchema]
    }
});
export default mongoose.model("Task", TaskSchema);