import React from 'react'
import { useParams } from 'react-router-dom'
import Home from './Home/Home'
import Setting from './Setting/Setting'
import Invoice from './Invoice/Invoice'
import Product from './Product/Product'
import Statistics from './Statistics/Statistics'

const Dashboard = () => {
    const {name}=useParams()
  return (
    <div>
      {(name==='home') && (
        <Home/>
      )}
      {(name==='setting') && (
        <Setting/>
      )}
      {(name==='invoice') && (
        <Invoice/>
      )}
      {(name==='product') && (
        <Product/>
      )}

      {(name==='statistics') && (
        <Statistics/>
      )}
    </div>
  )
}

export default Dashboard
