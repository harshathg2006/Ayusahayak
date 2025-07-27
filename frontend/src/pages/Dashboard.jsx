import DoctorDashboard from '../roles/DoctorDashboard';
import NurseDashboard from '../roles/NurseDashboard';
import LabDashboard from '../roles/LabDashboard';
import PatientDashboard from '../roles/PatientDashboard';

function Dashboard({ role }) {
  switch (role) {
    case 'doctor':
      return <DoctorDashboard />;
    case 'nurse':
      return <NurseDashboard />;
    case 'lab':
      return <LabDashboard />;
    case 'patient':
      return <PatientDashboard />;
    default:
      return <div>Invalid Role</div>;
  }
}

export default Dashboard;