// Components/TopProducts.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const TopProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsontoken = localStorage.getItem("token");
        const token = JSON.parse(jsontoken);
        const headers = { Authorization: `Bearer ${token}` };

        const { data } = await axios.get(
          "https://inventory-dashboard-backend-hxjm.onrender.com/other/top-products",
          { headers }
        );
        setProducts(data.topProducts || []);
      } catch (err) {
        console.error("Error fetching top products:", err);
      }
    };

    fetchData();
  }, []);

  // find max to normalize bar widths
  const maxQty = Math.max(...products.map((p) => p.totalQty), 1);

  return (
    <div style={{ background: "#fff", padding: "20px", borderRadius: "12px" }}>
      <h3 style={{ marginBottom: "20px" }}>Top Products</h3>
      {products.slice(0, 5).map((p, idx) => {
        const stars = Math.max(5 - idx, 1); // 1st=5, 2nd=4 … 5th=1

        return (
          <div key={idx} style={{ gap:'8px',display:'flex',flexDirection:'column',alignItems:'center',marginBottom:'15px' }}>
            <p style={{ margin: "0 0 8px 0" ,alignSelf:'flex-start',fontWeight:'bold'}}>
              {p.name} 
            </p>
            <div style={{ display: "flex", gap: "4px" }}>
              {Array.from({ length: stars }).map((_, i) => (
                <span key={i} style={{ color: "#FFD700", fontSize: "18px" }}>
                  ★
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TopProducts;
