import schedule from "node-schedule";
import TaskSchedule from "./modles/remSchema.js";
import dotenv from 'dotenv';
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

const jobs = new Map();

export function scheduleTask(task) {

    // Cancel previous job if it exists
    if (jobs.has(task._id.toString())) {
        jobs.get(task._id.toString()).cancel();
    }

    const job = schedule.scheduleJob(task.reminderTime, async() => {

        console.log(`Reminder for ${task.task_name}`);

        const mailOptions = {
            from: process.env.EMAIL,
            to: task.email,
            subject: `Reminder: ${task.task_name}`,
            text: `
                Task Reminder

                Your task "${task.task_name}" is scheduled from ${task.startTime.toLocaleTimeString()} to ${task.endTime.toLocaleTimeString()}.

                This reminder was generated 5 minutes before your task start time.`
        };

        await transporter.sendMail(mailOptions);

        console.log(`Sending email to ${task.email}`);

        await TaskSchedule.findByIdAndUpdate(task._id, {
            status: "completed"
        });

        jobs.delete(task._id.toString());
    });

    jobs.set(task._id.toString(), job);
}

export function cancelTask(id) {

    if (jobs.has(id)) {
        jobs.get(id).cancel();
        jobs.delete(id);
    }
}