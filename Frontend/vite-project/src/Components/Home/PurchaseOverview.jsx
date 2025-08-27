import React from 'react'
import './PurchaseOverviewStyles.css'

const PurchaseOverview = () => {
  return (
    <div id='purchaseoverviewcontainer'>
      <h1 style={{fontWeight:'normal',textAlign:'left', marginLeft:'15px',fontSize:'24px',marginBottom:'9px'}}>Purchase Overview</h1>
      <div style={{display:'flex',justifyContent:'space-around'}}>
        <div id='purchaseimagepara'>
            <div className='purchaseimagecontainer'>
                <img src="/Home_assets/purchase.png" alt="" />
            </div>
            <div id='purchasepara'>
                <p style={{fontWeight:'bold'}}>82</p>
                <p>Purchase</p>
            </div>
        </div>
        <div id='purchaseimagepara'>
            <div className='purchaseimagecontainer'>
                <img src="/Home_assets/cost2.png" alt="" />
            </div>
            <div id='purchasepara'>
                <p style={{fontWeight:'bold'}}>13,573</p>
                <p>Cost</p>
            </div>
        </div>
        <div id='purchaseimagepara'>
            <div className='purchaseimagecontainer'>
                <img src="/Home_assets/cancel.png" alt="" />
            </div>
            <div id='purchasepara'>
                <p style={{fontWeight:'bold'}}>5</p>
                <p>Cancel</p>
            </div>
        </div>
        <div id='purchaseimagepara'>
            <div className='purchaseimagecontainer'>
                <img src="/Home_assets/return.png" alt="" />
            </div>
            <div id='purchasepara'>
                <p style={{fontWeight:'bold'}}>17432</p>
                <p>Return</p>
            </div>
        </div>
      </div>
    </div>
  )
}

export default PurchaseOverview
