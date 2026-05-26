import React, { useState } from "react";
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

function Login() {

  const navigate = useNavigate();

  const [username, setUser] = useState('');
  const [password, setPassword] = useState('');

  const handlesubmit = async (e) => {

    e.preventDefault();

    try {

      const result = await axios.post(
        "http://localhost:3001/login",
        {
          username,
          password
        }
      );

      if(result.data.status === "success"){

        navigate("/");
      }
      else{

        alert("Invalid Username or Password");
      }

    }
    catch(err){

      console.log(err);
    }
  }

  return (

    <div className="login-container">

      <form onSubmit={handlesubmit}>

        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUser(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>

        <Link to="/signup">
          <button type="button">Sign Up</button>
        </Link>

      </form>

    </div>
  );
}

export default Login;