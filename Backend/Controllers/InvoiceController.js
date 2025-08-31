const InvoiceModel = require("../Models/InvoiceModel");
const ProductModel = require("../Models/ProductModel");

// 🟢 1. Create Invoice
const CreateInvoice = async (req, res) => {
  try {
    const userId = req.user.userId; // from JWT middleware
    const { items } = req.body; // [{ productId, quantity }, ...]

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invoice must have at least one item",
        });
    }

    let totalAmount = 0;
    const itemDetails = [];

    for (let i of items) {
      const product = await ProductModel.findOne({
        _id: i.productId,
        owner: userId,
      });
      if (!product) {
        return res
          .status(404)
          .json({
            success: false,
            message: `Product not found: ${i.productId}`,
          });
      }

      if (product.quantity < i.quantity) {
        return res
          .status(400)
          .json({
            success: false,
            message: `Insufficient stock for ${product.name}`,
          });
      }

      const total = product.price * i.quantity;
      totalAmount += total;

      itemDetails.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: i.quantity,
        total,
        // ✅ snapshot virtual
      });

      // Deduct stock
      product.quantity -= i.quantity;
      await product.save();
    }

    const invoice = await InvoiceModel.create({
      owner: userId,
      items: itemDetails,
      totalAmount,
      status: "Unpaid",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // due in 7 days
    });

    res.status(201).json({ success: true, data: invoice });
  } catch (err) {
    console.error("CreateInvoice:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// 🟢 2. Get Invoice Summary
const getInvoiceSummary = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Last 7 days filter
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const recentTransactions = await InvoiceModel.countDocuments({
      owner: userId,
      createdAt: { $gte: last7Days },
    });

    const totalInvoices = await InvoiceModel.countDocuments({ owner: userId });

    // Aggregate Paid & Unpaid for efficiency
    const summary = await InvoiceModel.aggregate([
      { $match: { owner: userId } },
      {
        $group: {
          _id: "$status",
          totalAmount: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
    ]);

    let paidAmount = 0,
      unpaidAmount = 0,
      paidCount = 0,
      unpaidCount = 0;
    summary.forEach((s) => {
      if (s._id === "Paid") {
        paidAmount = s.totalAmount;
        paidCount = s.count;
      } else if (s._id === "Unpaid") {
        unpaidAmount = s.totalAmount;
        unpaidCount = s.count;
      }
    });

    res.json({
      recentTransactions,
      totalInvoices,
      processedInvoices: paidCount + unpaidCount,
      paidAmount,
      unpaidAmount,
      customers: paidCount, // SRD: #customers ~ #paid invoices
      pendingInvoices: unpaidCount, // SRD: pending count
    });
  } catch (err) {
    console.error("getInvoiceSummary:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// 🟢 3. Get Paginated Invoices
const getInvoices = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const query = { owner: userId };

    const total = await InvoiceModel.countDocuments(query);
    const invoices = await InvoiceModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: invoices,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("getInvoices:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// 🟢 4. Mark Invoice as Paid
const markInvoicePaid = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params; // invoice id

    const invoice = await InvoiceModel.findOne({ _id: id, owner: userId });
    if (!invoice) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });
    }

    if (invoice.status === "Paid") {
      return res
        .status(400)
        .json({ success: false, message: "Invoice already paid" });
    }

    // Generate Reference Number
    const refNo = `REF-${Date.now()}`;

    invoice.status = "Paid";
    invoice.referenceNumber = refNo;
    await invoice.save();

    res.json({
      success: true,
      message: "Invoice marked as Paid",
      data: invoice,
    });
  } catch (err) {
    console.error("markInvoicePaid:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const getInvoiceById = async (req, res) => {
  try {
    const userId = req.user.userId; // ✅ comes from JWT middleware
    const { id } = req.params;

    const invoice = await InvoiceModel.findOne({
      _id: id,
      owner: userId,
    }).lean();

    if (!invoice) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });
    }

    res.json({ success: true, data: invoice });
  } catch (err) {
    console.error("getInvoiceById:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const DeleteInvoice = async (req, res) => {
  const UserId = req.user.userId;
  const { id } = req.params;
  try {
    const invoice = await InvoiceModel.findOne({ _id: id });

    if (!invoice) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });
    }

    const deleteInvoice=await InvoiceModel.deleteOne({_id:id})
    res.status(200).json({success:true,data:deleteInvoice})
  } catch (error) {
    console.error("getInvoiceById:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  CreateInvoice,
  getInvoiceSummary,
  getInvoices,
  markInvoicePaid,
  getInvoiceById,
  DeleteInvoice
};
