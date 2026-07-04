import react from "react";
import { Link,useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile(user) {
const navigate = useNavigate();

return <>
<div className="profile">
  <div><h2>{user.name}</h2></div>
  {/* <p>{user.email}</p> */}
  <button onClick={()=>navigate("/")}>Home</button>
</div>
</>
};

export default Profile;