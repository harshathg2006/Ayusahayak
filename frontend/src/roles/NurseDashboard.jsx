import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NurseDashboard.css';

function NurseDashboard() {
  const navigate = useNavigate();

  return (
    <div className="nurse-dashboard">
      <h2>Nurse Dashboard</h2>
      <p>Monitor vitals, manage lab requests, and patient workflow</p>
<div className="nurse-actions">
  <button onClick={() => navigate('/nurse/new-patient')}>Register New Patient</button>
  <button onClick={() => navigate('/nurse/request-lab-test')}>Request Lab Test</button>
  <button onClick={() => navigate('/nurse/send-to-doctor')}>Send Patient to Doctor</button>
</div>

    </div>
  );
}

export default NurseDashboard;
