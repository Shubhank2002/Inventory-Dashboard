import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SalesPurchaseChart = () => {
  const [chartData, setChartData] = useState([]);
  const [period, setPeriod] = useState("monthly");

  const fetchData = async () => {
    try {
      const jsontoken = localStorage.getItem("token");
      const token = JSON.parse(jsontoken);
      const headers = { Authorization: `Bearer ${token}` };

      const { data } = await axios.get(
        `https://inventory-dashboard-backend-hxjm.onrender.com/other/sales-purchase?period=${period}`,
        { headers }
      );

      setChartData(data.data || []);
    } catch (err) {
      console.error("Error fetching chart data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  const togglePeriod = () => {
    setPeriod(period === "monthly" ? "weekly" : "monthly");
  };

  return (
    <div style={{ background: "#fff", borderRadius: "12px", padding: "20px",}}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h3>Sales & Purchase</h3>
        <button
          onClick={togglePeriod}
          style={{
            padding: "6px 12px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {period === "monthly" ? "Switch to Weekly" : "Switch to Monthly"}
        </button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="purchase" fill="#8884d8" name="Purchase" />
          <Bar dataKey="sales" fill="#82ca9d" name="Sales" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesPurchaseChart;
