import React, { useState } from "react";
import "../../Styles/Email_validationStyles.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Email_validation = () => {
  const navigate=useNavigate()
  const [input, setinput] = useState("")
  const [errMsg, seterrMsg] = useState("")
  const [loading, setloading] = useState(false)

  const handleClick=async(e)=>{
    e.preventDefault()
    seterrMsg('')
    if(!input.trim() || typeof input!=='string'){
      return seterrMsg("please Enter input")
    }
    
    setloading(true)
    try {
      const response=await axios.post('http://localhost:8000/auth/forgot-password',{email:input.trim().toLowerCase()})
      if(response.data.success && response.data.otpSent){
        navigate('/otp_validation')
      }else{
        return seterrMsg(response.data.message)
      }
    } catch (error) {
      return seterrMsg(error?.response?.data?.message)
    }finally{
      setloading(false)
    }

  }
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
        <form action="" id="Email_validation_form" onSubmit={handleClick}>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label htmlFor="" style={{ textAlign: "left" }}>
              E-mail
            </label>
            <input
              type="email"
              id="Email_validation_input"
              value={input}
              onChange={(e)=>setinput(e.target.value)}
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
              cursor:'pointer'
            }}
            disabled={loading}
           type="submit"
          >
             {loading?'Sending Mail':'Send Mail'}
          </button>
        </form>
        {errMsg && (
          <div style={{color:'crimson',fontSize:'16px'}}>{errMsg}</div>
        )}
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
