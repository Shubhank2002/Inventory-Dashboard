const ProductModel = require("../Models/ProductModel");
const fs = require("fs");
const csv = require("csv-parser");
const CreateSingleProduct = async (req, res) => {
  const {
    name,
    quantity,
    price,
    threshold,
    category,
    expiryDate,
    unit,
    productId,
  } = req.body;

  if (!name || price == null) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res
      .status(400)
      .json({ success: false, message: "Name and price are required" });
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
      category:category.trim().toLowerCase(),
      quantity: Number(quantity) || 0,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      threshold: Number(threshold) || 0,
      unit:unit.trim().toLowerCase(),
      productId,
      imageName,
      imageUrl,
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
            quantity:
              r.quantity != null && r.quantity !== "" ? Number(r.quantity) : 0,
            unit: r.unit?.trim().toLowerCase(),
            threshold:
              r.threshold != null && r.threshold !== ""
                ? Number(r.threshold)
                : 0,
            expiryDate: r.expiryDate ? new Date(r.expiryDate) : undefined,
          };
          return o;
        };

        const isValid = (o) => {
          if (!o.name || !o.productId) return false;
          if (Number.isNaN(o.price) || o.price < 0) return false;
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
          { productId: { $in: ids } },
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
              return res
                .status(500)
                .json({
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
        return res
          .status(500)
          .json({
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
      return res
        .status(500)
        .json({
          success: false,
          message: "CSV read failed",
          error: err.message,
        });
    });
};

module.exports = { CreateSingleProduct, CreateMultipleProducts };
