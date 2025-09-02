import React, { useContext, useState } from "react";
import "../Styles/LoginStyles.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Data } from "../Context/UserContext";
import { useRef } from "react";
import { toast } from "react-toastify";


const Login = () => {
  const formRef = useRef(null);
  const [Form, setForm] = useState({ password: "", email: "" });
  const { UserName, setUserName } = useContext(Data);
  const [Errmsg, setErrmsg] = useState("");
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const initial_state = { password: "", email: "" };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...Form,
      [name]: value,
    });
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
  const handleSignin = async (e) => {
    e.preventDefault();
    setErrmsg("");
    if (!Form.email.trim() || !Form.password) {
      setErrmsg("Email or Password fields cannot be leaved empty");
      setloading(false);
      setForm(initial_state)
      return;
    }
    setloading(true);
    try {
      const payload = {
        email: Form.email.trim().toLowerCase(),
        password: Form.password,
      };
      const { data } = await axios.post(
        "http://localhost:8000/auth/login",
        Form
      );
      if (data?.success) {
        setUserName(data.name);
        localStorage.setItem("token", JSON.stringify(data.token));
        toast.success("Login successful! 🎉",{position:'top-center'});
        navigate("/dashboard/home");
      } else {
        setErrmsg("Sign in failed");
         toast.error(data.message+' ❌' || "Login failed ❌",{position:'top-center'});
      }
    } catch (error) {
      console.log(error?.response?.data?.message);
      if (error?.response?.status === 401) {
        toast.error(error.response.data.message+' ❌' || "Invalid Credentials ❌",{position:'top-center'});
        return setErrmsg(error.response.data.message || "Invalid Credentials ",);
      }
      setErrmsg(error?.response?.data?.message || "Something went wrong...");
       
    } finally {
      setloading(false);
    }
  };

  return (
    <div id="login_container">
      <div id="login_details">
        <h1 id="login_heading">Log in to your account</h1>
        <h3 id="subheading">Welcome back! Please enter your details</h3>
        <form action="" id="loginform" onSubmit={handleSignin} ref={formRef}>
          <div className="logindiv">
            <label htmlFor="" className="loginlabel">
              Email
            </label>
            <input
              type="email"
              name="email"
              onKeyDown={handleKeyDown}
              value={Form.email}
              onChange={handleChange}
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
              value={Form.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
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
              to="/email_validation"
            >
              Forgot password?
            </Link>
          </div>
          <button id="login_button" type="submit" disabled={loading}>
            {loading ? "Signing in" : "Sign in"}
          </button>
          {Errmsg && (
            <div
              style={{ fontSize: "14px", color: "crimson", marginTop: "12px" }}
            >
              {Errmsg}
            </div>
          )}
        </form>
        <div style={{ marginTop: "20px" }}>
          <span>Don't you have an account? </span>
          <Link
            style={{ textDecoration: "none", fontSize: "16px", color: "blue" }}
            to="/signup"
          >
            Sign up
          </Link>
        </div>
      </div>
      <div id="Login_image">
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

export default Login;
