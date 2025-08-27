import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/SignupStyles.css";
import axios from "axios";

const Signup = () => {
  const [Form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [Errmsg, setErrmsg] = useState("");
  const [loading, setloading] = useState(false)
  const navigate=useNavigate()

  const handleChange=(e)=>{
    const {name,value}=e.target
    setForm((prev)=>({
      ...prev,[name]:value
    }))
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    if(loading){ return;}
    setErrmsg('')
      if(Form.confirm_password!==Form.password){
        return setErrmsg('Password should match with confirm password')
      }
      if(Form.password.length<8){
        return setErrmsg('Password Should contain at least 8 characters')
      }
      if(!Form.name.trim() || !Form.password.trim() || !Form.email.trim()){
        return setErrmsg('Name or Email or Passwords fields cannot be leaved empty')
      }
      setloading(true)
      try {
        const payload={name:Form.name.trim(),password:Form.password,email:Form.email.trim().toLowerCase()}
        const { data } = await axios.post(
          "http://localhost:8000/auth/signup",
          payload
        );
        if(data?.success){
          navigate('/')
        }else{
          setErrmsg('signup failed')
        }
      } catch (error) {
        setErrmsg(error?.message || 'something went wrong..' )
        
      }finally{
        setloading(false)
      }
    
  };
  return (
    <div id="signup_container">
      <div id="signup_details">
        <h1 id="signup_heading">Create an account</h1>
        <h3 id="signup_subheading">Start inventory management</h3>
        <form action="" id="signupform" onSubmit={handleSignup}>
          <div className="signupdiv">
            <label htmlFor="" className="signuplabel">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={Form.name}
              placeholder="Name"
              className="signup_input"
              onChange={handleChange}
            />
          </div>
          <div className="signupdiv">
            <label htmlFor="" className="signuplabel">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={Form.email}
              placeholder="Example@gmail.com"
              className="signup_input"
              onChange={handleChange}
            />
          </div>
          <div className="signupdiv">
            <label htmlFor="" className="signuplabel">
              Create Password
            </label>
            <input
              type="password"
              name="password"
              value={Form.password}
              placeholder="at least 8 characters"
              className="signup_input"
              onChange={handleChange}
            />
          </div>
          <div className="signupdiv">
            <label htmlFor="" className="signuplabel">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirm_password"
              value={Form.confirm_password}
              placeholder="at least 8 characters"
              className="signup_input"
              onChange={handleChange}
              
            />
          </div>
          {Errmsg && (
            <div style={{ color: "crimson", marginTop: 8, fontSize: 14 }}>{Errmsg}</div>
          )}

          <button id="signup_button" type="submit" disabled={loading}>
            {loading?'Signing up...':'Sign up'}
          </button>
        </form>
        <div style={{ marginTop: "20px" }}>
          <span>Already have an account? </span>
          <Link
            style={{ textDecoration: "none", fontSize: "16px", color: "blue" }}
            to="/"
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
