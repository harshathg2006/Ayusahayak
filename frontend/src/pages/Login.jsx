import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import API from '../api/axios';

function Login() {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('doctor');
  const [error, setError] = useState(''); // For inline error messages
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault?.();
    setError(''); // Reset previous error

    try {
      const res = await API.post('/auth/login', { username, role });
      const { token, user } = res.data;

      // Save auth info
      localStorage.setItem('auth', JSON.stringify({ token, user }));

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);

      // Show server error message or generic message
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Server error or network issue');
      }
    }
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
          <option value="admin">Admin</option>
        </select>

        {error && <div className="error-message">{error}</div>} {/* Inline error */}

        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
