import React from 'react'
import './EditProfileStyles.css'

const EditProfile = () => {
  return (
    <div>
      <form action="" style={{alignSelf:'flex-start',padding:'5px 15px',display:'flex',flexDirection:'column',gap:'15px'}}>
                <div className='settinginputdiv'>
                    <label htmlFor="" style={{alignSelf:'flex-start'}}>First Name</label>
                    <input type="text" />
                </div>
                <div className='settinginputdiv'>
                    <label htmlFor="" style={{alignSelf:'flex-start'}}>Last Name</label>
                    <input type="text" />
                </div>
                <div className='settinginputdiv'>
                    <label htmlFor="" style={{alignSelf:'flex-start'}}>Email</label>
                    <input type="email" />
                </div>
                <div className='settinginputdiv'>
                    <label htmlFor="" style={{alignSelf:'flex-start'}}>Password</label>
                    <input type="password" />
                </div>
                <div className='settinginputdiv'>
                    <label htmlFor="" style={{alignSelf:'flex-start'}}>Confirm Password</label>
                    <input type="password" />
                </div>
                <button id='editProfilebutton'>Save</button>
            </form>
    </div>
  )
}

export default EditProfile
