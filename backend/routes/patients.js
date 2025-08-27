const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Patient = require("../models/Patient");
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");

// Upload directory
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

/**
 * CREATE PATIENT (Nurse)
 */
router.post("/", auth(["nurse"]), async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = new User({ username: name, role: "patient", email });
    await user.save();

    const patient = new Patient({
      ...req.body,
      patientUserId: user._id,
      status: "pending"
    });
    await patient.save();

    res.json({ patient, user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

/**
 * GET ALL PATIENTS (Doctor, Lab, Admin)
 */
router.get("/", auth(["doctor", "lab", "admin"]), async (req, res) => {
  try {
    let query = {};

    // If doctor, show only patients pending consultation
    if (req.user.role === "doctor") {
      query.status = "pending_consultation";
    }

    const patients = await Patient.find(query)
      .populate("doctorId", "username")
      .sort({ createdAt: -1 });

    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET PATIENT BY USER ID (Patient)
 */
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

/**
 * NURSE LIST (patients not consulted)
 */
router.get("/nurse-list", auth(["nurse"]), async (req, res) => {
  try {
    const patients = await Patient.find({ status: { $ne: "consulted" } }).sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET PATIENT BY ID (Doctor/Lab/Admin/Patient)
 */
router.get("/:id", auth(["doctor", "lab", "admin", "patient"]), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    if (req.user.role === "patient" && patient.patientUserId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * UPDATE PATIENT (Doctor, Lab, Admin)
 */
router.put("/:id", auth(["doctor", "lab", "admin"]), async (req, res) => {
  try {
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

/**
 * UPLOAD LAB REPORT (Nurse)
 */
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

/**
 * REQUEST LAB TEST (Nurse)
 */
router.post("/:id/lab-request", auth(["nurse"]), async (req, res) => {
  try {
    const { test, nurseNotes } = req.body;
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    patient.labRequests.push({
      test,
      status: "requested",
      requestedAt: new Date(),
      nurseNotes: nurseNotes || ""
    });

    await patient.save();
    res.json({ message: "Lab test requested", patient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark lab request as ready (Lab)
router.post("/:id/mark-lab-ready", auth(["lab"]), async (req, res) => {
  try {
    const { labRequestId } = req.body;
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const request = patient.labRequests.id(labRequestId);
    if (!request) return res.status(404).json({ message: "Lab request not found" });

    request.status = "ready";
    await patient.save();
    res.json({ message: "Lab request marked ready", patient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


/**
 * SEND PATIENT TO DOCTOR (Nurse)
 */
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

/**
 * MARK CONSULTED (Nurse)
 */
router.post("/:id/mark-consulted", auth(["doctor"]), async (req, res) => {
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

// POST /patients/:id/attach-lab-report
router.post("/:id/attach-lab-report", auth(["lab"]), upload.single("report"), async (req, res) => {
  try {
    const { labRequestId } = req.body;
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const request = patient.labRequests.id(labRequestId);
    if (!request) return res.status(404).json({ message: "Lab request not found" });

    request.status = "attached";

    patient.labReports.push({
      test: request.test,
      status: "report_sent",
      fileUrl: `/uploads/${req.file.filename}`,
      uploadedAt: new Date(),
    });

    await patient.save();
    res.json({ message: "Lab report attached", patient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
