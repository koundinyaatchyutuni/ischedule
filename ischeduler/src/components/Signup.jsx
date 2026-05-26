import React,{useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import './Signup.css';
const Signup = () => {
  
    const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const handlesubmit=async (e)=>{
    e.preventDefault();
    if(password !== confirmPassword){
      alert("Passwords do not match");
      return;
    }
    else{
      const result= await axios.post("http://localhost:3001/signup",{username,password});
      if(result.data.status === "success"){
        alert("User registered successfully");
        navigate("/Login");
      }
      else{
        alert("User registration failed");
      }
    }
  }
  return (
    <div className='signup-container'>
      <h2>Sign Up</h2>
      <form onSubmit={handlesubmit}>
        <input type="text" placeholder="Username" onChange={(e)=> setUsername(e.target.value)}/>
        <input type="password" placeholder="Password" onChange={(e)=> setPassword(e.target.value)}/>
        <input type="password" placeholder="Confirm Password" onChange={(e)=> setConfirmPassword(e.target.value)}/>
        <Link to='/Login'>Already have an account? Log in</Link>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}

export default Signup;
