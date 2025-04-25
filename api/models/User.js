const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      minlength: [3, "Username must be at least 3 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: false,
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["customer", "manager", "employee"],
      required: [true, "User role is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
