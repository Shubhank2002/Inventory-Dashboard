import React from "react";
import "../../Styles/Email_validationStyles.css";

const Email_validation = () => {
  return (
    <div id="email_validation_container">
      <div id="email_validation_details">
        <div>
          <h1 style={{position:'relative',right:'55px',fontWeight:'600'}}>Company Name</h1>
        </div>
        <div>
          <h3
            style={{
              fontWeight: "normal",
              color: "#242531",
              textAlign: "left",
            }}
          >
            Please enter your registered email ID to <br />
            receive an OTP
          </h3>
        </div>
        <form action="" id="Email_validation_form">
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label htmlFor="" style={{ textAlign: "left" }}>
              E-mail
            </label>
            <input
              type="email"
              id="Email_validation_input"
              placeholder="Enter your registered email"
              style={{
                borderRadius: "8px",
                border: "1px solid white",
                color: "#9A9A9A",
                padding: "8px",
              }}
            />
          </div>
          <button
            style={{
              color: "white",
              borderRadius: "10px",
              backgroundColor: "#242531",
              padding: "8px",
            }}
          >
            Send Mail
          </button>
        </form>
      </div>
      <div id="email_validation_image">
        <img
          src="Women_Web_Developer_with_laptop.png"
          style={{ width: "800px", height: "600px" }}
          alt=""
        />
      </div>
    </div>
  );
};

export default Email_validation;
