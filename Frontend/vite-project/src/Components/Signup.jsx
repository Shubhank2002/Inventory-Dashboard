import React from "react";
import { Link } from "react-router-dom";
import '../Styles/SignupStyles.css'

const Signup = () => {
  return (
    <div id="signup_container">
      <div id="signup_details">
        <h1 id="signup_heading">Create an account</h1>
        <h3 id="signup_subheading">Start inventory management</h3>
        <form action="" id="signupform">
          <div className="signupdiv">
            <label htmlFor="" className="signuplabel">
              Name
            </label>
            <input
              type="text"
              name="name"
              id=""
              placeholder="Name"
              className="signup_input"
            />
          </div>
          <div className="signupdiv">
            <label htmlFor="" className="signuplabel">
              Email
            </label>
            <input
              type="email"
              name="email"
              id=""
              placeholder="Example@gmail.com"
              className="signup_input"
            />
          </div>
          <div className="signupdiv">
            <label htmlFor="" className="signuplabel">
              Create Password
            </label>
            <input
              type="password"
              name="password"
              id=""
              placeholder="at least 8 characters"
              className="signup_input"
            />
          </div>
          <div className="signupdiv">
            <label htmlFor="" className="signuplabel">
              Confirm Password
            </label>
            <input
              type="password"
              name=""
              id=""
              placeholder="at least 8 characters"
              className="signup_input"
            />
          </div>
          
          <button id="signup_button">Sign in</button>
        </form>
        <div style={{ marginTop: "20px" }}>
          <span>Already have an account? </span>
          <Link
            style={{ textDecoration: "none", fontSize: "16px", color: "blue" }}
            to='/'
          >
            Sign in
          </Link>
        </div>
      </div>
      <div id="signup_image">
        <div className="upper_div">
          <h1
            style={{
              textAlign: "left",
              color: "white",
              fontSize: "48px",
              fontWeight: "normal",
            }}
          >
            Welcome to <br />
            Company Name
          </h1>
          <div>
            <img src="Login_Frame.png" alt="" />
          </div>
        </div>
        <div
          style={{ width: "782px", height: "479px", alignSelf: "flex-start" }}
        >
          <img src="Login_image.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Signup;
