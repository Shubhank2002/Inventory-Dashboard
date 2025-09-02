import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/SignupStyles.css";
import axios from "axios";
import { useRef } from "react";
import { toast } from "react-toastify";


const Signup = () => {
  const formRef = useRef(null);
  const [Form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const initial_state = {
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  };
  const [Errmsg, setErrmsg] = useState("");
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // stop default submit on Enter

      const form = formRef.current;
      const inputs = Array.from(form.querySelectorAll("input"));
      const index = inputs.indexOf(e.target);

      if (index < inputs.length - 1) {
        // 🔹 Focus next input
        inputs[index + 1].focus();
      } else {
        // 🔹 Last input → submit form
        form.requestSubmit(); // modern way to submit
      }
    }
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    setloading(true);
    setErrmsg("");
    if (Form.confirm_password !== Form.password) {
      setErrmsg("Password should match with confirm password");
      setloading(false);
      setForm(initial_state);
      return;
    }
    if (Form.password.length < 8) {
      setErrmsg("Password Should contain at least 8 characters");
      setloading(false);
      setForm(initial_state);
      return;
    }
    if (!Form.name.trim() || !Form.password.trim() || !Form.email.trim()) {
      setErrmsg("Name or Email or Passwords fields cannot be leaved empty");
      setloading(false);
      setForm(initial_state);
      return;
    }

    try {
      const payload = {
        name: Form.name.trim(),
        password: Form.password,
        email: Form.email.trim().toLowerCase(),
      };
      const { data } = await axios.post(
        "http://localhost:8000/auth/signup",
        payload
      );
      if (data?.success) {
        toast.success('User Created Successfully',{position:'top-center'})
        navigate("/");
      } else {
        setErrmsg("signup failed");
      }
    } catch (error) {
      setErrmsg(error?.message || "something went wrong..");
    } finally {
      setloading(false);
    }
  };
  return (
    <div id="signup_container">
      <div id="signup_details">
        <h1 id="signup_heading">Create an account</h1>
        <h3 id="signup_subheading">Start inventory management</h3>
        <form action="" id="signupform" onSubmit={handleSignup} ref={formRef}>
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
              onKeyDown={handleKeyDown}
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
              onKeyDown={handleKeyDown}
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
              onKeyDown={handleKeyDown}
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
              onKeyDown={handleKeyDown}
            />
          </div>
          {Errmsg && (
            <div style={{ color: "crimson", marginTop: 8, fontSize: 14 }}>
              {Errmsg}
            </div>
          )}

          <button id="signup_button" type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign up"}
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
