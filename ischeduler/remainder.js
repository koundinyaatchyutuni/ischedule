import mongoose from "mongoose";
import dotenv from "dotenv";
import { encrypt, decrypt } from "./cryptoUtils.js";
import { scheduleTask } from "./utils/schedule.js";
import nodemailer from "nodemailer";
import TaskSchedule from "./modles/remSchema.js";
import Task from "./modles/taskSchema.js";
import User from "./modles/userSchema.js";
import { days } from "./utils/constElements.js";
dotenv.config();


async function getUsers() {
    return await User.find().lean();
}

async function getTasks() {
    return await Task.find().lean();
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
                const existing = await TaskSchedule.findOne({
                    taskId: task.id,
                    reminderTime
                });

                if (!existing) {
                    const reminder = await TaskSchedule.create({
                        taskId: task.id,
                        task_name: task.name,
                        email,
                        startTime,
                        endTime,
                        reminderTime
                    });

                    scheduleTask(reminder);
                }
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
            users.map(user => [user.user_name, decrypt(user.email)])
        );

        const today = days[new Date().getDay()];

        await processTasks(tasks, emailMap, today);

        console.log("Finished processing reminders.");
    } catch (err) {
        console.error(err);
    }
}

main();