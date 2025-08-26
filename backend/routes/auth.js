const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Patient = require("../models/Patient");
const jwt = require("jsonwebtoken");

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { username, role } = req.body;
  if (!username || !role) {
    return res.status(400).json({ message: "username and role required" });
  }

  try {
    let user = await User.findOne({ username });

    // If patient role, allow login via Patient collection
    if (!user && role === "patient") {
      const patient = await Patient.findOne({ name: username }).populate("patientUserId");
      if (patient && patient.patientUserId) {
        user = patient.patientUserId;
      } else if (patient) {
        // If no linked User, create a temporary User object
        user = {
          _id: patient._id,
          username: patient.name,
          role: "patient"
        };
      }
    }

    if (!user) return res.status(401).json({ message: "User not found" });
    if (user.role !== role) return res.status(401).json({ message: "Role does not match" });

    const payload = { id: user._id, role: user.role, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: payload });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
