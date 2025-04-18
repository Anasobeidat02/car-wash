const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRouters = require("./routers/userRouters");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // تأكد من المسار حسب مشروعك

dotenv.config();
connectDB();

// السماح للوصول لملفات الفرونت
app.use(express.static(path.join(__dirname, "..", "client")));
app.use(express.json());
app.use("/api", userRouters);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "login.html"));
});

// ✅ API: POST /login
// ✅ تسجيل دخول
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // تحقق من وجود الحقول المطلوبة
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // البحث عن المستخدم في قاعدة البيانات
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    // مقارنة الباسوورد المدخل مع الباسوورد المخزن
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    // تسجيل الدخول ناجح
    res
      .status(200)
      .json({
        message: "Login successful",
        user: { username: user.username, email: user.email, role: user.role },
      });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/signUp", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "sign up.html"));
});

// ✅ تسجيل مستخدم جديد
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // تحقق من وجود الحقول المطلوبة
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // تأكد الإيميل مش مسجل من قبل
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // تشفير الباسوورد
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء وحفظ المستخدم
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
console.log("Mongo URI:", process.env.MONGO_URI);
app.listen(3000, () => {
  console.log(` Server is running on port ${PORT}`);
});
