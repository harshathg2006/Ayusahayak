import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import NewPatient from './pages/NewPatient';

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login route - redirect to dashboard if already logged in */}
        <Route
          path="/login"
          element={
            (() => {
              const auth = JSON.parse(localStorage.getItem("auth"));
              const user = auth?.user;
              return user ? <Navigate to="/dashboard" /> : <Login />;
            })()
          }
        />

        {/* Dashboard route - protected */}
        <Route
          path="/dashboard"
          element={
            (() => {
              const auth = JSON.parse(localStorage.getItem("auth"));
              const user = auth?.user;
              return user ? <Dashboard role={user.role} /> : <Navigate to="/login" />;
            })()
          }
        />

        {/* Nurse-specific route */}
        <Route
          path="/nurse/new-patient"
          element={
            (() => {
              const auth = JSON.parse(localStorage.getItem("auth"));
              const user = auth?.user;
              return user?.role === "nurse" ? <NewPatient /> : <Navigate to="/dashboard" />;
            })()
          }
        />

        {/* Fallback route */}
        <Route
          path="*"
          element={
            (() => {
              const auth = JSON.parse(localStorage.getItem("auth"));
              const user = auth?.user;
              return <Navigate to={user ? "/dashboard" : "/login"} />;
            })()
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
