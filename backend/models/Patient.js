const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const labReportSchema = new mongoose.Schema({
  test: String,
  status: { type: String, enum: ["pending", "sample_collected", "report_sent"], default: "pending" },
  fileUrl: String,
  uploadedAt: Date
});

const labRequestSchema = new mongoose.Schema({
  test: String,
  status: { type: String, enum: ["requested", "ready", "attached"], default: "requested" },
  requestedAt: { type: Date, default: Date.now },
  nurseNotes: String
});

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  gender: { type: String, enum: ["male","female","other"], default: "other" },
  symptoms: String,
  vitals: String,
  notes: String,
  status: { type: String, enum: ["pending", "pending_consultation", "consulted"], default: "pending" },
  patientUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  prescriptions: [prescriptionSchema],
  labReports: [labReportSchema],       // now defined
  labRequests: [labRequestSchema]      // track requested/ready tests
}, { timestamps: true });

module.exports = mongoose.model("Patient", patientSchema);
