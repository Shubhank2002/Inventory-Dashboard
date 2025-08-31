const ProductModel = require("../Models/ProductModel");
const fs = require("fs");
const mongoose = require("mongoose");
const csv = require("csv-parser");
const InvoiceModel = require("../Models/InvoiceModel");
const CreateSingleProduct = async (req, res) => {
  const {
    name,
    quantity,
    price,
    costPrice,
    threshold,
    category,
    expiryDate,
    unit,
    productId,
  } = req.body;
  const userId = req.user.userId;
  if (!name || price == null || costPrice == null) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res
      .status(400)
      .json({
        success: false,
        message: "Name and price are cost price are  required ",
      });
  }

  if (expiryDate && new Date(expiryDate) < new Date()) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res
      .status(400)
      .json({ success: false, message: "product is already expired" });
  }

  if (productId) {
    const exists = await ProductModel.findOne({ productId: productId.trim() });
    if (exists) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res
        .status(409)
        .json({ success: false, message: "Product ID already exists" });
    }
  }

  let imageUrl = null;
  let imageName = null;
  if (req.file) {
    imageName = req.file.filename;
    imageUrl = `/uploads/${imageName}`; // public URL
  }
  try {
    const newDoc = await ProductModel.create({
      name: name.trim().toLowerCase(),
      price: Number(price),
      costPrice: Number(costPrice),
      category: category.trim().toLowerCase(),
      quantity: Number(quantity) || 0,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      threshold: Number(threshold) || 0,
      unit: unit.trim().toLowerCase(),
      productId,
      imageName,
      imageUrl,
      owner: userId,
    });
    res.status(201).json({ success: true, data: newDoc });
  } catch (error) {
    console.error("createProduct:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const CreateMultipleProducts = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "CSV file is required" });
  }
  const userId = req.user.userId;
  const filePath = req.file.path;
  const rawRows = [];

  // 1) Read CSV
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => rawRows.push(row))
    .on("end", async () => {
      try {
        // 2) Normalize + validate each row
        const normalize = (r) => {
          const o = {
            name: r.name?.trim().toLowerCase(),
            productId: r.productId?.trim(),
            category: r.category?.trim().toLowerCase(),
            price: r.price != null && r.price !== "" ? Number(r.price) : 0,
            costPrice:
              r.costPrice != null && r.costPrice !== ""
                ? Number(r.costPrice)
                : null,
            quantity:
              r.quantity != null && r.quantity !== "" ? Number(r.quantity) : 0,
            unit: r.unit?.trim().toLowerCase(),
            threshold:
              r.threshold != null && r.threshold !== ""
                ? Number(r.threshold)
                : 0,
            expiryDate: r.expiryDate ? new Date(r.expiryDate) : undefined,
            owner: userId,
          };
          return o;
        };

        const isValid = (o) => {
          if (!o.name || !o.productId) return false;
          if (o.price == null || Number.isNaN(o.price) || o.price <= 0)
            return false;
          if (
            o.costPrice == null ||
            Number.isNaN(o.costPrice) ||
            o.costPrice <= 0
          )
            return false; // ✅ mandatory
          if (Number.isNaN(o.quantity) || o.quantity < 0) return false;
          if (Number.isNaN(o.threshold) || o.threshold < 0) return false;
          if (o.expiryDate && isNaN(o.expiryDate.getTime())) return false;
          return true;
        };

        let processed = 0;
        let csvDupCount = 0;
        let invalidCount = 0;

        // 3) Dedup within CSV by productId (keep first occurrence)
        const seen = new Set();
        const normalized = [];
        for (const r of rawRows) {
          processed++;
          const o = normalize(r);
          if (!o.productId) {
            invalidCount++;
            continue;
          }
          if (seen.has(o.productId)) {
            csvDupCount++;
            continue;
          }
          seen.add(o.productId);
          if (!isValid(o)) {
            invalidCount++;
            continue;
          }
          normalized.push(o);
        }

        // 4) Filter out productIds that already exist in DB
        const ids = normalized.map((x) => x.productId);
        const existingDocs = await ProductModel.find(
          { productId: { $in: ids }, owner: userId },
          { productId: 1, _id: 0 }
        ).lean();

        const existingSet = new Set(existingDocs.map((d) => d.productId));
        let dbDupCount = 0;
        const toInsert = normalized.filter((x) => {
          const isDup = existingSet.has(x.productId);
          if (isDup) dbDupCount++;
          return !isDup;
        });

        // 5) Insert (skip any remaining dup race conditions)
        let insertedDocs = [];
        if (toInsert.length) {
          try {
            insertedDocs = await ProductModel.insertMany(toInsert, {
              ordered: false,
            });
          } catch (err) {
            // Handle duplicate key errors gracefully (E11000)
            // Some may have failed; others inserted.
            if (err.writeErrors?.length) {
              for (const we of err.writeErrors) {
                if (we.code === 11000) dbDupCount++; // duplicate in DB during race
              }
              // Collect the ones that did insert:
              if (err.result?.result?.nInserted) {
                // Mongoose 6+ may not always populate insertedDocs; we can refetch by ids if needed
                // For brevity, we’ll just report nInserted:
                insertedDocs = new Array(err.result.result.nInserted).fill(
                  null
                );
              }
            } else {
              console.error("insertMany error:", err);
              return res.status(500).json({
                success: false,
                message: "Insert error",
                error: err.message,
              });
            }
          }
        }

        const summary = {
          processed, // total rows read from CSV
          inserted: insertedDocs.length,
          skipped: {
            csvDuplicates: csvDupCount,
            dbDuplicates: dbDupCount,
            invalid: invalidCount,
          },
        };

        return res.status(201).json({
          success: true,
          message: `Inserted ${summary.inserted}. Skipped CSV dup: ${csvDupCount}, DB dup: ${dbDupCount}, invalid: ${invalidCount}.`,
          summary,
        });
      } catch (err) {
        console.error("CSV upload error:", err);
        return res.status(500).json({
          success: false,
          message: "CSV processing failed",
          error: err.message,
        });
      } finally {
        // optional: delete uploaded CSV after processing
        try {
          fs.unlinkSync(filePath);
        } catch {}
      }
    })
    .on("error", (err) => {
      console.error("CSV stream error:", err);
      return res.status(500).json({
        success: false,
        message: "CSV read failed",
        error: err.message,
      });
    });
};
const getProducts = async (req, res) => {
  try {
    const userId = req.user.userId; // from auth middleware
    const { search, page = 1, limit = 10 } = req.query;

    const query = { owner: userId }; // each user sees only their own products
    if (search) {
      query.name = { $regex: search, $options: "i" }; // case-insensitive search
    }

    const total = await ProductModel.countDocuments(query);
    const products = await ProductModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("getProducts:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const getProductSummary = async (req, res) => {
  try {
    const userId = req.user.userId;

    // 1) Total categories
    const categories = await ProductModel.distinct("category", {
      owner: new mongoose.Types.ObjectId(userId),
    });
    const categoryCount = categories.length;

    // 2) Total products
    const totalProducts = await ProductModel.countDocuments({
      owner: new mongoose.Types.ObjectId(userId),
    });

    // 3) How many ordered (from invoices)
    const orderedAgg = await InvoiceModel.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$items" },
      { $group: { _id: null, totalOrdered: { $sum: "$items.quantity" } } },
    ]);
    const totalOrdered = orderedAgg.length > 0 ? orderedAgg[0].totalOrdered : 0;

    // 4) Out of stock products
    const outOfStock = await ProductModel.countDocuments({
      owner: new mongoose.Types.ObjectId(userId),
      quantity: 0,
    });

    // 5) Top selling products
    const topSellingAgg = await InvoiceModel.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          totalQty: { $sum: "$items.quantity" },
          totalSales: { $sum: "$items.total" },
        },
      },
      { $sort: { totalQty: -1 } },
      { $limit: 5 },
    ]);

    // 6) Revenue (from paid invoices)
    const revenueAgg = await InvoiceModel.aggregate([
      {
        $match: { owner: new mongoose.Types.ObjectId(userId), status: "Paid" },
      },
      { $group: { _id: null, revenue: { $sum: "$totalAmount" } } },
    ]);
    const revenue = revenueAgg[0]?.revenue || 0;

    res.json({
      success: true,
      categories: categoryCount,
      totalProducts,
      totalOrdered,
      outOfStock,
      revenue,
      topSelling: topSellingAgg,
    });
  } catch (err) {
    console.error("getProductSummary:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  CreateSingleProduct,
  CreateMultipleProducts,
  getProducts,
  getProductSummary,
};
