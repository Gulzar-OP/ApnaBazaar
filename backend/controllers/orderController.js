import sendEmail from "../utils/sendEmail.js";
import Order from "../models/Order.js";

// ================= ADD ORDER =================
const addOrderItems = async (req, res) => {
  try {
    const { items, totalAmount, address, paymentId } = req.body;

    // 🛑 Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // 🛑 Validate payment (IMPORTANT)
    if (!paymentId) {
      return res.status(400).json({ message: "Payment not verified" });
    }

    // 🆕 Create order
    const order = await Order.create({
      userId: req.user._id,
      items,
      totalAmount,
      address,
      paymentId,
      status: "paid", // ✅ after payment verification
    });

    // 📧 Send confirmation email (non-blocking recommended)
    const message = `
      <h2>Order Confirmation</h2>
      <p>Hello ${req.user.name},</p>
      <p>Your order has been placed successfully 🎉</p>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
      <p><strong>Delivery Address:</strong> ${address.street}, ${address.city}</p>
      <p>Thank you for shopping with ShopNest!</p>
    `;

    // ⚡ don't block response if email fails
    sendEmail({
      email: req.user.email,
      subject: "ShopNest - Order Confirmation",
      message,
    }).catch((err) => console.error("Email error:", err));

    res.status(201).json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET MY ORDERS =================
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate("items.productId", "name price imageUrl") // ✅ optimized
      .sort({ createdAt: -1 }); // 🆕 latest first

    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL ORDERS (ADMIN) =================
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE ORDER STATUS =================
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🛑 Validate status
    const validStatus = ["pending", "paid", "shipped", "delivered", "cancelled"];

    if (status && !validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    order.status = status ?? order.status;

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= EXPORT =================
export {
  addOrderItems,
  getMyOrders,
  getOrders,
  updateOrderStatus,
};