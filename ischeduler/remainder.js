import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { encrypt, decrypt } from "./cryptoUtils.js";
import bcrypt from 'bcryptjs'

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});
users = []