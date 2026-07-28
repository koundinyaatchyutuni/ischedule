import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "./api";
import "./Signup.css";

const Signup = () => {

    const navigate = useNavigate();

    // ---------------- User Data ----------------

    const [username, setUsername] = useState("");
    const [usermail, setUsermail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // ---------------- OTP ----------------

    const [otp, setOtp] = useState("");
    const [sentOtp, setSentOtp] = useState("");

    const [showVerifyButton, setShowVerifyButton] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [allowSignup, setAllowSignup] = useState(false);

    // ---------------- Status ----------------

    const [usernameStatus, setUsernameStatus] = useState({
        type: "",
        message: ""
    });

    const [emailStatus, setEmailStatus] = useState({
        type: "",
        message: ""
    });

    const [passwordStatus, setPasswordStatus] = useState({
        type: "",
        message: ""
    });

    // used for debouncing username API calls
    const usernameTimer = useRef(null);

    //----------------------------------------------------
    // Auto hide SUCCESS messages after 2.5 sec
    //----------------------------------------------------

    const showTemporaryStatus = (setter, status) => {

        setter(status);

        if (status.type === "success") {

            setTimeout(() => {

                setter(prev => {

                    if (prev.type === "success") {

                        return {
                            type: "",
                            message: ""
                        };

                    }

                    return prev;

                });

            }, 2500);
        }
    };

    //----------------------------------------------------
    // Find User
    //----------------------------------------------------

    const finduser = async (username) => {

        try {

            const result = await axios.post(
                "/finduser",
                { username }
            );

            return result.data;

        }
        catch (err) {

            console.log(err);

            return {
                status: "error"
            };

        }

    };

    //----------------------------------------------------
    // Username Validation
    //----------------------------------------------------

    const handleUsernameChange = (e) => {

        const value = e.target.value;

        setUsername(value);

        if (usernameTimer.current) {

            clearTimeout(usernameTimer.current);

        }

        // Don't validate empty username

        if (value.trim() === "") {

            setUsernameStatus({
                type: "",
                message: ""
            });

            return;

        }

        usernameTimer.current = setTimeout(async () => {

            const data = await finduser(value);

            if (data.status === "exists") {

                setUsernameStatus({
                    type: "error",
                    message: "Username already exists"
                });

            }
            else {

                showTemporaryStatus(
                    setUsernameStatus,
                    {
                        type: "success",
                        message: "Username available"
                    }
                );

            }

        }, 500);

    };

    //----------------------------------------------------
    // Email Validation
    //----------------------------------------------------

    const validateEmail = (email) => {

        setUsermail(email);

        if (email.trim() === "") {

            setEmailStatus({
                type: "",
                message: ""
            });

            setShowVerifyButton(false);

            return;

        }

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regex.test(email)) {

            setEmailStatus({
                type: "error",
                message: "Invalid email address"
            });

            setShowVerifyButton(false);

            return;

        }

        showTemporaryStatus(
            setEmailStatus,
            {
                type: "success",
                message: "Valid email"
            }
        );

        setShowVerifyButton(true);

    };

    //----------------------------------------------------
    // Password Validation
    //----------------------------------------------------

    const validatePassword = (pass, confirm) => {

    if(pass===""){
        setPasswordStatus({
            type:"",
            message:""
        });
        return;
    }

    if(pass.length<8){
        setPasswordStatus({
            type:"error",
            message:"Password must be at least 8 characters."
        });
        return;
    }

    if(confirm===""){
        setPasswordStatus({
            type:"",
            message:""
        });
        return;
    }

    if(pass!==confirm){
        setPasswordStatus({
            type:"error",
            message:"Passwords do not match."
        });
        return;
    }

    showTemporaryStatus(setPasswordStatus,{
        type:"success",
        message:"Passwords match"
    });

};
      //----------------------------------------------------
    // Send OTP
    //----------------------------------------------------

    const handleVerifyEmail = async () => {

        if (emailStatus.type === "error" || usermail.trim() === "") {
            return;
        }

        try {

            const result = await axios.post(
                "/sendotp",
                {
                    email: usermail
                }
            );

            if (result.status === 200) {

                setSentOtp(result.data.otp);

                setShowOtpInput(true);

                showTemporaryStatus(
                    setEmailStatus,
                    {
                        type: "success",
                        message: "OTP sent successfully"
                    }
                );

            }

        }
        catch (err) {

            console.log(err);

            setEmailStatus({
                type: "error",
                message: "Unable to send OTP"
            });

        }

    };

    //----------------------------------------------------
    // Verify OTP
    //----------------------------------------------------

    const handleVerifyOtp = () => {

        if (otp.trim() === "") {

            setEmailStatus({
                type: "error",
                message: "Enter OTP"
            });

            return;

        }

        if (String(otp) === String(sentOtp)) {

            setAllowSignup(true);

            setShowOtpInput(false);

            setShowVerifyButton(false);

            showTemporaryStatus(
                setEmailStatus,
                {
                    type: "success",
                    message: "Email verified"
                }
            );

        }
        else {

            setEmailStatus({
                type: "error",
                message: "Incorrect OTP"
            });

        }

    };

    //----------------------------------------------------
    // Submit
    //----------------------------------------------------

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (username.trim() === "") {

            setUsernameStatus({
                type: "error",
                message: "Username required"
            });

            return;

        }

        if (usermail.trim() === "") {

            setEmailStatus({
                type: "error",
                message: "Email required"
            });

            return;

        }

        if (password === "") {

            setPasswordStatus({
                type: "error",
                message: "Password required"
            });

            return;

        }

        if (password !== confirmPassword) {

            setPasswordStatus({
                type: "error",
                message: "Passwords do not match"
            });

            return;

        }

        if (!allowSignup) {

            setEmailStatus({
                type: "error",
                message: "Verify your email first"
            });

            return;

        }

        try {

            const result = await axios.post(
                "/signup",
                {
                    username,
                    password,
                    email: usermail
                }
            );

            if (result.data.status === "success") {

                navigate("/Login");

            }
            else {

                alert("Registration failed");

            }

        }
        catch (err) {

            console.log(err);

        }

    };

    return (
        <div className="signup-container">

            <div className="signup-card">

                <h1>Create Account</h1>

                <p className="subtitle">
                    Start planning your day with iScheduler
                </p>

                <form onSubmit={handleSubmit}>

                    {/* Username */}

                    <div className="input-group">

                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={handleUsernameChange}
                            className={usernameStatus.type}
                        />

                        {
                            usernameStatus.type === "success" &&
                            <span className="success-icon">✓</span>
                        }

                    </div>

                    {
                        usernameStatus.type === "error" &&
                        <p className="status error">
                            {usernameStatus.message}
                        </p>
                    }

                    {/* Email */}

                    <div className="input-group">

                        <input
                            type="email"
                            placeholder="Email Address"
                            value={usermail}
                            onChange={(e) => validateEmail(e.target.value)}
                            className={emailStatus.type}
                        />

                        {
                            showVerifyButton &&
                            <button
                                type="button"
                                className="verify-btn"
                                onClick={handleVerifyEmail}
                            >
                                Verify
                            </button>
                        }

                        {
                            emailStatus.type === "success" &&
                            !showVerifyButton &&
                            <span className="success-icon">
                                ✓
                            </span>
                        }

                    </div>

                    {
                        emailStatus.type === "error" &&
                        <p className="status error">
                            {emailStatus.message}
                        </p>
                    }

                    {/* OTP */}

                    {
                        showOtpInput &&
                        <div className="otp-box">

                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />

                            <button
                                type="button"
                                className="otp-btn"
                                onClick={handleVerifyOtp}
                            >
                                Verify OTP
                            </button>

                        </div>
                    }

                    {/* Password */}

                    <div className="input-group">

                        <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e)=>{
                const value=e.target.value;

                setPassword(value);

                validatePassword(value,confirmPassword);
            }}
            className={passwordStatus.type}
            />

                    </div>

                    {/* Confirm Password */}

                    <div className="input-group">

                       <input
type="password"
value={confirmPassword}
placeholder="Confirm Password"
onChange={(e)=>{

    const value=e.target.value;

    setConfirmPassword(value);

    validatePassword(password,value);

}}
className={passwordStatus.type}
/>

                        {
                            passwordStatus.type === "success" &&
                            <span className="success-icon">
                                ✓
                            </span>
                        }

                    </div>

                    {
                        passwordStatus.type === "error" &&
                        <p className="status error">
                            {passwordStatus.message}
                        </p>
                    }

                    <button
                        className="signup-btn"
                        type="submit"
                        disabled={!allowSignup}
                    >
                        Create Account
                    </button>

                    <Link
                        className="login-link"
                        to="/Login"
                    >
                        Already have an account?
                        <strong> Log In</strong>
                    </Link>

                </form>

            </div>

        </div>
    );

};

export default Signup;