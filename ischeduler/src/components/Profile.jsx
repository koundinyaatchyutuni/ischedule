import react from "react";
import { useState, useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import "./Profile.css";
import axios from "axios";


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

return <>
{editMode &&  <form className="edit-form">
  <input type="text" value={newUsername} onChange={(e)=>setnewUsername(e.target.value)} placeholder="Username" />
  <input type="email" value={newEmail} onChange={(e)=>setNewEmail(e.target.value)} placeholder="Email" />
  <input type="password" value={oldpassword} onChange={(e)=>setOldPassword(e.target.value)} placeholder='OldPassword'/> <button onClick={validateOldPassword}>Validate</button>
    <input type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} placeholder="Password" />
  <input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
  {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
  <button type="submit" onClick={handleEdit}>Save</button>
  </form>}
<div className="profile">
  <div><h2>{username}</h2></div>
  <div><h3>{useremail}</h3></div>
  <div><h3>{password}</h3></div>
  <button onClick={()=>setEditMode(!editMode)}>Edit</button>
  <button onClick={()=>navigate("/")}>Home</button>
</div>
</>
};

export default Profile;