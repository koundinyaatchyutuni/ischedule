import mongoose from "mongoose";
import dotenv from "dotenv";
import Task from "../modles/taskSchema.js";
import {
    days
} from "./constElements.js";
dotenv.config();

export async function cleanUpExpiredTasks() {
    try {
        const now = new Date();
        const taskSchemas = await Task.find({});

        for (const taskSchema of taskSchemas) {

            const expiredTasks = [];

            for (const task of taskSchema.task_list) {
                if (new Date(task.remainderEndDate) < now) {
                    expiredTasks.push(task.id);
                }
            }

            if (expiredTasks.length === 0)
                continue;

            const expiredSet = new Set(expiredTasks);

            const newTaskList = taskSchema.task_list.filter(
                task => !expiredSet.has(task.id)
            );

            const newSchedule = {};

            for (const day of days) {
                newSchedule[day] = (taskSchema.Schedule[day] || []).filter(
                    slot => !expiredSet.has(slot.taskId)
                );
            }

            taskSchema.task_list = newTaskList;
            taskSchema.Schedule = newSchedule;

            await taskSchema.save();

            console.log(
                `Removed ${expiredTasks.length} expired task(s) for ${taskSchema.user_name}`
            );
        }

        console.log("Cleanup completed.");
    } catch (error) {
        console.error("Error cleaning up expired tasks:", error);
    }
};