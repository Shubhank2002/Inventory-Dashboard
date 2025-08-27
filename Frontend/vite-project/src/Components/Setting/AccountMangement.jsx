import React from "react";
import "./AccountMangementStyles.css";

const AccountMangement = () => {
  return (
    <div id="accountmanagementcontainer">
      <div id="accountverifiedcontainer">
        <h1
          style={{ color: "#5E5E5E", fontSize: "17.28px", fontWeight: "bold" }}
        >
          Identity verification
        </h1>
        <h3 style={{ fontSize: "16px", fontWeight: "normal" }}>verified</h3>
      </div>
      <div>
        <h1
          style={{ color: "#5E5E5E", fontSize: "17.28px", fontWeight: "bold",width:'600px' }}
        >
          Add Accounts
        </h1>
        <div id="checkboxcontainer">
          <div>
            <input type="checkbox" name="" id="" />
            <label htmlFor="">Account@gmail.com</label>
          </div>
          <button style={{ display: "flex", gap: "5px",alignItems:'center',width:'140px',height:'46px',justifyContent:'center',alignSelf:'flex-end',borderRadius:'10px',backgroundColor:'white',boxShadow:'0 8px 12px rgba(0, 0, 0, 0.1)',border:'1px solid black' }}>
            <img src="/delete.png" alt="" />
            Delete
          </button>
           <div>
            <input type="checkbox" name="" id="" />
            <label htmlFor="">Account@gmail.com</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountMangement;
