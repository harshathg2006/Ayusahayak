const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Patient = require("../models/Patient");
const auth = require("../middleware/authMiddleware");

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
router.post("/", auth(["nurse"]), async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.json(patient);
  } catch (err) {
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
router.get("/me", auth(["patient"]), async (req, res) => {
  try {
    let patient;

    // 1️⃣ Try to find patient linked to this user account
    if (req.user.id) {
      patient = await Patient.findOne({ patientUserId: req.user.id });
    }

    // 2️⃣ Fallback: if no linked patient, maybe the user has a default patientId in token
    // (optional: can store patientId in token when creating patient)
    if (!patient && req.user.patientId) {
      patient = await Patient.findById(req.user.patientId);
    }

    if (!patient) {
      return res.status(404).json({ message: "Patient record not found for this user" });
    }

    res.json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


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

// POST /api/patients/:id/report  (lab)
router.post("/:id/report", auth(["lab"]), upload.single("report"), async (req, res) => {
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

module.exports = router;
