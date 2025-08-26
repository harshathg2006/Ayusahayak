const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Patient = require("../models/Patient");
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");
const authMiddleware = require('../middleware/authMiddleware'); 



// upload dir
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, uploadDir); },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// POST /api/patients  (nurse)
// POST /api/patients  (nurse creates a patient + login account)
// POST /api/patients  (nurse)
router.post("/", auth(["nurse"]), async (req, res) => {
  try {
    const { name, email } = req.body;

    // 1. Create User with role 'patient' (no password)
    const user = new User({ username: name, role: "patient", email });
    await user.save();

    // 2. Create Patient record and link to User, set default status
    const patient = new Patient({
      ...req.body,
      patientUserId: user._id,
      status: "pending"   // <- ensure new patient has status
    });
    await patient.save();

    res.json({ patient, user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});





// GET /api/patients  (doctor, lab, admin)
router.get("/", auth(["doctor", "lab", "admin"]), async (req, res) => {
  try {
    const patients = await Patient.find().populate("doctorId", "username").sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /patients/me
router.get("/me", auth(), async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientUserId: req.user.id })
      .populate("doctorId", "name email")
      .populate("prescriptions.doctorId", "name email");

    if (!patient) return res.status(404).json({ message: "Patient record not found" });

    res.json(patient);
  } catch (err) {
    console.error("Error fetching patient by userId:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/patients/nurse-list  (nurse)
router.get("/nurse-list", auth(["nurse"]), async (req, res) => {
  try {
    // List all patients not yet marked as consulted
    const patients = await Patient.find({ status: { $ne: "consulted" } }).sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/patients/:id  (doctor/lab/admin/patient)
router.get("/:id", auth(["doctor", "lab", "admin", "patient"]), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    if (req.user.role === "patient") {
      if (!patient.patientUserId || patient.patientUserId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/patients/me  (patient)
// GET /api/patients/me  (patient)





// PUT /api/patients/:id  (doctor, lab, admin)
router.put("/:id", auth(["doctor", "lab", "admin"]), async (req, res) => {
  try {
    // If a doctor sends { prescription: "text" } then push to prescriptions
    if (req.body.prescription) {
      const patient = await Patient.findById(req.params.id);
      if (!patient) return res.status(404).json({ message: "Patient not found" });
      patient.prescriptions.push({
        doctorId: req.user.id,
        text: req.body.prescription
      });
      await patient.save();
      return res.json(patient);
    }

    const updated = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/patients/:id/report  (nurse)
router.post("/:id/report", auth(["nurse"]), upload.single("report"), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const fileUrl = `/uploads/${req.file.filename}`;
    patient.labReports.push({
      test: req.body.test || "Unknown Test",
      status: "report_sent",
      fileUrl,
      uploadedAt: new Date()
    });

    await patient.save();
    res.json({ message: "Report uploaded", fileUrl, patient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/patients/:id/send-to-doctor  (nurse)
router.post("/:id/send-to-doctor", auth(["nurse"]), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    if (!patient.labReports?.length) return res.status(400).json({ message: "No lab reports uploaded" });

    patient.status = "pending_consultation";
    await patient.save();
    res.json({ message: "Patient sent for doctor consultation" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// POST /api/patients/:id/mark-consulted  (nurse)
router.post("/:id/mark-consulted", auth(["nurse"]), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    patient.status = "consulted";
    await patient.save();
    res.json({ message: "Patient marked as consulted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});






module.exports = router;
