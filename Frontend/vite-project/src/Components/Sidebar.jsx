import React from "react";
import "../Styles/SidebarStyles.css";

const Sidebar = () => {
  return (
    <div id="Sidebar_container">
      <div id="sidebar_image">
        <img src="Frame2.png" alt="" />
      </div>
      <hr
        style={{ width: "220px", margin: "0", border: "1px solid #424457" }}
      />
      <div id="sidebar_toogle_container">
        <div className="toogle_container">
          <div>
            <img src="Home_icon.png" alt="" />
          </div>
          <div>Home</div>
        </div>
        <div className="toogle_container">
          <div>
            <img src="Product_icon.png" alt="" style={{color:'white'}}/>
          </div>
          <div>Product</div>
        </div>
        <div className="toogle_container">
          <div>
            <img src="Invoice_icon.png" alt="" style={{color:'white'}}/>
          </div>
          <div>Invoice</div>
        </div>
        <div className="toogle_container">
          <div>
            <img src="Stastics_icon.png" alt="" style={{color:'white'}}/>
          </div>
          <div>Statistics</div>
        </div>
        <div className="toogle_container">
          <div>
            <img src="setting_icon.png" alt="" style={{color:'white'}}/>
          </div>
          <div>Setting</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
