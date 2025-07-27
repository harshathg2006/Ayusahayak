const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Test route
app.get("/api", (req, res) => {
  res.json({ message: "Ayusahayak Backend Running ✅" });
});

// Route to accept symptom input
app.post("/api/symptoms", (req, res) => {
  const symptoms = req.body.symptoms; // Array of symptoms
  // Dummy test mapping
  const testRecommendation = ["CBC", "Malaria Smear"];
  res.json({ recommendedTests: testRecommendation });
});

app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));