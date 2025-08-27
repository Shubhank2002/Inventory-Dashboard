import React, { useState } from 'react'
import Sidebar from '../Sidebar'
import './SettingStyles.css'
import EditProfile from './EditProfile'
import AccountMangement from './AccountMangement'

const Setting = () => {
    const [settingselect, setsettingselect] = useState('editprofile')

    const handleClick=(setting_name)=>{
        if(setting_name==='editprofile'){
            setsettingselect(setting_name)
        }else if(setting_name==='accountmanagement'){
            setsettingselect(setting_name)
        }
    }

  return (
    <div id='settingcontainer'>
      <Sidebar/>
      <div id='settingrightpart'>
        <div id='settingupperdiv'>
            <h1 style={{fontSize:'20px',color:'white',fontWeight:'normal',textAlign:'left',marginBottom:'6px'}}>Setting</h1>
        </div>
        <div id='settingformdiv'>
            <div style={{display:"flex",gap:'45px',borderBottom:'1px solid black',}}>
                <div style={{borderBottom:(settingselect==='editprofile') && ('2px solid black'),cursor:'pointer'}} onClick={()=>handleClick('editprofile')}>Edit Profile</div>
                <div style={{cursor:'pointer',borderBottom:(settingselect==='accountmanagement') && ('2px solid black')}} onClick={()=>handleClick('accountmanagement')}>Account management</div>
            </div>
            {(settingselect==='editprofile')?(
                <EditProfile/>
            ):(
                <AccountMangement/>
            )}
        </div>
      </div>
    </div>
  )
}

export default Setting
