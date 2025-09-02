const cron = require("node-cron");
const ProductModel = require("./Models/ProductModel");
 // adjust path to your Product model

// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    const now = new Date();

    // Find expired products
    const expiredProducts = await Product.find({
      expiryDate: { $lt: now }
    });

    if (expiredProducts.length > 0) {
      const expiredIds = expiredProducts.map(p => p._id);

      await Product.deleteMany({ _id: { $in: expiredIds } });

      console.log(`🗑️ Deleted ${expiredIds.length} expired products`);
    }
  } catch (err) {
    console.error("Error in cron job:", err);
  }
});


