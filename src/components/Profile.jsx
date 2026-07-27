import react from "react";
import { useState, useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import "./Profile.css";
import axios from "axios";
import profilePic from '../assets/image.png';

function Profile() {
const navigate = useNavigate();
const user_name=localStorage.getItem("username");
const [useremail,setUserEmail] = useState("");
const [password,setPassword] = useState("");
const [username,setUsername] = useState(user_name);
const [editMode,setEditMode] = useState(false);
const [newPassword,setNewPassword] = useState("");
const [confirmPassword,setConfirmPassword] = useState("");
const [newUsername,setnewUsername] = useState(username);
const [newEmail,setNewEmail] = useState(useremail);
const [passwordError,setPasswordError] = useState("");
const [oldpassword,setOldPassword]= useState("");
const [verified,setVerified]=useState(false);

useEffect(()=>{
loadUser();
},[]);

const validateOldPassword=async(e)=>{
  e.preventDefault();
  try{
const validateRes=await axios.post('/validatePassword',{
  username:username,
  password:oldpassword
});
if (validateRes.status===200){
verified(true);
}else{
  alert("Old password is incorrect");
}
  }
catch(err){
  console.log(err);
}
}

const handleEdit=async(e)=>{
e.preventDefault();
if(newPassword!==confirmPassword){
  setPasswordError("Passwords do not match");
  return;
}
setPasswordError("");
setEditMode(!editMode)
try{
const updateRes=await axios.post('/updateUser',{
  oldusername:username,
  newusername:newUsername,
  email:newEmail,
  password:newPassword  
});
if(updateRes.status===200){
  setUsername(newUsername);
  setUserEmail(newEmail);
  setPassword(newPassword);
  // alert("Profile updated successfully");
}
}
catch(err){
  console.log(err);
}
};
const loadUser = async ()=>{
try{
const responce=await axios.get('/getUserInfo', {
    body: { username }
  });
 if(responce.status===200){ 
  setUserEmail(responce.data.email);
  setPassword(responce.data.password);
  setNewEmail(responce.data.email);
  setNewPassword(responce.data.password);
 }
 else{
  console.log(responce.data.message);
 }
  }
  catch(err){
    console.log(err);
  }
};

return (
  <>
<header className="top-navbar">

    <div className="logo-section">
        <h1>iScheduler</h1>
        <p>Smart Daily Planner</p>
    </div>

    <div className="profile-section">

        <img
            src={profilePic}
            alt="profile"
            className="profile-image"
        />

        <div className="profile-details">
            <h3>{username}</h3>
            <p>Productivity Dashboard</p>
        </div>

    </div>

</header>
    {editMode && (
      <div className="overlay">
        <form className="edit-form">
          <h2>Edit Profile</h2>

          <input
            type="text"
            value={newUsername}
            onChange={(e) => setnewUsername(e.target.value)}
            placeholder="Username"
          />

          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Email"
          />

          <div className="password-row">
            <input
              type="password"
              value={oldpassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Current Password"
            />
            <button
              type="button"
              className="validate-btn"
              onClick={validateOldPassword}
            >
              Validate
            </button>
          </div>

          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
          />

          {passwordError && (
            <p className="error">{passwordError}</p>
          )}

          <div className="form-buttons">
            <button type="submit" onClick={handleEdit}>
              Save Changes
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )}

    <div className="profile">
      <div className="profile-card">
        <div className="avatar">
          {username?.charAt(0).toUpperCase()}
        </div>

        <h2>{username}</h2>

        <div className="info-box">
          <label>Email</label>
          <p>{useremail}</p>
        </div>

        <div className="info-box">
          <label>Password</label>
          <p>••••••••••••</p>
        </div>

        <div className="profile-buttons">
          <button onClick={() => setEditMode(true)}>
            Edit Profile
          </button>

          <button
            className="home-btn"
            onClick={() => navigate("/")}
          >
            Home
          </button>
        </div>
      </div>
    </div>
  </>
)};

export default Profile;