import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import "./HomeStyles.css";
import SalesOverview from "./SalesOverview";
import InventorySummary from "./InventorySummary";
import PurchaseOverview from "./PurchaseOverview";
import ProductSummary from "./ProductSummary";
import Searchere from "../Searchere";
import axios from "axios";
import SalesPurchaseChart from "../SalesPurchaseChart";
import TopProducts from "../TopProducts";
import SmallSidebar from "../SmallSidebar";

const Home = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setloading] = useState(true);

  // Drag state
  const [draggingIndex, setDraggingIndex] = useState(null);

  const [rightPart1Items, setRightPart1Items] = useState([]);
  const [rightPart2Items, setRightPart2Items] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const jsontoken = localStorage.getItem("token");
        const token = JSON.parse(jsontoken);
        const headers = { Authorization: `Bearer ${token}` };

        const { data } = await axios.get(
          "https://inventory-dashboard-backend-hxjm.onrender.com/dashboard/summary",
          { headers }
        );
        setSummary(data);

        // initialize draggable items after data fetch
        setRightPart1Items([
          {
            id: 1,
            component: <SalesOverview salesOverview={data?.salesOverview} />,
          },
          {
            id: 2,
            component: (
              <PurchaseOverview purchaseOverview={data?.purchaseOverview} />
            ),
          },
          { id: 3, component: <SalesPurchaseChart /> },
        ]);

        setRightPart2Items([
          {
            id: 4,
            component: (
              <InventorySummary inventorySummary={data?.inventorySummary} />
            ),
          },
          {
            id: 5,
            component: <ProductSummary productSummary={data?.productSummary} />,
          },
          { id: 6, component: <TopProducts /> },
        ]);
      } catch (err) {
        console.error("Error fetching dashboard summary:", err);
      } finally {
        setloading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <div style={{ color: "white" }}>Loading dashboard...</div>;
  }

  // Drag Handlers
  const handleDragStart = (index) => {
    setDraggingIndex(index);
  };

  const handleDrop = (index, items, setItems) => {
    const newItems = [...items];
    const draggedItem = newItems[draggingIndex];
    newItems.splice(draggingIndex, 1);
    newItems.splice(index, 0, draggedItem);
    setItems(newItems);
    setDraggingIndex(null);
  };

  return (
    <div id="home_container">
      <Sidebar />
      <div id="right_part">
        <div id="right_first_div">
          <h1
            style={{
              fontSize: "1.25rem",
              color: "white",
              margin: "0.625rem 0",
            }}
          >
            Home
          </h1>
          <Searchere />
        </div>

        <div id="right_part_1">
          {/* Right Part 1 Drag & Drop */}
          <div id="right_part1">
            {rightPart1Items.map((item, index) => (
              <div
                key={item.id}
                className="draggable-card"
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() =>
                  handleDrop(index, rightPart1Items, setRightPart1Items)
                }
              >
                {item.component}
              </div>
            ))}
          </div>

          {/* Right Part 2 Drag & Drop */}
          <div id="right_part2">
            {rightPart2Items.map((item, index) => (
              <div
                key={item.id}
                className="draggable-card"
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() =>
                  handleDrop(index, rightPart2Items, setRightPart2Items)
                }
              >
                {item.component}
              </div>
            ))}
          </div>
          <SmallSidebar />
        </div>
      </div>
    </div>
  );
};

export default Home;
