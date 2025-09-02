import React from "react";
import "./EditProfileStyles.css";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const formRef = useRef(null);
  const navigate=useNavigate()
  const initial_state = {
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirm_password: "",
  };
  const [form, setform] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [Errmsg, setErrmsg] = useState("");
  const [loading, setloading] = useState(false);
  const [bool, setbool] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setform((prev) => ({
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrmsg("");
    setloading(true);
    setbool(false);
    if (!form.fname.trim() || !form.email.trim()) {
      setloading(false);
      setErrmsg("Name or Email field cannot be empty");
      setform(initial_state);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setErrmsg("Please enter a valid email");
      setloading(false);
      setform(initial_state);
      return;
    }
    if (form.confirm_password !== form.password) {
      setErrmsg("Password and Confirm Password are not matching");
      setloading(false);
      setform(initial_state);
      return;
    }
    if (form.password.length < 8) {
      setErrmsg("Password should have at least 8 digits");
      setloading(false);
      setform(initial_state);
      return;
    }
    try {
      const new_form = {
        name: form.fname.trim() + " " + form.lname.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      };
      const jsontoken = localStorage.getItem("token");
      const token = JSON.parse(jsontoken);
      const headers = { Authorization: `Bearer ${token}` };
      const { data } = await axios.post(
        "https://inventory-dashboard-backend-hxjm.onrender.com/other/edit-profile",
        new_form,
        { headers }
      );
      setErrmsg("Profile Edited successfully");
      toast.success("Profile Edited Successfully", { position: "top-center" });
      setbool(true);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "error occured", {
        position: "top-center",
      });
      setErrmsg(error?.response?.data?.message);
    } finally {
      setloading(false);
      setform({
        fname: "",
        lname: "",
        email: "",
        password: "",
        confirm_password: "",
      });
    }
  };
  const logout = () => {
    localStorage.removeItem("token"); // remove JWT
    localStorage.removeItem("user"); // if you stored user details
   navigate('/')   // redirect to login page
  };

  return (
    <div>
      <form
        ref={formRef}
        action=""
        style={{
          alignSelf: "flex-start",
          padding: "5px 15px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
        onSubmit={handleSubmit}
      >
        <div className="settinginputdiv">
          <label htmlFor="" style={{ alignSelf: "flex-start" }}>
            First Name
          </label>
          <input
            type="text"
            value={form.fname}
            name="fname"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="settinginputdiv">
          <label htmlFor="" style={{ alignSelf: "flex-start" }}>
            Last Name
          </label>
          <input
            type="text"
            value={form.lname}
            name="lname"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="settinginputdiv">
          <label htmlFor="" style={{ alignSelf: "flex-start" }}>
            Email
          </label>
          <input
            type="email"
            value={form.email}
            name="email"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="settinginputdiv">
          <label htmlFor="" style={{ alignSelf: "flex-start" }}>
            Password
          </label>
          <input
            type="password"
            value={form.password}
            name="password"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="settinginputdiv">
          <label htmlFor="" style={{ alignSelf: "flex-start" }}>
            Confirm Password
          </label>
          <input
            type="password"
            value={form.confirm_password}
            name="confirm_password"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button id="editProfilebutton" type="submit" disabled={loading}>
          {loading ? "Saving" : "Save"}
        </button>
       
        {Errmsg && (
          <div style={{ fontSize: "16px", color: bool ? "green" : "crimson" }}>
            {Errmsg}
          </div>
        )}
      </form>
       <button id="editLogoutbutton" onClick={logout}>
          Logout
        </button>
    </div>
  );
};

export default EditProfile;
