import { useState, useEffect } from 'react';
import './LabDashboard.css';
import API from '../api/axios';

function LabDashboard() {
  const [patients, setPatients] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({}); // id -> file

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/patients');
        setPatients(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, []);

  const handleMarkCollected = async (id) => {
    try {
      await API.put(`/patients/${id}`, { status: "sample_collected" });
      setPatients(prev => prev.map(p => p._id === id ? { ...p, labReports: p.labReports } : p));
      alert('Marked as collected');
    } catch (err) {
      console.error(err);
      alert('Error');
    }
  };

  const handleFileChange = (id, file) => {
    setSelectedFiles(prev => ({ ...prev, [id]: file }));
  };

  const handleUploadReport = async (id) => {
    const file = selectedFiles[id];
    if (!file) return alert('Please select a file first');
    const formData = new FormData();
    formData.append('report', file);
    formData.append('test', 'Lab Test');

    try {
      await API.post(`/patients/${id}/report`, formData);
      alert('Report uploaded');
      const res = await API.get('/patients');
      setPatients(res.data);
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  return (
    <div className="lab-dashboard">
      <h2>Today's Lab Bookings</h2>
      <table>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Test(s)</th>
            <th>Latest Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => {
            const latest = p.labReports && p.labReports.length ? p.labReports[p.labReports.length - 1] : null;
            return (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{latest ? latest.test : 'No test yet'}</td>
                <td>{latest ? latest.status.replace('_',' ') : 'pending'}</td>
                <td>
                  <button onClick={() => handleMarkCollected(p._id)}>Mark Collected</button>
                  <input type="file" accept="application/pdf" onChange={(e) => handleFileChange(p._id, e.target.files[0])} />
                  <button onClick={() => handleUploadReport(p._1d ? p._id : p._id)}>Upload Report</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default LabDashboard;
