import { useState, useEffect } from 'react';
import './DoctorDashboard.css';
import API from '../api/axios';

function DoctorDashboard() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [videoCallActive, setVideoCallActive] = useState(false);
  const [consultationQueue, setConsultationQueue] = useState([]);
  const [prescriptionText, setPrescriptionText] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await API.get('/patients');
        setConsultationQueue(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPatients();
  }, []);

  const handleStartConsultation = (patient) => {
    setSelectedPatient(patient);
    setVideoCallActive(true);
  };

  const handleEndConsultation = () => {
    setSelectedPatient(null);
    setVideoCallActive(false);
    setChatOpen(false);
    setPrescriptionText('');
  };

  const handleSavePrescription = async () => {
    if (!selectedPatient) return;
    try {
      await API.put(`/patients/${selectedPatient._id}`, { prescription: prescriptionText });
      alert('Prescription saved!');
      // refresh selected patient
      const res = await API.get(`/patients/${selectedPatient._id}`);
      setSelectedPatient(res.data);
    } catch (err) {
      console.error(err);
      alert('Error saving prescription');
    }
  };

  return (
    <div className="doctor-dashboard">
      <h2>Doctor Dashboard</h2>

      {!selectedPatient && (
        <div className="queue-section">
          <h3>Incoming Consultation Queue</h3>
          <ul>
            {consultationQueue.map(patient => (
              <li key={patient._id}>
                {patient.name} (Age: {patient.age})
                <button onClick={() => handleStartConsultation(patient)}>Start Consultation</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedPatient && (
        <div className="consultation-section">
          <h3>Consulting: {selectedPatient.name}</h3>

          {videoCallActive && (
            <div className="video-call-box">
              <p>📹 Video Consultation Active (Integrate Jitsi Here)</p>
              <button onClick={() => setVideoCallActive(false)}>End Video</button>
            </div>
          )}

          <div className="history-box">
            <h4>Patient Medical History</h4>
            <p>History details go here (e.g., past prescriptions, vitals, lab results)</p>
            <ul>
              {selectedPatient.prescriptions?.map((p, idx) => (
                <li key={idx}>{new Date(p.createdAt).toLocaleString()} - {p.text}</li>
              ))}
            </ul>
          </div>

          <div className="prescription-box">
            <h4>Prescription & Advice</h4>
            <textarea
              placeholder="Enter prescription or advice here..."
              value={prescriptionText}
              onChange={(e) => setPrescriptionText(e.target.value)}
            />
            <button onClick={handleSavePrescription}>Save</button>
          </div>

          <div className="chat-box">
            <h4>Chat with Nurse</h4>
            <button onClick={() => setChatOpen(!chatOpen)}>
              {chatOpen ? "Hide Chat" : "Open Chat"}
            </button>
            {chatOpen && (
              <div className="chat-window">
                <p>Nurse: Ready to assist.</p>
                <input type="text" placeholder="Type message..." />
              </div>
            )}
          </div>

          <button className="end-btn" onClick={handleEndConsultation}>End Consultation</button>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;
