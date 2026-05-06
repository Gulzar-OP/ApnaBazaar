import User from "../models/User.js";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";

// 🔐 Generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ================= REGISTER USER =================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🛑 Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔐 Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 👤 Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // ❌ If user creation failed
    if (!user) {
      return res.status(400).json({ message: "Invalid user data" });
    }

    // 🔢 Generate OTP (6 digit)
    const otp = Math.floor(100000 + Math.random() * 900000);

    // 📧 Email message
    const message = `
      <h2>Welcome to Shoppy, ${name}!</h2>
      <p>Thanks for registering 🎉</p>
      <p>Your OTP is: <strong>${otp}</strong></p>
    `;

    // 📤 Send email
    await sendEmail({
      email: user.email,
      subject: "Welcome to Shoppy - OTP",
      message,
    });

    // ✅ Response
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN USER =================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 🔑 Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔐 Generate token
    const token = generateToken(user._id);

    // 🍪 Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // ✅ Response
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL USERS =================
const getUsers = async (req, res) => {
  try {
    // 🔍 Fetch users without password
    const users = await User.find().select("-password");

    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= EXPORT =================
export { registerUser, loginUser, getUsers };