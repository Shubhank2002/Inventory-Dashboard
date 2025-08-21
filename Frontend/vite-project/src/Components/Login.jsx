import React from "react";
import "../Styles/LoginStyles.css";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div id="login_container">
      <div id="login_details">
        <h1 id="login_heading">Log in to your account</h1>
        <h3 id="subheading">Welcome back! Please enter your details</h3>
        <form action="" id="loginform">
          <div className="logindiv">
            <label htmlFor="" className="loginlabel">
              Email
            </label>
            <input
              type="email"
              name="email"
              id=""
              placeholder="Example@gmail.com"
              className="login_input"
            />
          </div>
          <div className="logindiv">
            <label htmlFor="" className="loginlabel">
              Password
            </label>
            <input
              type="password"
              name="password"
              id=""
              placeholder="at least 8 characters"
              className="login_input"
            />
          </div>
          <div style={{ alignSelf: "flex-end" }}>
            <Link
              style={{
                textDecoration: "none",
                fontSize: "14px",
                color: "blue",
              }}
              to='/email_validation'
            >
              Forgot password?
            </Link>
          </div>
          <button id="login_button">Sign in</button>
        </form>
        <div style={{ marginTop: "20px" }}>
          <span>Don't you have an account? </span>
          <Link
            style={{ textDecoration: "none", fontSize: "16px", color: "blue" }}
            to='/signup'
          >
            Sign up
          </Link>
        </div>
      </div>
      <div id="Login_image">
        <div className="upper_div">
          <h1 style={{textAlign:'left',color:'white',fontSize:'48px',fontWeight:'normal'}}>Welcome to <br />Company Name</h1>
          <div>
            <img src="Login_Frame.png" alt="" />
          </div>
        </div>
        <div style={{width:'782px', height:'479px', alignSelf:'flex-start'}}>
            <img src="Login_image.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Login;
