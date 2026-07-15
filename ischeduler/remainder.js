import mongoose from "mongoose";
import dotenv from "dotenv";
import { encrypt, decrypt } from "./cryptoUtils.js";
import { Resend } from "resend";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// =====================
// Mongo Schemas
// =====================

const UserSchema = new mongoose.Schema({
    user_name: String,
    password: String,
    email: String
});

const TimeSlotSchema = new mongoose.Schema({
    startTime: String,
    endTime: String
}, { _id: false });

const TaskSchema = new mongoose.Schema({
    user_name: String,
    task_list: Array,
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

const User = mongoose.model("user", UserSchema);
const Task = mongoose.model("tasks", TaskSchema);

// =====================
// Database Functions
// =====================

async function getUsers() {
    return await User.find().lean();
}

async function getTasks() {
    return await Task.find().lean();
}

// =====================
// Email Function
// =====================

async function scheduleMail(email, taskName, startTime, endTime, reminderTime) {

    console.log(`Scheduling reminder for ${email}`);

    console.log(`Reminder Time : ${reminderTime}`);
    console.log(`Task Starts   : ${startTime}`);

    /*
    Replace this with scheduled sending if you're using Resend scheduling.
    Right now this sends immediately.
    */

    const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: `Reminder: ${taskName}`,
        html: `
            <h2>Task Reminder</h2>

            <p>
                Your task <strong>${taskName}</strong>
                is scheduled from
                <strong>${startTime.toLocaleTimeString()}</strong>
                to
                <strong>${endTime.toLocaleTimeString()}</strong>.
            </p>

            <p>
                This reminder was generated 5 minutes before your task.
            </p>
        `,
        scheduledAt: reminderTime.toISOString()
    });

    if (error) {
        console.error(error);
    } else {
        console.log(data);
    }
}

// =====================
// Process Tasks
// =====================

async function processTasks(tasks, emailMap, day) {

    for (const user_task_list of tasks) {
        const userName = user_task_list.user_name;
        const email = emailMap.get(userName);
        const task_list = user_task_list.task_list || [];
        for (const task of task_list) {
            const taskName = task.name || "Unnamed Task";
            if (task.selectedDays && task.selectedDays.includes(day)) {
                const startTime = new Date(task.startTime);
                const endTime = new Date(task.endTime);
                const reminderTime = new Date(startTime);
                reminderTime.setMinutes(reminderTime.getMinutes() - 5);
                await scheduleMail(
                    email,
                    taskName,
                    startTime,
                    endTime,
                    reminderTime
                );
            }

        }
    }
}

// =====================
// Main Function
// =====================

async function main() {

    try {

        await mongoose.connect(process.env.mongo_uri);

        console.log("MongoDB Connected");

        const users = await getUsers();

        const tasks = await getTasks();

        const emailMap = new Map(
            users.map(user => [user.user_name, decrypt(user.email)]));

        const days = [
            "sun",
            "mon",
            "tue",
            "wed",
            "thu",
            "fri",
            "sat"
        ];

        const today = days[new Date().getDay()];

        await processTasks(
            tasks,
            emailMap,
            today
        );

        console.log("Finished processing reminders.");

    } catch (err) {

        console.error(err);

    } finally {

        await mongoose.disconnect();

    }
}

main();