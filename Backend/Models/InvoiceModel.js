const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  invoiceId: { type: String, unique: true }, // ex: INV-1001
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: String,       // snapshot of product name
      price: Number,      // snapshot of product price
      quantity: Number,   // qty ordered
      total: Number       // price * qty
    }
  ],

  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["Unpaid", "Paid"], default: "Unpaid" },
  referenceNumber: { type: String, default: null }, // generated only when paid
  dueDate: { type: Date }, // optional

}, { timestamps: true });

// Auto-generate invoiceId (like INV-1001)
InvoiceSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await mongoose.model("Invoice").countDocuments();
    this.invoiceId = `INV-${1001 + count}`;
  }
  next();
});
const InvoiceModel=mongoose.model("Invoice", InvoiceSchema);
module.exports = InvoiceModel
