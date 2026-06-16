import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import './Signup.css';

const Signup = () => {

  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [helperText, setHelperText] = useState('');
  const[usermail,setUsermail]=useState('');
  const [showVerifyButton,setShowVerifyButton]=useState(false);
  const [showOtpInput,setShowOtpInput]=useState(false);
  const [otp,setOtp]=useState('');
  const [sentOtp,setSentOtp]=useState('');
  const [allowSignup,setallowSignup]=useState(false);


  const finduser = async (username) => {
    try {
      const result = await axios.post(
        'http://localhost:3001/finduser',
        { username }
      );

      return result.data;

    } catch (error) {
      console.error("Error finding user:", error);

      return {
        status: "error"
      };
    }
  };

  const handleUsernameChange = async (e) => {

    const value = e.target.value;

    setUsername(value);

    const data = await finduser(value);

    if (data.status === "exists") {
      setUsernameError("Username already exists");
      setHelperText("red");
    }
    else {
      setUsernameError("username is available");
      setHelperText("blue");
    }
  };

  const handleVerifyEmail = async () => {
    try{
      const result = await axios.post(
        'http://localhost:3001/sendotp',
        { email: usermail }
      );
      if (result.status===200){
        // alert("OTP sent to email");
        setShowOtpInput(true);
        setSentOtp(result.data.otp);
      }else{
        alert("Failed to send OTP");
      }
    }
    catch(error){
      console.error("Error verifying email:", error);
    }
  };

const handleVerifyOtp=()=>{
  if (String(otp) === String(sentOtp)) {
  setallowSignup(true);
  setShowOtpInput(false);
  setShowVerifyButton(false);
}
}

  const handlesubmit = async (e) => {

    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (username === '' || password === '') {
      alert("Username and Password cannot be empty");
      return;
    }

    try {

      const result = await axios.post(
        'http://localhost:3001/signup',
        {
          username,
          password,
          email:usermail
        }
      );

      if (result.data.status === "success") {
        alert("User registered successfully");
        navigate("/Login");
      }
      else {
        alert("User registration failed");
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='signup-container'>

      <h2>Sign Up</h2>

      <form onSubmit={handlesubmit}>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
          style={{
            borderColor: helperText}
          }
        />
        <div>
        <input type="email" placeholder="Email" onChange={(e) => {setUsermail(e.target.value); setShowVerifyButton(true)}} required />
        {showVerifyButton && <button type="button" onClick={handleVerifyEmail}>verify</button>}
        {showOtpInput && (
          <div>
            <input type="text" placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} required />
            <button type="button" onClick={handleVerifyOtp}>Submit OTP</button>
          </div>
        )}
        </div>
        <p className='error-message' style={{ color: helperText === 'red' ? 'red' : 'green' }}>
          {usernameError}
        </p>

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          onChange={(e) => {

            setConfirmPassword(e.target.value);

            if (password !== e.target.value) {
              setPasswordError("Passwords do not match");
            }
            else {
              setPasswordError("");
            }
          }}
          style={{
            borderColor: passwordError ? 'red' : ''
          }}
        />

        <p className='error-message' style={{ color: helperText === 'red' ? 'red' : 'green' }}>
          {passwordError}
        </p>

        <Link to='/Login'>
          Already have an account? Log in
        </Link>

        <button type="submit" disabled={!allowSignup} onMouseOver={(e) => {
          if (!allowSignup) {
            e.target.style.cursor = "not-allowed";
          } else {
            e.target.style.cursor = "pointer";        
          }
        }}>
          Sign Up
        </button>

      </form>
    </div>
  );
};

export default Signup;