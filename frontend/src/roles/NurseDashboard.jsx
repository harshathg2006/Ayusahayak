import { useNavigate } from 'react-router-dom';

function NurseDashboard() {
  const navigate = useNavigate();

  return (
    <div className="role-view">
      <h2>Nurse Dashboard</h2>
      <p>Monitor vitals, assist in diagnosis</p>
      <button onClick={() => navigate('/nurse/new-patient')}>Register New Patient</button>
    </div>
  );
}

export default NurseDashboard;