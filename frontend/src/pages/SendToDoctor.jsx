import { useState, useEffect } from "react";
import API from "../api/axios";
import "./SendToDoctor.css";

function SendToDoctor() {
  const [patients, setPatients] = useState([]);

  // Fetch patients eligible to send to doctor
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await API.get("/patients/nurse-list");
        // Only show patients with at least one lab report
       const readyPatients = res.data.filter(p => p.labReports?.length && p.status === "pending");

        setPatients(readyPatients);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };
    fetchPatients();
  }, []);

  const handleSend = async (patientId) => {
    try {
      await API.post(`/patients/${patientId}/send-to-doctor`);
      alert("Patient sent for doctor consultation!");
      setPatients(prev => prev.filter(p => p._id !== patientId));
    } catch (err) {
      console.error("Error sending patient:", err);
      alert(err.response?.data?.message || "Error sending patient");
    }
  };

  return (
    <div className="send-doctor-container">
      <h2>Send Patients to Doctor</h2>

      {patients.length === 0 ? (
        <p>No patients ready to send.</p>
      ) : (
        <ul className="patient-list">
          {patients.map((p) => (
            <li key={p._id}>
              {p.name} (Age: {p.age})
              <button onClick={() => handleSend(p._id)}>Send to Doctor</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SendToDoctor;
