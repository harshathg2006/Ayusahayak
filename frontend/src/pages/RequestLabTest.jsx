import { useState, useEffect } from "react";
import API from "../api/axios";

function RequestLabTest() {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [testName, setTestName] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await API.get("/patients/nurse-list");
        setPatients(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatientId || !testName) return alert("Select patient and test");

    try {
      await API.post(`/patients/${selectedPatientId}/lab-request`, {
        test: testName,
        nurseNotes: notes
      });
      alert("Lab test requested successfully");
      setTestName("");
      setNotes("");
      setSelectedPatientId("");
    } catch (err) {
      console.error(err);
      alert("Error requesting lab test");
    }
  };

  return (
    <div>
      <h2>Request Lab Test</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Select Patient:
          <select value={selectedPatientId} onChange={(e) => setSelectedPatientId(e.target.value)}>
            <option value="">--Select--</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} (Age: {p.age})
              </option>
            ))}
          </select>
        </label>

        <label>
          Test Name:
          <input
            type="text"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            placeholder="Enter test name"
          />
        </label>

        <label>
          Notes (optional):
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>

        <button type="submit">Request Lab Test</button>
      </form>
    </div>
  );
}

export default RequestLabTest;
