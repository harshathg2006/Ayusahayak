import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientDashboard.css";
import API from "../api/axios";

function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("prescriptions");
  const [patient, setPatient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and is a patient
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (!auth?.user || auth.user.role !== "patient") {
      console.warn("Unauthorized access attempt to patient dashboard");
      navigate("/login");
      return;
    }

    const fetchPatient = async () => {
      try {
        const res = await API.get("/patients/me", {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setPatient(res.data);
      } catch (err) {
        console.error("Error fetching patient data:", err);

        // Log detailed error info
        if (err.response) {
          console.error("Server responded with:", err.response.data);
        } else if (err.request) {
          console.error("No response received. Request was:", err.request);
        } else {
          console.error("Error setting up request:", err.message);
        }

        navigate("/login");
      }
    };

    fetchPatient();
  }, [navigate]);

  if (!patient)
    return (
      <div className="patient-dashboard">
        <h2>Patient Dashboard</h2>
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="patient-dashboard">
      <h2>Patient Dashboard</h2>

      <div className="tabs">
        <button
          className={activeTab === "prescriptions" ? "active" : ""}
          onClick={() => setActiveTab("prescriptions")}
        >
          Prescriptions
        </button>
        <button
          className={activeTab === "lab" ? "active" : ""}
          onClick={() => setActiveTab("lab")}
        >
          Lab Reports
        </button>
        <button
          className={activeTab === "history" ? "active" : ""}
          onClick={() => setActiveTab("history")}
        >
          Medical History
        </button>
        <button
          className={activeTab === "notifications" ? "active" : ""}
          onClick={() => setActiveTab("notifications")}
        >
          Notifications
        </button>
      </div>

      {activeTab === "prescriptions" && (
        <div className="card">
          <h3>Your Prescriptions</h3>
          <ul>
            {patient.prescriptions?.length ? (
              patient.prescriptions.map((p, idx) => (
                <li key={idx}>
                  <strong>{new Date(p.createdAt).toLocaleString()}</strong> -{" "}
                  {p.text}
                </li>
              ))
            ) : (
              <li>No prescriptions yet</li>
            )}
          </ul>
        </div>
      )}

      {activeTab === "lab" && (
        <div className="card">
          <h3>Lab Reports</h3>
          <ul>
            {patient.labReports?.length ? (
              patient.labReports.map((r, idx) => (
                <li key={idx}>
                  {r.test} -{" "}
                  <span
                    className={`status ${r.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {r.status}
                  </span>
                  {r.fileUrl && (
                    <a
                      href={`http://localhost:5000${r.fileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="download-btn"
                    >
                      Download
                    </a>
                  )}
                </li>
              ))
            ) : (
              <li>No lab reports yet</li>
            )}
          </ul>
        </div>
      )}

      {activeTab === "history" && (
        <div className="card">
          <h3>Medical History</h3>
          <ul>
            {patient.prescriptions?.length ? (
              patient.prescriptions.map((p, idx) => (
                <li key={idx}>
                  <strong>{new Date(p.createdAt).toLocaleDateString()}</strong> -{" "}
                  {p.text}
                </li>
              ))
            ) : (
              <li>No medical history yet</li>
            )}
          </ul>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="card">
          <h3>Notifications</h3>
          <ul>
            <li>Welcome! You have no new notifications.</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default PatientDashboard;
