import React from 'react'
import './SmallSidebarStyles.css'
import { useNavigate } from 'react-router-dom'

const SmallSidebar = () => {
    const navigate=useNavigate()

    const handleClick=(name)=>{
        navigate(`/dashboard/${name}`)
    }
  return (
    <div id='SmallSidebarContainer'>
      <h1 className='headersmallsidebar' onClick={()=>handleClick('home')}>Home</h1>
      <h1 className='headersmallsidebar' onClick={()=>handleClick('product')}>Products</h1>
      <h1 className='headersmallsidebar' onClick={()=>handleClick('invoice')}>Invoice</h1>
      <h1 className='headersmallsidebar' onClick={()=>handleClick('statistics')}>Statistics</h1>
    </div>
  )
}

export default SmallSidebar
