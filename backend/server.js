require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const patientRoutes = require("./routes/patients");

const app = express();

app.use(cors());
app.use(express.json());

// serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// api routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/patients", patientRoutes);

// connect db and start
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB connected");
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
  console.error("MongoDB connection error:", err);
});
