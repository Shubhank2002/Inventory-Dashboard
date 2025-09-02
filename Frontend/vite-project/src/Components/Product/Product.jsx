import React from "react";
import "./ProductStyles.css";
import Sidebar from "../Sidebar";
import Searchere from "../Searchere";
import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import SmallSidebar from "../SmallSidebar";

const Product = () => {
  const { name } = useParams();
  const [summary, setSummary] = useState(null);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 10;
  const navigate = useNavigate();
  const [showDialog1, setshowDialog1] = useState(false);
  const [showDialog2, setshowDialog2] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [csvError, setCsvError] = useState("");
  const fileInputRef = useRef(null);
  const validateCSV = (f) => {
    if (!f) return "No file selected";
    if (!/\.csv$/i.test(f.name)) return "Only .csv files are allowed";
    if (f.size > 10 * 1024 * 1024) return "File too large (max 10MB)";
    return "";
  };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(
          `http://localhost:8000/product/getproducts?page=${page}&limit=${limit}`,
          { headers }
        );
        setProducts(res.data.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, [page, products]);
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        const headers = { Authorization: `Bearer ${token}` };
        const { data } = await axios.get(
          "http://localhost:8000/product/summary",
          { headers }
        );
        setSummary(data);
      } catch (err) {
        console.error("Error fetching summary:", err);
      }
    };
    fetchSummary();
  }, []);
  const handleAdd = (e) => {
    setshowDialog1(true);
  };

  const handleClose1 = () => {
    setshowDialog1(false);
  };
  const closeDialog2 = () => {
    setshowDialog2(false);
    setCsvFile(null);
    setCsvError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };
  const handleAdd2 = () => {
    setshowDialog1(false);
    setshowDialog2(true);
  };
  const onBrowse = () => fileInputRef.current?.click();
  const handleFiles = (files) => {
    const f = files?.[0];
    const err = validateCSV(f);
    setCsvError(err || "");
    if (!err) setCsvFile(f);
  };

  const uploadCSV = async () => {
    if (!csvFile) return setCsvError("Choose a CSV first");
    try {
      const fd = new FormData();
      fd.append("file", csvFile);
      const jsontoken = localStorage.getItem("token");
      const token = JSON.parse(jsontoken);
      const headers = { Authorization: `Bearer ${token}` };
      // TODO: point to your backend route
      const res = await axios.post(
        "http://localhost:8000/product/multiple",
        fd,
        { headers }
      );
      if (!res.data.success)
        throw new Error(res.data?.message || "Upload failed");
      alert(res.data.message || "Uploaded!");
      closeDialog2();
    } catch (err) {
      setCsvError(err.message);
    }
  };
  return (
    <div id="productcontainer">
      <Sidebar />
      <div id="productrightpart">
        <SmallSidebar />
        <div id="producttopdiv">
          <h1
            style={{
              color: "white",
              fontSize: "18px",
              fontWeight: "normal",
              margin: "5px 0px",
            }}
          >
            Product
          </h1>
          <Searchere />
        </div>
        <div id="productseconddiv">
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "normal",
              color: "grey",
              textAlign: "left",
              marginBottom: "10px",
            }}
          >
            Overall Inventory
          </h1>
          <div id="product_details">
            <div className="product_details_div">
              <h3>Categories</h3>
              <div
                className="product_details_numbers"
                style={{ textAlign: "left" }}
              >
                <div>
                  <p style={{ color: "grey", fontWeight: "bold" }}>
                    {summary?.categories || 0}
                  </p>
                  <p style={{ color: "grey" }}>Last 7 days</p>
                </div>
              </div>
            </div>
            <div className="product_details_div">
              <h3>Total Products</h3>
              <div className="product_details_numbers">
                <div>
                  <p style={{ color: "grey", fontWeight: "bold" }}>
                    {summary?.totalProducts || 0}
                  </p>
                  <p style={{ color: "grey" }}>Last 7 days</p>
                </div>
                <div>
                  <p style={{ color: "grey", fontWeight: "bold" }}>
                    ₹{summary?.revenue || 0}
                  </p>
                  <p style={{ color: "grey" }}>Revenue</p>
                </div>
              </div>
            </div>
            <div className="product_details_div">
              <h3>Top Selling</h3>
              <div className="product_details_numbers">
                {summary?.topSelling?.length > 0 ? (
                  summary.topSelling.map((p, idx) => (
                    <div key={idx}>
                      <p style={{ color: "grey", fontWeight: "bold" }}>
                        {p.name}
                      </p>
                      <p style={{ color: "grey" }}>
                        Sold: {p.totalQty} | ₹{p.totalSales}
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "grey" }}>No sales yet</p>
                )}
              </div>
            </div>
            <div className="product_details_div">
              <h3>Low Stocks</h3>
              <div className="product_details_numbers">
                <div>
                  <p style={{ color: "grey", fontWeight: "bold" }}>
                    {summary?.totalOrdered || 0}
                  </p>
                  <p style={{ color: "grey" }}>Last 7 days</p>
                </div>
                <div>
                  <p style={{ color: "grey", fontWeight: "bold" }}>
                    {summary?.outOfStock || 0}
                  </p>
                  <p style={{ color: "grey" }}>Not in Stock</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          id="productlistdiv"
          style={{ backgroundColor: "white", padding: "6px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1 style={{ fontSize: "24px", color: "grey", fontWeight: "bold" }}>
              Products
            </h1>
            <button
              style={{
                backgroundColor: "#242531",
                color: "white",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "5px",
                width: "116px",
                height: "40px",
              }}
              onClick={handleAdd}
            >
              Add Product
            </button>
          </div>
          <div className="grid_div_product_headers">
            <div style={{ borderLeft: "1px solid grey" }}>Products</div>
            <div style={{ borderLeft: "1px solid grey" }}>Price</div>
            <div style={{ borderLeft: "1px solid grey" }}>Quantity</div>
            <div style={{ borderLeft: "1px solid grey" }}>Threshold Value</div>
            <div style={{ borderLeft: "1px solid grey" }}>Expiry Date</div>
            <div style={{ borderLeft: "1px solid grey" }}>Availability</div>
          </div>
          {products.map((p) => (
            <div className="grid_div_product_content" key={p._id}>
              <div>{p.name}</div>
              <div>₹{p.price}</div>
              <div>
                {p.quantity} {p.unit}
              </div>
              <div>
                {p.threshold} {p.unit}
              </div>
              <div>
                {p.expiryDate
                  ? new Date(p.expiryDate).toLocaleDateString()
                  : "-"}
              </div>
              <div
                className={`availability-cell ${
                  p.availability === "In Stock"
                    ? "availability-instock"
                    : p.availability === "Low Stock"
                    ? "availability-lowstock"
                    : "availability-outstock"
                }`}
              >
                <span>{p.availability}</span>
                <button
                  className="delete-btn"
                  onClick={async () => {
                    try {
                      const token = JSON.parse(localStorage.getItem("token"));
                      const headers = { Authorization: `Bearer ${token}` };
                      await axios.delete(
                        `http://localhost:8000/product/${p._id}/delete`,
                        { headers }
                      );
                      setProducts((prev) =>
                        prev.filter((prod) => prod._id !== p._id)
                      );
                    } catch (err) {
                      console.error("Error deleting product:", err);
                    }
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              style={{ cursor: "pointer" }}
            >
              Previous
            </button>
            <span>Page {page}</span>
            <button
              onClick={() => setPage(page + 1)}
              style={{ cursor: "pointer" }}
            >
              Next
            </button>
          </div>
        </div>
        {showDialog1 && (
          <div className="overlay" onClick={handleClose1}>
            <div
              className="dialog-box"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside box
            >
              <button
                className="dialog-btn"
                onClick={() =>
                  navigate(`/dashboard/${name}/individual-product`)
                }
              >
                Individual product
              </button>
              <button className="dialog-btn" onClick={handleAdd2}>
                Multiple product
              </button>
            </div>
          </div>
        )}
        {showDialog2 && (
          <div className="overlay" onClick={closeDialog2}>
            <div className="csv-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="csv-header">
                <div className="csv-title">CSV Upload</div>
                <button className="csv-close" onClick={closeDialog2}>
                  ×
                </button>
              </div>
              <p className="csv-sub">Add your documents here</p>

              <div
                className={`csv-dropzone ${dragOver ? "is-over" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={onBrowse}
              >
                <div className="csv-drop-icon" />
                <div className="csv-drop-text">
                  Drag your file(s) to start uploading
                </div>
                <div className="csv-or">OR</div>
                <button type="button" className="csv-browse" onClick={onBrowse}>
                  Browse files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  style={{ display: "none" }}
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>

              {csvError && <div className="csv-error">{csvError}</div>}

              {csvFile && (
                <div className="csv-file">
                  <div className="csv-file-icon">CSV</div>
                  <div className="csv-file-meta">
                    <div className="csv-file-name" title={csvFile.name}>
                      {csvFile.name}
                    </div>
                    <div className="csv-file-size">
                      {(csvFile.size / (1024 * 1024)).toFixed(1)}MB
                    </div>
                  </div>
                  <button
                    className="csv-file-remove"
                    onClick={() => setCsvFile(null)}
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="csv-actions">
                <button className="btn ghost" onClick={closeDialog2}>
                  Cancel
                </button>
                <button
                  className="btn primary"
                  onClick={uploadCSV}
                  disabled={!csvFile}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
