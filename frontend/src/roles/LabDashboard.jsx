import { useState, useEffect } from "react";
import API from "../api/axios";
import "./LabDashboard.css";

function LabDashboard() {
  const [labRequests, setLabRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState({});

  useEffect(() => {
    fetchLabRequests();
  }, []);

  const fetchLabRequests = async () => {
    try {
      const res = await API.get("/patients");
      const allRequests = [];
      res.data.forEach((patient) => {
        patient.labRequests?.forEach((req) => {
          allRequests.push({
            ...req,
            patientName: patient.name,
            age: patient.age,
            gender: patient.gender,
            symptoms: patient.symptoms,
            vitals: patient.vitals,
            notes: patient.notes,
            patientId: patient._id,
          });
        });
      });
      setLabRequests(allRequests);
    } catch (err) {
      console.error(err);
      alert("Error fetching lab requests");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkReady = async (patientId, requestId) => {
    try {
      await API.post(`/patients/${patientId}/mark-lab-ready`, { labRequestId: requestId });
      fetchLabRequests();
    } catch (err) {
      console.error(err);
      alert("Failed to mark ready");
    }
  };

  const handleFileChange = (requestId, e) => {
    setFiles({ ...files, [requestId]: e.target.files[0] });
  };

  const handleAttachPDF = async (patientId, requestId) => {
    const file = files[requestId];
    if (!file) return alert("Select a PDF first");

    const formData = new FormData();
    formData.append("report", file);
    formData.append("labRequestId", requestId);

    try {
      await API.post(`/patients/${patientId}/attach-lab-report`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("PDF attached successfully");
      fetchLabRequests();
      setFiles({ ...files, [requestId]: null });
    } catch (err) {
      console.error(err);
      alert("Failed to attach PDF");
    }
  };

  const renderRequestsByStatus = (status) => {
    const filtered = labRequests.filter((r) => r.status === status);
    if (!filtered.length) return <p className="no-requests">No requests.</p>;

    return filtered.map((r, idx) => (
      <div key={idx} className="request-card">
        <div className="card-header">
          <h4>{r.patientName} (Age: {r.age})</h4>
          <span className={`status-label status-${r.status}`}>{r.status.replace("_", " ")}</span>
        </div>

        <div className="card-body">
          <p><strong>Gender:</strong> {r.gender}</p>
          <p><strong>Symptoms:</strong> {r.symptoms || "N/A"}</p>
          <p><strong>Vitals:</strong> {r.vitals || "N/A"}</p>
          {r.notes && <p><strong>Notes:</strong> {r.notes}</p>}
          <p><strong>Test:</strong> {r.test}</p>
          {r.requestedAt && <p><strong>Requested At:</strong> {new Date(r.requestedAt).toLocaleString()}</p>}
        </div>

        <div className="card-actions">
          {status === "requested" && (
            <button className="btn btn-primary" onClick={() => handleMarkReady(r.patientId, r._id)}>
              Mark Ready
            </button>
          )}

          {status === "ready" && (
            <div className="file-upload">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileChange(r._id, e)}
              />
              <button className="btn btn-success" onClick={() => handleAttachPDF(r.patientId, r._id)}>
                Attach PDF
              </button>
            </div>
          )}
        </div>
      </div>
    ));
  };

  if (loading) return <p className="loading-text">Loading lab requests...</p>;

  return (
    <div className="lab-dashboard">
      <h2>Lab Dashboard</h2>
      <div className="status-section">
        <h3>Requested</h3>
        {renderRequestsByStatus("requested")}
      </div>
      <div className="status-section">
        <h3>Ready</h3>
        {renderRequestsByStatus("ready")}
      </div>
      <div className="status-section">
        <h3>Attached</h3>
        {renderRequestsByStatus("attached")}
      </div>
    </div>
  );
}

export default LabDashboard;
