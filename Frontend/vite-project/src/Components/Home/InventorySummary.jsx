import React from "react";
import "./InventorySummaryStyles.css";

const InventorySummary = () => {
  return (
    <div id="inventorysummarycontainer">
      <h1 style={{fontSize:'24px',fontWeight:'normal',marginBottom:'7px'}}>Inventory Summary</h1>
      <div style={{display:'flex',justifyContent:'space-around'}}>
        <div className="inventoryimagepara">
          <div>
            <img src="Home_assets/quantity_available.png" alt="" />
          </div>
          <div style={{ fontSize: "14px", fontWeight: "bold" }}>868</div>
          <div style={{ fontSize: "14px" }}>Quantity in Hand</div>
        </div>
        <div className="inventoryimagepara">
          <div>
            <img src="Home_assets/tobereceived.png" alt="" />
          </div>
          <div style={{ fontSize: "14px", fontWeight: "bold" }}>200</div>
          <div style={{ fontSize: "14px" }}>To be received</div>
        </div>
      </div>
    </div>
  );
};

export default InventorySummary;
