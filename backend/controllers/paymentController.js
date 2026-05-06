import Razorpay from "razorpay";
import crypto from "crypto";

// 🔹 Create Razorpay instance once (not inside function)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ================= CREATE ORDER =================
const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    // 🛑 Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: amount * 100, // 💰 Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`, // 🧾 unique receipt
    };

    const order = await razorpay.orders.create(options);

    res.status(201).json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= VERIFY PAYMENT =================
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // 🛑 Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    // 🔐 Create expected signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    // ✅ Verify signature
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // 🎉 Payment verified
    // 👉 Yaha DB me order update karo (IMPORTANT)
    // e.g. status = "paid"

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createOrder, verifyPayment };