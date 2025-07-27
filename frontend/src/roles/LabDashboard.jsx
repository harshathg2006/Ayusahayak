// Ayusahayak/src/roles/LabDashboard.jsx
import { useState, useEffect } from 'react';
import './LabDashboard.css';

function LabDashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Dummy data fetch simulation
    setBookings([
      { id: 1, patient: 'Ravi', test: 'CBC', status: 'pending' },
      { id: 2, patient: 'Neha', test: 'Lipid Panel', status: 'sample_collected' },
    ]);
  }, []);

  const handleMarkCollected = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'sample_collected' } : b));
  };

  const handleUploadReport = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'report_sent' } : b));
    alert('Patient notified (simulated)');
  };

  return (
    <div className="lab-dashboard">
      <h2>Today's Lab Bookings</h2>
      <table>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Test</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id}>
              <td>{b.patient}</td>
              <td>{b.test}</td>
              <td>{b.status.replace('_', ' ')}</td>
              <td>
                {b.status === 'pending' && <button onClick={() => handleMarkCollected(b.id)}>Mark Collected</button>}
                {b.status === 'sample_collected' && (
                  <>
                    <input type="file" accept="application/pdf" />
                    <button onClick={() => handleUploadReport(b.id)}>Upload Report</button>
                  </>
                )}
                {b.status === 'report_sent' && <span>✅ Sent</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LabDashboard;