import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('doctor');
  const navigate = useNavigate();

  const handleLogin = () => {
    const user = { username, role };
    localStorage.setItem('user', JSON.stringify(user));
    navigate('/dashboard');
  };

  return (
<div className="login-container">
  <div className="login-card">
    <h1>Welcome to Ayusahayak</h1>
    <input
      className="input-field"
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />
    <select
      className="input-field"
      value={role}
      onChange={(e) => setRole(e.target.value)}
    >
      <option value="doctor">Doctor</option>
      <option value="nurse">Nurse</option>
      <option value="lab">Lab Technician</option>
      <option value="patient">Patient</option>
    </select>
    <button className="login-button" onClick={handleLogin}>
      Login
    </button>
  </div>
</div>
  );
}

export default Login;