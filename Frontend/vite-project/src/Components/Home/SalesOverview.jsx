import React from 'react'
import './SalesOverviewStyles.css'

const SalesOverview = ({salesOverview}) => {
  return (
    <div id='salesoverviewcontainer'>
      <h1 style={{textAlign:'left',marginLeft:'25px',fontWeight:'normal',fontSize:'24px',marginBottom:'9px'}}>Sales Overview</h1>
      <div style={{display:'flex',justifyContent:'space-around'}}>
        <div className='imagepara_container'>
            <div className='salesimagecontainer'>
                <img src='/Home_assets/sales.png' alt="" />
            </div>
            <div className='para_container'>
                <p className='para1'>{salesOverview.sales}</p>
                <p>Sales</p>
            </div>
        </div>
        <div className='imagepara_container'>
            <div className='salesimagecontainer'>
                <img src='/Home_assets/revenue.png' alt="" />
            </div>
            <div className='para_container'>
                <p className='para1'>{salesOverview.revenue}</p>
                <p>revenue</p>
            </div>
        </div>
        <div className='imagepara_container'>
            <div className='salesimagecontainer'>
                <img src='/Home_assets/profit.png' alt="" />
            </div>
            <div className='para_container'>
                <p className='para1'>{salesOverview.profit}</p>
                <p>Profit</p>
            </div>
        </div>
        <div className='imagepara_container'>
            <div className='salesimagecontainer'>
                <img src='/Home_assets/cost.png' alt="" />
            </div>
            <div className='para_container'>
                <p className='para1'>{salesOverview.cost}</p>
                <p>cost</p>
            </div>
        </div>
      </div>
    </div>
  )
}

export default SalesOverview
