import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewPatient.css';

function NewPatient() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    symptoms: '',
    vitals: '',
    notes: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting patient:', form);
    // Later: send to backend here
    alert('Patient registered successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="patient-form-container">
      <h2>Register New Patient</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Patient Name" onChange={handleChange} required />
        <input name="age" placeholder="Age" type="number" onChange={handleChange} required />
        <select name="gender" onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <textarea name="symptoms" placeholder="Symptoms" onChange={handleChange} required />
        <textarea name="vitals" placeholder="Vitals (e.g., BP, Temp)" onChange={handleChange} />
        <textarea name="notes" placeholder="Additional Notes" onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default NewPatient;