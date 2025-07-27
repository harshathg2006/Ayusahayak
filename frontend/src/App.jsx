import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import NewPatient from './pages/NewPatient';

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={user ? <Dashboard role={user.role} /> : <Navigate to="/login" />} />
       <Route path="/nurse/new-patient" element={<NewPatient />} />

      </Routes>
    </Router>
  );
}

export default App;