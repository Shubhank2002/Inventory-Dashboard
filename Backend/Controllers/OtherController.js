const InvoiceModel = require("../Models/InvoiceModel");
const ProductModel = require("../Models/ProductModel");
const mongoose=require('mongoose')

// controller/salesPurchase.js


const getSalesPurchase = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { period = "monthly" } = req.query;

    // Define grouping format
    const groupFormat = period === "weekly"
      ? { $isoWeek: "$createdAt" }   // 1–52
      : { $month: "$createdAt" };    // 1–12

    const salesAgg = await InvoiceModel.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(userId), status: "Paid" } },
      {
        $group: {
          _id: groupFormat,
          totalSales: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const purchaseAgg = await ProductModel.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: groupFormat,
          totalPurchase: { $sum: { $multiply: ["$costPrice", "$quantity"] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Merge into chart-friendly format
    const merged = {};
    salesAgg.forEach((s) => {
      merged[s._id] = { label: s._id, sales: s.totalSales, purchase: 0 };
    });
    purchaseAgg.forEach((p) => {
      if (!merged[p._id]) merged[p._id] = { label: p._id, sales: 0, purchase: 0 };
      merged[p._id].purchase = p.totalPurchase;
    });

    // Convert _id to month/Week names
    const formatted = Object.values(merged).map((d) => ({
      label: period === "weekly" ? `Week ${d.label}` : new Date(2025, d.label - 1).toLocaleString("default", { month: "short" }),
      sales: d.sales,
      purchase: d.purchase,
    }));

    res.json({ period, data: formatted });
  } catch (err) {
    console.error("getSalesPurchase:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
// controller/topProducts.js
// controllers/dashboardController.js


const getTopProducts = async (req, res) => {
  try {
    const userId = req.user.userId;

    const topProducts = await InvoiceModel.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          totalQty: { $sum: "$items.quantity" }
        }
      },
      { $sort: { totalQty: -1 } },
      { $limit: 6 }
    ]);

    res.json({ success: true, topProducts });
  } catch (err) {
    console.error("getTopProducts:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const getRevenueAndStock = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Dates for current & previous month
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // ----- 1. Total Revenue (this month vs last month)
    const revenueAgg = await InvoiceModel.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(userId), status: "Paid" } },
      {
        $facet: {
          thisMonth: [
            { $match: { createdAt: { $gte: startOfThisMonth } } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
          ],
          lastMonth: [
            { $match: { createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
          ],
        },
      },
    ]);

    const thisRevenue = revenueAgg[0].thisMonth[0]?.total || 0;
    const lastRevenue = revenueAgg[0].lastMonth[0]?.total || 0;
    const revenueGrowth = lastRevenue
      ? ((thisRevenue - lastRevenue) / lastRevenue) * 100
      : 100;

    // ----- 2. Products Sold (this month vs last month)
    const soldAgg = await InvoiceModel.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(userId), status: "Paid" } },
      {
        $facet: {
          thisMonth: [
            { $match: { createdAt: { $gte: startOfThisMonth } } },
            { $unwind: "$items" },
            { $group: { _id: null, total: { $sum: "$items.quantity" } } },
          ],
          lastMonth: [
            { $match: { createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
            { $unwind: "$items" },
            { $group: { _id: null, total: { $sum: "$items.quantity" } } },
          ],
        },
      },
    ]);

    const thisSold = soldAgg[0].thisMonth[0]?.total || 0;
    const lastSold = soldAgg[0].lastMonth[0]?.total || 0;
    const soldGrowth = lastSold
      ? ((thisSold - lastSold) / lastSold) * 100
      : 100;

    // ----- 3. Products In Stock (compare to last month if needed)
    const stockAgg = await ProductModel.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$quantity" } } },
    ]);

    const thisStock = stockAgg[0]?.total || 0;

    // For now, assume last month stock = 0 (first time baseline)
    // Later, you can implement StockHistory to get real last month stock
    const lastStock = 0;
    const stockGrowth = lastStock
      ? ((thisStock - lastStock) / lastStock) * 100
      : 100;

    res.json({
      success: true,
      revenue: {
        total: thisRevenue,
        growth: revenueGrowth.toFixed(1),
      },
      sold: {
        total: thisSold,
        growth: soldGrowth.toFixed(1),
      },
      stock: {
        total: thisStock,
        growth: stockGrowth.toFixed(1),
      },
    });
  } catch (err) {
    console.error("getRevenueAndStock:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};






module.exports={getSalesPurchase,getTopProducts,getRevenueAndStock}