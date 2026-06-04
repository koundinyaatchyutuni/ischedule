import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();
const app = express();
// const jws = require('jsonwebtoken');
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.mongo_uri)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

const UserSchema = new mongoose.Schema({
    user_name: String,
    password: String
});

const User = mongoose.model("user", UserSchema);
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

app.post("/signup", async(req, res) => {

    const { username, password } = req.body;

    try {

        const user = await User.create({
            user_name: username,
            password: await bcrypt.hash(password, 10)
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
        // navigate('/login');
    } catch (err) {

        console.log(err);

        res.json({
            status: "error"
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
            return res.status(400).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
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