import React, { useState } from "react";
import "../../Styles/Otp_validationStyles.css";

import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";


const Otp_validation = () => {
  const [otp, setotp] = useState('')
  const navigate=useNavigate()
  const [loading, setloading] = useState(false)
  const [errMsg, seterrMsg] = useState('')
 
  
  const handleClick=async(e)=>{
    e.preventDefault()
    seterrMsg('')
    if(!otp.trim() || typeof otp!=='string'){
      return seterrMsg('Please Enter otp')
    }
    setloading(true)
    try {
      const {data}=await axios.post('http://localhost:8000/auth/verify-otp',{otp})
      if(data.success && data.resettoken){
        toast.success('OTP Validated Successfully',{position:'top-center'})
        navigate('/create_new_password',{replace:true,state:{resettoken:data.resettoken}})
      }
    } catch (error) {
      return seterrMsg(error?.response?.data?.message)
    }finally{
      setloading(false)
    }
  }
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
        <form action="" id="otp_validation_form" onSubmit={handleClick}>
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            <label htmlFor="" style={{textAlign:'left',fontWeight:'600'}}>OTP</label>
            <input type="text" placeholder="xxxx05" id="otp_validation_input" value={otp} onChange={(e)=>setotp(e.target.value)}/>
          </div>
          <button type="submit" disabled={loading} style={{borderRadius:'10px',cursor:'pointer',backgroundColor:'#242531',color:'white',padding:'8px'}}>{loading?'Confirming':"Confirm"}</button>
        </form>
        {errMsg && (
          <div style={{fontSize:"16px",color:'crimson'}}>{errMsg}</div>
        )}
      </div>
      <div id="otp_image">
        <img src="Startup.png" alt="" id="otp_image_1" />
      </div>
    </div>
  );
};

export default Otp_validation;
