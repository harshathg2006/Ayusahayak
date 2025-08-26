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

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  gender: { type: String, enum: ["male","female","other"], default: "other" },
  symptoms: String,
  vitals: String,
  notes: String,
  patientUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // link if patient has account
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  prescriptions: [prescriptionSchema],
  labReports: [labReportSchema]
}, { timestamps: true });

module.exports = mongoose.model("Patient", patientSchema);
