import React from 'react'
import './ProductSummaryStyles.css'

const ProductSummary = ({productSummary}) => {
  return (
    <div id='productsummarycontainer'>
      <h1 style={{fontWeight:'normal',fontSize:'24px',marginBottom:'4px',marginTop:'5px'}}>Product Summary</h1>
      <div style={{display:'flex',justifyContent:'space-around'}}>
        <div className='productimagepara'>
            <div className='productimagecontainer'>
                <img src="/Home_assets/noofsuppliers.png" alt="" />
            </div>
            <div className='productpara'>
                <p>{productSummary.numberOfSuppliers}</p>
                <p>Number of <br /> Suppliers</p>
            </div>
        </div>
        <div className='productimagepara'>
            <div className='productimagecontainer'>
                <img src="/Home_assets/noofcategories.png" alt="" />
            </div>
            <div className='productpara'>
                <p>{productSummary.numberOfCategories}</p>
                <p>Number of <br /> Categories</p>
            </div>
        </div>
      </div>
    </div>
  )
}

export default ProductSummary
