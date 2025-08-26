import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();

  // Get logged-in user from localStorage
  const auth = JSON.parse(localStorage.getItem('auth'));
  const username = auth?.user?.username;

  // Logout function
  const handleLogout = () => {
    // 1. Remove auth info
    localStorage.removeItem('auth');

    // 2. Navigate to login page
    navigate('/login');

    // 3. Optional: reload page to reset app state
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <h2 style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
        Ayusahayak
      </h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {username && <span>Hi, {username}</span>}
        {username && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
