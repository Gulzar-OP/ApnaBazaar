import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

// 📦 Routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();

// ================= MIDDLEWARE =================

// 🍪 Parse cookies
app.use(cookieParser());

// 🔐 CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.FRONTEND_URL,
    ].filter(Boolean), // ✅ remove undefined
    credentials: true,
  })
);

// 📦 Body parser
app.use(express.json());

// ================= ROUTES =================

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

// ================= HEALTH CHECK =================
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "API is running 🚀" });
});

// ================= STATIC FRONTEND =================

if (process.env.NODE_ENV === "production") {
  // ⚠️ Vite uses 'dist', not 'build'
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.use((req, res) => {
    res.sendFile(
      path.resolve(__dirname, '../frontend/dist/index.html')
    );
  });
} else {
  app.get("/", (req, res) => {
    res.send("ApnaBazaar API is running in Development mode...");
  });
}

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    message: err.message || "Server Error",
  });
});

// ================= SERVER =================
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 4000;

    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("DB Connection Failed ❌", err);
    process.exit(1);
  }
};

startServer();