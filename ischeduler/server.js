import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { encrypt, decrypt } from "./cryptoUtils.js";
import bcrypt from 'bcryptjs'
import Task from "./modles/taskSchema.js";
import User from "./modles/userSchema.js";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

const app = express();
// const jws = require('jsonwebtoken');
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.mongo_uri)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));


//need to add this taks recieving in home.jsx
app.post('/gettasks', async(req, res) => {
    console.log(req.body);

    const { username } = req.body;

    console.log("Received username:", username);

    try {
        const usr = await Task.findOne({
            user_name: username
        });

        console.log("Found user:", usr);

        if (usr) {
            return res.status(200).json({
                tasks: usr.task_list,
                schedule: usr.Schedule
            });
        }

        return res.status(404).json({
            tasks: [],
            schedule: []
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Error while fetching tasks"
        });
    }
});

app.post('/getUserInfo', async(req, res) => {
    const { username } = req.body;
    try {
        const usr = await User.findOne({ user_name: username });
        if (usr) {
            //need to add decryption of encrypted email so that user can see when he want to edit the email.
            const decryptedEmail = decrypt(usr.email);
            res.status(200).json({ email: decryptedEmail });
        } else {
            res.status(404).json({ message: "username not found: " + username });
        }
    } catch (err) {
        console.log(err);

        res.status(500).json({
            status: "error"
        });

    }
});

app.post('/finduser', async(req, res) => {
    const { username } = req.body;
    try {
        const usr = await User.findOne({
            user_name: username
        });
        if (usr) {
            res.json({ status: "exists" })
        } else {
            res.json({ status: "available" })
        }
    } catch (err) {
        console.log(err);

        res.json({
            status: "error"
        });
    }
});

app.post('/sendotp', async(req, res) => {
    const { email } = req.body;
    try {
        const otp = generateOTP();

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "VERIFICATION code for iScheduler account",
            text: `Your OTP is ${otp}. It will expire in 5 minutes.`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            status: "success",
            otp
        });

    } catch (err) {
        res.status(500).json({
            status: "error"
        });
    }
});

app.post("/signup", async(req, res) => {

    const { username, password, email } = req.body;

    try {

        const user = await User.create({
            user_name: username,
            password: await bcrypt.hash(password, 10),
            email: encrypt(email)
        });
        if (user) {
            res.json({
                status: "success"
            });
        } else {
            res.json({
                status: "failed"
            });
        }
    } catch (err) {

        console.log(err);

        res.json({
            status: "error"
        });
    }
});

app.post('/updateUser', async(req, res) => {
    const { oldusername, newusername, email, password } = req.body;

    try {
        // need to encrypt the new updated password and email user want to update
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedEmail = encrypt(email);
        const result = await User.updateOne({ user_name: oldusername }, {
            $set: {
                user_name: newusername,
                email: hashedEmail,
                password: hashedPassword
            }
        });

        if (result.matchedCount === 0) {
            return res.status(404).json({
                status: "user not found"
            });
        }

        await Task.updateMany({ user_name: oldusername }, {
            $set: {
                user_name: newusername
            }
        });

        return res.status(200).json({
            status: "success"
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            status: "error"
        });
    }
});

// to store task details of users in db
app.post("/savetasks", async(req, res) => {

    const { username, tasks, schedule } = req.body;
    try {
        const result = await Task.updateOne({ user_name: username }, {
            $set: {
                task_list: tasks,
                Schedule: schedule
            }
        }, { upsert: true });
        console.log("Received tasks:", tasks);
        console.log(result);
        if (result.acknowledged) {
            res.status(200).json({ message: "Success" });
        } else {
            res.status(400).json({ message: "Failed" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }

});
app.post("/login", async(req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({
            user_name: username
        });

        if (!user) {
            return res.status(220).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(220).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign({
                id: user._id,
                username: user.user_name
            },
            "secretkey", {
                expiresIn: "1h"
            }
        );

        return res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.user_name
            }
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
});


app.listen(process.env.port, () => {
    console.log("Server running on http://localhost:" + process.env.port);
});