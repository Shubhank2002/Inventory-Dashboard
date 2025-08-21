import React from "react";
import Sidebar from "../Sidebar";
import "./HomeStyles.css";
import SalesOverview from "./SalesOverview";
import InventorySummary from "./InventorySummary";
import PurchaseOverview from "./PurchaseOverview";
import ProductSummary from "./ProductSummary";
import Searchere from "../Searchere";

const Home = () => {
  return (
    <div id="home_container">
      <Sidebar />
      <div id="right_part">
        <div id="right_first_div">
          <h1 style={{fontSize:'20px',color:'white',margin:'7px 0'}}>Home</h1>
          <Searchere/>
        </div>
        
        <div id="right_part_1">
          <div id="right_part1">
            <SalesOverview />
            <PurchaseOverview />
          </div>
          <div id="right_part2">
            <InventorySummary />
            <ProductSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
