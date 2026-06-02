import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';
import jsonwebtoken from "jsonwebtoken";

dotenv.config();
const app = express();
const jws = jsonwebtoken();
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
            password
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
app.post("/login", async(req, res) => {

    const { username, password } = req.body;

    try {

        const user = await User.findOne({
            user_name: username,
            password
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

app.listen(process.env.port, () => {
    console.log("Server running on http://localhost:" + process.env.port);
});