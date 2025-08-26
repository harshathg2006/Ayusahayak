import { useState, useEffect } from 'react';
import './AdminDashboard.css';
import API from '../api/axios';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    role: 'doctor',
    email: '',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get('/users');
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/users', { username: form.name, role: form.role, email: form.email });
      setUsers([...users, res.data]);
      setForm({ name: '', role: 'doctor', email: '' });
    } catch (err) {
      console.error(err);
      alert('Error adding user: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await API.delete(`/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="section">
        <h3>Add New User (Doctor/Nurse/Lab/Patient)</h3>
        <form className="add-form" onSubmit={handleAddUser}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleInputChange}
            required
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleInputChange}
            required
          />
          <select name="role" value={form.role} onChange={handleInputChange}>
            <option value="doctor">Doctor</option>
            <option value="nurse">Nurse</option>
            <option value="lab">Lab Technician</option>
            <option value="patient">Patient</option>
          </select>
          <button type="submit">Add User</button>
        </form>
      </div>

      <div className="section">
        <h3>All Staff</h3>
        <ul>
          {users.length === 0 ? (
            <li>No users yet</li>
          ) : (
            users.map((user) => (
              <li key={user._id}>
                {user.username} ({user.role}) - {user.email}
                <button onClick={() => handleDeleteUser(user._id)}>Remove</button>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="section">
        <h3>Manage Bookings</h3>
        <p>Coming soon...</p>
      </div>

      <div className="section">
        <h3>Manage Patient Records</h3>
        <p>Coming soon...</p>
      </div>
    </div>
  );
}

export default AdminDashboard;
