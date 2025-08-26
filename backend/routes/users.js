const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

// require admin
router.use(auth(["admin"]));

// GET /api/users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ["doctor", "nurse", "lab", "patient"] } }).select("-__v");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/users
router.post("/", async (req, res) => {
  try {
    const { username, role, email } = req.body;
    if (!username || !role) return res.status(400).json({ message: "username and role required" });
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ username, role, email: email || null });
    await newUser.save();
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/users/:id
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
