import { useState } from 'react';
import './DoctorDashboard.css';

function DoctorDashboard() {
const [selectedPatient, setSelectedPatient] = useState(null);
const [chatOpen, setChatOpen] = useState(false);
const [videoCallActive, setVideoCallActive] = useState(false);

const consultationQueue = [
{ id: 1, name: "Ravi Kumar", age: 35 },
{ id: 2, name: "Anjali Verma", age: 29 }
];

const handleStartConsultation = (patient) => {
setSelectedPatient(patient);
setVideoCallActive(true);
};

const handleEndConsultation = () => {
setSelectedPatient(null);
setVideoCallActive(false);
setChatOpen(false);
};

return (
<div className="doctor-dashboard">
<h2>Doctor Dashboard</h2>

php-template
Copy
Edit
  {!selectedPatient && (
    <div className="queue-section">
      <h3>Incoming Consultation Queue</h3>
      <ul>
        {consultationQueue.map(patient => (
          <li key={patient.id}>
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
      </div>

      <div className="prescription-box">
        <h4>Prescription & Advice</h4>
        <textarea placeholder="Enter prescription or advice here..."></textarea>
        <button>Save</button>
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