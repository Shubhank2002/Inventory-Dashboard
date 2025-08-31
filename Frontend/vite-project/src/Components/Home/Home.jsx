import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import "./HomeStyles.css";
import SalesOverview from "./SalesOverview";
import InventorySummary from "./InventorySummary";
import PurchaseOverview from "./PurchaseOverview";
import ProductSummary from "./ProductSummary";
import Searchere from "../Searchere";
import axios from "axios";

const Home = () => {
    
    const [summary, setSummary] = useState(null);
    const [loading, setloading] = useState(true)
    useEffect(() => {
    const fetchSummary = async () => {
      try {
        const jsontoken = localStorage.getItem("token");
        const token = JSON.parse(jsontoken);
        const headers = { Authorization: `Bearer ${token}` };

        const { data } = await axios.get("http://localhost:8000/dashboard/summary", { headers });
        setSummary(data);
      } catch (err) {
        console.error("Error fetching dashboard summary:", err);
      }finally{
        setloading(false)
      }
    };

    fetchSummary();
  }, []);
   if (loading) {
    return <div style={{ color: "white" }}>Loading dashboard...</div>;
  }
  return (
    <div id="home_container">
      <Sidebar />
      <div id="right_part">
        <div id="right_first_div">
          <h1 style={{fontSize:'20px',color:'white',margin:'10px 0'}}>Home</h1>
          <Searchere/>
        </div>
        
        <div id="right_part_1">
          <div id="right_part1">
            <SalesOverview salesOverview={summary?.salesOverview} />
            <PurchaseOverview purchaseOverview={summary?.purchaseOverview}/>
          </div>
          <div id="right_part2">
            <InventorySummary inventorySummary={summary?.inventorySummary}/>
            <ProductSummary productSummary={summary?.productSummary} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
