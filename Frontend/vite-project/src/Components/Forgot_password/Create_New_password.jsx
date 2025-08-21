import React from "react";
import "../../Styles/create_passwordStyles.css";
import { Link } from "react-router-dom";

const Create_New_password = () => {
  return (
    <div style={{ width: "100vw", display: "flex" }}>
      <div id="reset_password_details">
        <h1 style={{ fontWeight: "normal" ,position:'relative',right:'40px'}}>Create New Password</h1>
        <div>
          <h3
            style={{
              textAlign: "left",
              fontWeight: "normal",
              color: "#242531",
            }}
          >
            Today is a new day.It's your day. You shape it. <br />
            Sign in to start managing your projects.
          </h3>
        </div>
        <form action="" id="reset_form">
          <div className="new_password_div">
            <label htmlFor="" className="reset_label">Enter New Password</label>
            <input type="text" className="reset_input" placeholder="at least 8 characters"/>
          </div>
          <div className="new_password_div">
            <label htmlFor="" className="reset_label">Enter New Password</label>
            <input type="text" className="reset_input" placeholder="at least 8 characters"/>
          </div>
          <Link style={{color:'blue',textAlign:'right',textDecoration:"none"}}>Forgot Password?</Link>
          <button style={{color:'white',padding:'12px',borderRadius:'10px', backgroundColor:'#242531',cursor:'pointer'}}>Reset Password</button>
        </form>
      </div>
      <div id="reset_image">
        <img
          src="Group.png"
          alt=""
          style={{ width: "652px", height: "476px" }}
        />
      </div>
    </div>
  );
};

export default Create_New_password;
