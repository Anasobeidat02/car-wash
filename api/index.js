const express = require("express");
const app = express();
const path = require("path");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRouters = require("./routers/userRouters");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const User = require("./models/User"); // تأكد من المسار حسب مشروعك

dotenv.config();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "client")));

// السماح للوصول إلى ملفات الفرونت
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "sign_up.html"));
});

app.use("/api", userRouters);

// Middleware للتحقق من التوكن
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token Verification Error:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ تسجيل الدخول اليدوي
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    if (!user.password) {
      return res.status(401).json({ message: "This account uses Google login. Please use Google Sign-In." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ تسجيل الدخول عبر جوجل
app.post("/login/google", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Received Google login data:", { email });

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign up first." });
    }

    if (user.password !== null) {
      return res.status(401).json({ message: "This account uses manual login. Please use email and password." });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Google login successful",
      token,
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google Login Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ تسجيل مستخدم جديد (يدوي)
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    // إصدار توكن بعد التسجيل
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ تسجيل مستخدم عبر جوجل
app.post("/signup/google", async (req, res) => {
  try {
    const { username, email, role } = req.body;
    console.log("Received Google signup data:", { username, email, role });

    if (!username || !email || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let user = await User.findOne({ email });
    if (user) {
      // إذا كان المستخدم موجودًا، أصدر توكن بدلاً من إرجاع "User already exists"
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );
      return res.status(200).json({
        message: "User already exists",
        token,
        user: {
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    }

    user = new User({
      username,
      email,
      password: null,
      role,
    });

    await user.save();
    console.log("User saved successfully:", user);

    // إصدار توكن بعد التسجيل
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(201).json({
      message: "Google signup successful",
      token,
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google Signup Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Endpoint محمي (مثال)
app.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({
    message: "Access granted",
    user: {
      userId: req.user.userId,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

// تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});