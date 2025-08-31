const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    price: {
      type: Number, // Selling price
      required: true,
      min: 0,
    },
    costPrice: {
      type: Number, // Purchase cost price
      required: true,
      min: 0,
      default: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    threshold: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    expiryDate: { type: Date }, // optional
    category: { type: String, trim: true },
    imageName: String,
    unit: { type: String, trim: true },
    productId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    imageUrl: { type: String, trim: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ Compound unique index: productId must be unique per owner
ProductSchema.index({ owner: 1, productId: 1 }, { unique: true });

// Pre-save clean-up
ProductSchema.pre("save", function (next) {
  if (this.name) this.name = this.name.trim();
  if (this.productId) this.productId = this.productId.trim();
  if (this.category) this.category = this.category.trim();
  if (this.unit) this.unit = this.unit.trim();
  next();
});

// Virtual availability status
ProductSchema.virtual("availability").get(function () {
  if (this.expiryDate && this.expiryDate < new Date()) return "Expired";
  if (this.quantity === 0) return "Out of Stock";
  if (this.threshold > this.quantity) return "Low Stock";
  return "In Stock";
});

ProductSchema.set("toJSON", { virtuals: true });
ProductSchema.set("toObject", { virtuals: true });

const ProductModel = new mongoose.model("Product", ProductSchema);

module.exports = ProductModel;
