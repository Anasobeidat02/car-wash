const express = require("express");
const app = express();
const path = require("path");

// السماح للوصول لملفات الفرونت
app.use(express.static(path.join(__dirname, "..", "client")));
app.use(express.json());

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "login.html"));
});
app.get("/signUp", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "sign up.html"));
});

app.listen(3000, () => {
  console.log("الخادم يعمل على http://localhost:3000");
});
