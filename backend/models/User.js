const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, default: null },
  password: { type: String, default: null }, // optional for now
  role: { type: String, enum: ["doctor", "nurse", "lab", "patient", "admin"], required: true }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
