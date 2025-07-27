import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h2>Ayusahayak</h2>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}

export default Navbar;