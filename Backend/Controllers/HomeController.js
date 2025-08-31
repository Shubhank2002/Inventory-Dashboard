const InvoiceModel = require("../Models/InvoiceModel");
const ProductModel = require("../Models/ProductModel");
const mongoose = require("mongoose");

const getDashboardSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    // --- 1) SALES OVERVIEW (from Paid invoices only) ---
    const salesAgg = await InvoiceModel.aggregate([
      { $match: { owner: userId, status: "Paid" } },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "prod",
        },
      },
      { $unwind: "$prod" },
      {
        $group: {
          _id: null,
          salesCount: { $sum: 1 }, // count invoices
          revenue: { $sum: "$items.total" }, // selling revenue
          cost: { $sum: { $multiply: ["$items.quantity", "$prod.costPrice"] } }, // actual purchase cost
        },
      },
    ]);

    const salesOverview = {
      sales: salesAgg[0]?.salesCount || 0,
      revenue: salesAgg[0]?.revenue || 0,
      profit: (salesAgg[0]?.revenue || 0) - (salesAgg[0]?.cost || 0),
      cost: salesAgg[0]?.cost || 0,
    };

    // --- 2) PURCHASE OVERVIEW (from Products added) ---
    const purchaseAgg = await ProductModel.aggregate([
      { $match: { owner: userId } },
      {
        $lookup: {
          from: "invoices",
          let: { productId: "$_id" },
          pipeline: [
            { $unwind: "$items" },
            { $match: { $expr: { $eq: ["$items.product", "$$productId"] } } },
            { $group: { _id: null, soldQty: { $sum: "$items.quantity" } } },
          ],
          as: "soldData",
        },
      },
      {
        $addFields: {
          soldQty: { $ifNull: [{ $arrayElemAt: ["$soldData.soldQty", 0] }, 0] },
          purchasedQty: {
            $add: [
              "$quantity",
              { $ifNull: [{ $arrayElemAt: ["$soldData.soldQty", 0] }, 0] },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalPurchase: { $sum: "$purchasedQty" },
          totalCost: { $sum: { $multiply: ["$costPrice", "$purchasedQty"] } },
        },
      },
    ]);
    const purchaseOverview = {
      purchase: purchaseAgg[0]?.totalPurchase || 0,
      cost: purchaseAgg[0]?.totalCost || 0,
      cancel: 0, // placeholder (if you track cancelled purchases later)
      return: 0, // placeholder (if you track returns later)
    };

    // --- 3) INVENTORY SUMMARY ---
    const inventoryAgg = await ProductModel.aggregate([
      { $match: { owner: userId } },
      {
        $group: {
          _id: null,
          quantityInHand: { $sum: "$quantity" },
        },
      },
    ]);

    const inventorySummary = {
      quantityInHand: inventoryAgg[0]?.quantityInHand || 0,
      toBeReceived: 0, // placeholder if you add PurchaseOrders
    };

    // --- 4) PRODUCT SUMMARY ---
    const categories = await ProductModel.distinct("category", {
      owner: userId,
    });

    const productSummary = {
      numberOfSuppliers: 0, // placeholder (no SupplierModel yet)
      numberOfCategories: categories.length,
    };

    // --- RESPONSE ---
    res.json({
      salesOverview,
      purchaseOverview,
      inventorySummary,
      productSummary,
      success: true,
    });
  } catch (err) {
    console.error("getDashboardSummary:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getDashboardSummary };
