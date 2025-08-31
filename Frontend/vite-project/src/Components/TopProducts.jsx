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

        const { data } = await axios.get("http://localhost:8000/other/top-products", { headers });
        setProducts(data.topProducts || []);
      } catch (err) {
        console.error("Error fetching top products:", err);
      }
    };

    fetchData();
  }, []);

  // find max to normalize bar widths
  const maxQty = Math.max(...products.map(p => p.totalQty), 1);

  return (
    <div style={{ background: "#fff", padding: "20px", borderRadius: "12px" ,}}>
      <h3 style={{ marginBottom: "15px" }}>Top Products</h3>
      {products.map((p, idx) => (
        <div key={idx} style={{ marginBottom: "12px",display:'flex',flexDirection:'column',alignItems:'center'}}>
          <p style={{ margin: "0 0 8px 0",alignSelf:'flex-start' }}>{p.name}</p>
          <div
            style={{
              display: "flex",
              gap: "4px",
              
            }}
          >
            {Array.from({ length: Math.round((p.totalQty / maxQty) * 6) }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: "20px",
                  height: "8px",
                  backgroundColor: "#FFD700",
                  borderRadius: "4px"
                }}
              ></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopProducts;
