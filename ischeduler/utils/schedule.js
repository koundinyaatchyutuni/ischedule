import schedule from "node-schedule";
import TaskSchedule from "../modles/remSchema.js";
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
            from: `"iSchedule" <${process.env.EMAIL}>`,
            to: task.email,
            subject: `⏰ Reminder: ${task.task_name}`,
            html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>

<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:30px 0;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:12px;overflow:hidden;
box-shadow:0 6px 18px rgba(0,0,0,.12);">

<!-- Header -->
<tr>
<td style="background:#2563eb;padding:30px;text-align:center;">
<h1 style="color:white;margin:0;">⏰ Task Reminder</h1>
<p style="color:#dbeafe;margin-top:8px;font-size:15px;">
Don't forget your upcoming task!
</p>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:35px;">

<p style="font-size:18px;color:#333;">
Hi 👋,
</p>

<p style="font-size:16px;color:#555;line-height:1.7;">
This is a reminder that your task
<strong style="color:#2563eb;">${task.task_name}</strong>
will begin in
<strong>5 minutes</strong>.
</p>

<table width="100%"
style="margin-top:25px;background:#f8fafc;border-radius:10px;padding:20px;">
<tr>
<td>

<p style="margin:8px 0;font-size:15px;">
<b>📝 Task</b><br>
${task.task_name}
</p>

<p style="margin:8px 0;font-size:15px;">
<b>🕒 Start Time</b><br>
${task.startTime.toLocaleTimeString()}
</p>

<p style="margin:8px 0;font-size:15px;">
<b>🏁 End Time</b><br>
${task.endTime.toLocaleTimeString()}
</p>

</td>
</tr>
</table>

<p style="margin-top:30px;font-size:15px;color:#555;">
Stay focused and have a productive session! 🚀
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td
style="background:#f3f4f6;padding:20px;text-align:center;color:#6b7280;font-size:13px;">

This reminder was automatically sent by
<b>iSchedule</b> 5 minutes before your task.

<br><br>

© 2026 iSchedule

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`
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