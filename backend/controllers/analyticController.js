import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

// ================= ADMIN DASHBOARD STATS =================
const getAdminStats = async (req, res) => {
  try {
    // ⚡ Parallel execution (fast)
    const [totalOrders, totalProducts, totalUsers, revenueData] =
      await Promise.all([
        Order.countDocuments(),
        Product.countDocuments(),
        User.countDocuments({ role: "user" }),

        // 💰 MongoDB Aggregation for revenue
        Order.aggregate([
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$totalAmount" },
            },
          },
        ]),
      ]);

    // 📊 Extract revenue
    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    res.status(200).json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAdminStats };