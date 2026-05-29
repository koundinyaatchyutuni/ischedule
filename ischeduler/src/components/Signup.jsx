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
          password
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

        <button type="submit">
          Sign Up
        </button>

      </form>
    </div>
  );
};

export default Signup;