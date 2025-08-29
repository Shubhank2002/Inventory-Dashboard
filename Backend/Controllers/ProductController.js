const ProductModel = require("../Models/ProductModel");
const fs = require("fs");
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
      name: name.trim(),
      price: Number(price),
      category,
      quantity: Number(quantity) || 0,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      threshold: Number(threshold) || 0,
      unit,
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

const CreateMultipleProducts=async(req,res)=>{

}

module.exports = { CreateSingleProduct ,CreateMultipleProducts};
