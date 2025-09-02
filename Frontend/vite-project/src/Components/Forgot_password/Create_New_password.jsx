import React from "react";
import "../../Styles/Create_passwordStyles.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";


const Create_New_password = () => {
  const navigate = useNavigate();
  const [Form, setForm] = useState({ password: "", confirm_password: "" });
  const [Errmsg, setErrmsg] = useState("");
  const [loading, setloading] = useState(false);
  const location = useLocation();
  const { resettoken } = location.state;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrmsg("");
    if (!Form.password || !Form.confirm_password) {
      setErrmsg("Enter Both fields");
    }
    if (Form.password !== Form.confirm_password) {
      setErrmsg("both password and confirm password fields should match");
    }
    setloading(true);
    try {
      const { data, status } = await axios.post(
        "https://inventory-dashboard-backend-hxjm.onrender.com/auth/reset-password",
        { password: Form.password, resettoken }
      );
      if (data.success && status === 200) {
        toast.success('Password Changed',{position:'top-center'})
        navigate("/",{replace:true});
      }
    } catch (error) {
      return setErrmsg(error?.response?.data?.message);
    } finally {
      setloading(false);
    }
  };
  return (
    <div style={{ width: "100vw", display: "flex" }}>
      <div id="reset_password_details">
        <h1
          style={{ fontWeight: "normal", position: "relative", right: "40px" }}
        >
          Create New Password
        </h1>
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
        <form action="" id="reset_form" onSubmit={handleSubmit}>
          <div className="new_password_div">
            <label htmlFor="" className="reset_label">
              Enter New Password
            </label>
            <input
              type="password"
              onChange={handleChange}
              className="reset_input"
              placeholder="at least 8 characters"
              name="password"
              value={Form.password}
            />
          </div>
          <div className="new_password_div">
            <label htmlFor="" className="reset_label">
              Confirm Password
            </label>
            <input
              type="password"
              onChange={handleChange}
              className="reset_input"
              placeholder="at least 8 characters"
              name="confirm_password"
              value={Form.confirm_password}
            />
          </div>
          <Link
            style={{
              color: "blue",
              textAlign: "right",
              textDecoration: "none",
            }}
          >
            Forgot Password?
          </Link>
          <button
            type="submit"
            disabled={loading}
            style={{
              color: "white",
              padding: "12px",
              borderRadius: "10px",
              backgroundColor: "#242531",
              cursor: "pointer",
            }}
          >
            {loading ? "Resetting Password" : "Reset Password"}
          </button>
        </form>
        {Errmsg && (
          <div style={{ color: "crimson", fontSize: "16px" }}>{Errmsg}</div>
        )}
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
