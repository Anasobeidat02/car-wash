const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRouters = require("./routers/userRouters");

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
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // بيانات وهمية مؤقتة
  const dummyUser = {
    email: "test@example.com",
    password: "123456",
  };

  if (email === dummyUser.email && password === dummyUser.password) {
    return res.status(200).json({ message: "Login successful" });
  } else {
    return res.status(401).json({ message: "Incorrect email or password" });
  }
});

app.get("/signUp", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "sign up.html"));
});

const PORT = process.env.PORT || 3000;
console.log("Mongo URI:", process.env.MONGO_URI);
app.listen(3000, () => {
  console.log(` Server is running on port ${PORT}`);
});
