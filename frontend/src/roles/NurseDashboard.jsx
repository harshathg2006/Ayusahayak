import { useNavigate } from 'react-router-dom';
import './NurseDashboard.css'; // optional, for styling

function NurseDashboard() {
  const navigate = useNavigate();

  return (
    <div className="nurse-dashboard">
      <h2>Nurse Dashboard</h2>
      <p>Monitor vitals, assist in diagnosis, and manage patient workflow</p>

      <div className="nurse-actions">
        <button onClick={() => navigate('/nurse/new-patient')}>
          Register New Patient
        </button>

        <button onClick={() => navigate('/nurse/upload-lab-reports')}>
          Upload Lab Reports
        </button>

        <button onClick={() => navigate('/nurse/send-to-doctor')}>
          Send Patient to Doctor
        </button>
      </div>
    </div>
  );
}

export default NurseDashboard;
