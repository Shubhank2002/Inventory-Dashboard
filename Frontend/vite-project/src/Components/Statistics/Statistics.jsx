import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import "./StatisticsStyles.css";
import Searchere from "../Searchere";
import SalesPurchaseChart from "../SalesPurchaseChart";
import TopProducts from "../TopProducts";
import axios from "axios";

const Statistics = () => {
  const [stats, setstats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [draggingItem, setDraggingItem] = useState(null);

  const fetchStats = async () => {
    try {
      const jsontoken = localStorage.getItem("token");
      const token = JSON.parse(jsontoken);
      const headers = { Authorization: `Bearer ${token}` };

      const revenueRes = await axios.get(
        "http://localhost:8000/other/revenue-stock",
        { headers }
      );

      setstats(revenueRes.data);
    } catch (err) {
      console.error("Error fetching statistics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ color: "white" }}>Loading Statistics...</div>;
  }

  // Drag Handlers
  const handleDragStart = (e) => {
    setDraggingItem(e.currentTarget);
  };

  const handleDrop = (e, containerId) => {
    e.preventDefault();
    const container = document.getElementById(containerId);
    if (draggingItem && container) {
      const afterElement = getDragAfterElement(container, e.clientX);
      if (afterElement == null) {
        container.appendChild(draggingItem);
      } else {
        container.insertBefore(draggingItem, afterElement);
      }
    }
  };

  const getDragAfterElement = (container, x) => {
    const draggableElements = [
      ...container.querySelectorAll(".draggable-box:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  };

  return (
    <div id="statisticscontainer">
      <Sidebar />
      <div id="statisticsrightpart">
        <div id="statisticstopdiv">
          <h1 style={{ margin: "5px 0px", fontSize: "18px", color: "white" }}>
            Statistics
          </h1>
          <Searchere />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* --- Second Div --- */}
          <div
            id="Statisticsseconddiv"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, "Statisticsseconddiv")}
          >
            <div
              className="statisticscolorbox draggable-box"
              draggable
              onDragStart={handleDragStart}
              style={{ backgroundColor: "#FAD85D", borderRadius: "5px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0px 15px",
                }}
              >
                <p style={{ fontFamily: "Inter", fontSize: "14px" }}>
                  Total Revenue
                </p>
                <div>
                  <img src="/dollar-sign.png" alt="" />
                </div>
              </div>
              <div>
                <h1 style={{ margin: "0px", fontSize: "24px" }}>
                  ₹{stats.revenue.total}
                </h1>
                <p style={{ margin: "0px" }}>
                  +{stats.revenue.growth}% from last month
                </p>
              </div>
            </div>

            <div
              className="statisticscolorbox draggable-box"
              draggable
              onDragStart={handleDragStart}
              style={{ backgroundColor: "#0BF4C8", borderRadius: "5px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0px 15px",
                }}
              >
                <p style={{ fontFamily: "Inter", fontSize: "14px" }}>
                  Products Sold
                </p>
                <div>
                  <img src="/credit-card.png" alt="" />
                </div>
              </div>
              <div>
                <h1 style={{ margin: "0px", fontSize: "24px" }}>
                  {stats.sold.total}
                </h1>
                <p style={{ margin: "0px" }}>
                  +{stats.sold.growth}% from last month
                </p>
              </div>
            </div>

            <div
              className="statisticscolorbox draggable-box"
              draggable
              onDragStart={handleDragStart}
              style={{ backgroundColor: "#F2A0FF", borderRadius: "5px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0px 15px",
                  height: "44px",
                }}
              >
                <p style={{ margin: "0px" }}>Products in Stock</p>
                <div>
                  <img src="/activity.png" alt="" />
                </div>
              </div>
              <div>
                <h1 style={{ margin: "0px", fontSize: "24px" }}>
                  {stats.stock.total}
                </h1>
                <p style={{ margin: "0px" }}>
                  +{stats.stock.growth}% from last month
                </p>
              </div>
            </div>
          </div>

          {/* --- Third Div --- */}
          <div
            id="Statisticsthirddiv"
            style={{ display: "flex", gap: "20px" }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, "Statisticsthirddiv")}
          >
            <div
              className="draggable-box"
              draggable
              onDragStart={handleDragStart}
              style={{ width: "65%" }}
            >
              <SalesPurchaseChart />
            </div>
            <div
              className="draggable-box"
              draggable
              onDragStart={handleDragStart}
              style={{ width: "20%" }}
            >
              <TopProducts />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
