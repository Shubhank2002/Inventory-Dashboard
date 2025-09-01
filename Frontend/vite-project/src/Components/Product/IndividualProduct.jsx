import React, { useRef, useState } from "react";
import "./InvidualProduct.css";
import { Form, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Sidebar";
import Searchere from "../Searchere";
import axios from "axios";


const IndividualProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    productId: "",
    category: "",
    price: "",
    quantity: "",
    unit: "",
    expiry: "",
    threshold: "",
    costPrice:''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageFile(file)
    }
  };

  const handleDiscard = () => {
    setForm({
      name: "",
      productId: "",
      category: "",
      price: "",
      quantity: "",
      unit: "",
      expiry: "",
      threshold: "",
      costPrice:''
    });
    setImageFile(null);
    setImagePreview("");
  };
  const browse = () => document.getElementById("ip-file").click();
  const handleSubmit = async(e) => {
    e.preventDefault();
    const newForm=new FormData()
    newForm.append('name',form.name.trim().toLowerCase())
    newForm.append('price',Number(form.price))
    newForm.append('quantity',Number(form.quantity))
    newForm.append('expiryDate',String(form.expiry))
    newForm.append('category',form.category.trim().toLowerCase())
    newForm.append('threshold',Number(form.threshold))
    newForm.append('unit',form.unit.trim().toLowerCase())
    newForm.append('productId',form.productId)
    newForm.append('costPrice',form.costPrice)

    if(imageFile){
        newForm.append('image',imageFile)
    }
    try {
        const jsontoken = localStorage.getItem("token");
          const token = JSON.parse(jsontoken);
          const headers = { Authorization: `Bearer ${token}` };
        const {data,status}=await axios.post('http://localhost:8000/product/single',newForm,{headers})
        if(!data.success){
            throw new Error('Upload Failed')
        }
    } catch (error) {
        console.error(error)
        alert('something went wrong while uploading')
    }finally{
        handleDiscard()
    }
   
  };

  return (
    <div className="ipage">
      <Sidebar />
      <div id="iright">
        <header className="itopbar">
          <div className="ititle">Product</div>
          <Searchere />
        </header>
        {/* Content */}
        <div className="icontent">
          <div className="ibreadcrumb">
            <span
              onClick={() => navigate("/dashboard/product")}
              style={{ cursor: "pointer" }}
            >
              Add Product
            </span>
            <span className="sep">›</span>
            <span className="current">Individual Product</span>
          </div>

          <section className="icard">
            <h2
              className="icard-title"
              style={{
                color: "#616161",
                fontSize: "20px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              New Product
            </h2>

            <form className="iform" onSubmit={handleSubmit}>
              {/* Image uploader */}
              {/* === Row 1: Image box (left) + hint text (right) === */}
              <div className="iupload-row">
                <div className="iuploader" role="button" onClick={browse}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" />
                  ) : (
                    <span className="ibox-dots" />
                  )}
                  <input
                    id="ip-file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </div>

                <div className="iupload-hint">
                  <div className="hint-line">Drag image here</div>
                  <div className="hint-or">or</div>
                  <button type="button" className="ubrowse" onClick={browse}>
                    Browse image
                  </button>
                </div>
              </div>

              {/* Input fields */}
              <div className="ifields">
                <label className="ifield">
                  <span className="ifield-label">Product Name</span>
                  <input
                    name="name"
                    className="ifield-input"
                    value={form.name}
                    onChange={onInputChange}
                    placeholder="Enter product name"
                    required
                  />
                </label>

                <label className="ifield">
                  <span className="ifield-label">Product ID</span>
                  <input
                    name="productId"
                    className="ifield-input"
                    value={form.productId}
                    onChange={onInputChange}
                    placeholder="Enter product ID"
                    required
                  />
                </label>

                <label className="ifield">
                  <span className="ifield-label">Category</span>
                  <input
                    name="category"
                    className="ifield-input"
                    value={form.category}
                    onChange={onInputChange}
                    placeholder="Enter product Category"
                    required
                  />
                </label>

                <label className="ifield">
                  <span className="ifield-label">Cost Price</span>
                  <input
                    type="number"
                    name="costPrice"
                    className="ifield-input"
                    value={form.costPrice}
                    onChange={onInputChange}
                    placeholder="Enter price"
                    required
                  />
                </label>
                <label className="ifield">
                  <span className="ifield-label">Selling Price</span>
                  <input
                    type="number"
                    name="price"
                    className="ifield-input"
                    value={form.price}
                    onChange={onInputChange}
                    placeholder="Enter price"
                    required
                  />
                </label>

                <label className="ifield">
                  <span className="ifield-label">Quantity</span>
                  <input
                    type="number"
                    name="quantity"
                    className="ifield-input"
                    value={form.quantity}
                    onChange={onInputChange}
                    placeholder="Enter product quantity"
                  />
                </label>

                <label className="ifield">
                  <span className="ifield-label">Unit</span>
                  <input
                    name="unit"
                    value={form.unit}
                    className="ifield-input"
                    onChange={onInputChange}
                    placeholder="Enter product unit"
                  />
                </label>

                <label className="ifield">
                  <span className="ifield-label">Expiry Date</span>
                  <input
                    type="date"
                    name="expiry"
                    value={form.expiry}
                    className="ifield-input"
                    onChange={onInputChange}
                  />
                </label>

                <label className="ifield">
                  <span className="ifield-label">Threshold Value</span>
                  <input
                    type="number"
                    name="threshold"
                    value={form.threshold}
                    className="ifield-input"
                    onChange={onInputChange}
                    placeholder="Enter threshold value"
                  />
                </label>
              </div>

              {/* Actions */}
              <div className="iactions">
                <button
                  type="button"
                  className="btn link"
                  onClick={handleDiscard}
                >
                  Discard
                </button>
                <button type="submit" className="btn primary">
                  Add Product
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default IndividualProduct;
