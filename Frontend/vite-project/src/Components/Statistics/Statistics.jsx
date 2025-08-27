import React from 'react'
import Sidebar from '../Sidebar'
import './StatisticsStyles.css'
import Searchere from '../Searchere'

const Statistics = () => {
  return (
    <div id='statisticscontainer'>
      <Sidebar/>
      <div id='statisticsrightpart'>
        <div id='statisticstopdiv'>
            <h1 style={{margin:'5px 0px',fontSize:'18px',color:'white'}}>Statistics</h1>
            <Searchere/>
        </div>
        <div id='Statisticsseconddiv'>
            <div className='statisticscolorbox' style={{backgroundColor:'#FAD85D',borderRadius:'5px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0px 15px'}}>
                    <p style={{fontFamily:'Inter',fontSize:'14px'}}>Total Revenue</p>
                    <div>
                        <img src="/dollar-sign.png" alt="" />
                    </div>
                </div>
                <div>
                    <h1 style={{margin:'0px',fontSize:'24px'}}>2,32,875</h1>
                    <p style={{margin:'0px'}}>+20.1% from last month</p>
                </div>
            </div>
            <div className='statisticscolorbox' style={{backgroundColor:'#0BF4C8',borderRadius:'5px'}}>
                 <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0px 15px'}}>
                    <p style={{fontFamily:'Inter',fontSize:'14px'}}>Products Sold</p>
                    <div>
                        <img src="/credit-card.png" alt="" />
                    </div>
                </div>
                <div>
                    <h1 style={{margin:'0px',fontSize:'24px'}}>8,294</h1>
                    <p style={{margin:'0px'}}>+180.1% from last month</p>
                </div>
                
            </div>
            <div className='statisticscolorbox' style={{backgroundColor:'#F2A0FF',borderRadius:'5px'}}>
                 <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0px 15px',height:'44px'}}>
                    <p style={{margin:'0px'}}>Products in Stock</p>
                    <div>
                        <img src="/activity.png" alt="" />
                    </div>
                </div>
                <div>
                    <h1 style={{margin:'0px',fontSize:'24px'}}>234</h1>
                    <p style={{margin:'0px'}}>+19% from last month</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Statistics
