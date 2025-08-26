import { useState, useEffect } from "react";
import API from "../api/axios";
import "./UploadLabReports.css";

function UploadLabReports() {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [file, setFile] = useState(null);
  const [testName, setTestName] = useState("");

  // Fetch nurse-specific patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await API.get("/patients/nurse-list");
        setPatients(res.data);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };
    fetchPatients();
  }, []);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!selectedPatientId) return alert("Select a patient");
    if (!file) return alert("Select a file");

    const formData = new FormData();
    formData.append("report", file);
    formData.append("test", testName || "Unknown Test");

    try {
      await API.post(`/patients/${selectedPatientId}/report`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Report uploaded successfully!");
      setFile(null);
      setTestName("");
      setSelectedPatientId(null);

      // Refresh patient list
      const res = await API.get("/patients/nurse-list");
      setPatients(res.data);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading report");
    }
  };

  return (
    <div className="upload-lab-container">
      <h2>Upload Lab Reports</h2>

      {patients.length === 0 ? (
        <p>No patients pending lab reports.</p>
      ) : (
        <ul className="patient-list">
          {patients.map((p) => (
            <li
              key={p._id}
              className={selectedPatientId === p._id ? "selected" : ""}
              onClick={() => setSelectedPatientId(p._id)}
            >
              {p.name} (Age: {p.age})
            </li>
          ))}
        </ul>
      )}

      {selectedPatientId && (
        <div className="upload-section">
          <input
            type="text"
            placeholder="Test Name"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
          />
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload Report</button>
        </div>
      )}
    </div>
  );
}

export default UploadLabReports;
