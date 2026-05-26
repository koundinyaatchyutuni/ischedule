import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(
        "mongodb+srv://koundinyaatchyutuni:Candy007@cluster0.a5qcwu9.mongodb.net/ischeduler?appName=Cluster0"
    )
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

const UserSchema = new mongoose.Schema({
    user_name: String,
    password: String
});

const User = mongoose.model("user", UserSchema);
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

app.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
});