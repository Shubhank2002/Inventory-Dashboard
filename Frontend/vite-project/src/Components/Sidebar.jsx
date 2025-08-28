import React, { useContext } from "react";
import "../Styles/SidebarStyles.css";
import { Data } from "../Context/UserContext";
import { useNavigate, useParams } from "react-router-dom";

const Sidebar = () => {
  const {selected,setselected}=useContext(Data)
  const navigate=useNavigate()
    const {UserName,setUserName}=useContext(Data)
    const {name}=useParams()

    const handleClick=(render_name)=>{
      
      navigate(`/dashboard/${render_name}`)
    }

  return (
    <div id="Sidebar_container">
      <div id="sidebar_image">
        <img src="/Frame2.png" alt="" />
      </div>
      <hr
        style={{ width: "220px", margin: "0", border: "1px solid #424457" }}
      />
      <div id="sidebar_toogle_container">
        <div className={(name==='home')?'selectedtoogle_container':'toogle_container'} onClick={()=>handleClick('home')}>
          <div>
            <img src="Home_icon.png" alt="" />
          </div>
          <div>Home</div>
        </div>
        <div className="toogle_container" onClick={()=>handleClick('product')}>
          <div>
            <img src="Product_icon.png" alt="" style={{color:'white'}}/>
          </div>
          <div>Product</div>
        </div>
        <div className={(name==='invoice')?'selectedtoogle_container':'toogle_container'} onClick={()=>handleClick('invoice')} >
          <div>
            <img src="Invoice_icon.png" alt="" style={{color:'white'}}/>
          </div>
          <div>Invoice</div>
        </div>
        <div className={(name==='statistics')?'selectedtoogle_container':'toogle_container'} onClick={()=>handleClick('statistics')}>
          <div>
            <img src="Stastics_icon.png" alt="" style={{color:'white'}}/>
          </div>
          <div>Statistics</div>
        </div>
        <div className={(name==='setting')?'selectedtoogle_container':'toogle_container'} onClick={()=>handleClick('setting')}>
          <div>
            <img src="setting_icon.png" alt="" style={{color:'white'}}/>
          </div>
          <div>Setting</div>
        </div>
      </div>
      <div className="bottomsidebarcontainer">
        <div id="bottomsidebarcircle"></div>
        <div style={{color:'white',fontSize:'14px'}}>{UserName}</div>
      </div>
    </div>
  );
};

export default Sidebar;
