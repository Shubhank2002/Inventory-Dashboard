import React from "react";
import "../../Styles/Otp_validationStyles.css";

const Otp_validation = () => {
  return (
    <div style={{ display: "flex", width: "100vw" }}>
      <div id="otpdetails">
        <h1 style={{ position: "relative", right: "58px" ,marginBottom:'5px'}}>Enter Your OTP</h1>
        <div style={{position:'relative',right:'38px'}}>
          <h3 style={{ color: "#242531",textAlign:'left',fontWeight:'normal' }}>
            We've sent a 6-digit OTP to your <br /> registered mail. <br />
            Please enter it below to sign in.
          </h3>
        </div>
        <form action="" id="otp_validation_form">
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            <label htmlFor="" style={{textAlign:'left',fontWeight:'600'}}>OTP</label>
            <input type="text" placeholder="xxxx05" id="otp_validation_input"/>
          </div>
          <button style={{borderRadius:'10px',backgroundColor:'#242531',color:'white',padding:'8px',cursor:'pointer'}}>Confirm</button>
        </form>
      </div>
      <div id="otp_image">
        <img src="Startup.png" alt="" id="otp_image_1" />
      </div>
    </div>
  );
};

export default Otp_validation;
