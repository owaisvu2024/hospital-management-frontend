import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Auth Pages (Bina Header/Footer ke)
import Login from './pages/Login';
import Signup from './pages/Signup';

// Protected Pages (Header/Footer ke sath)
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import AddPatient from './pages/AddPatient';
import EditPatient from './pages/EditPatient';
import Doctors from './pages/Doctors';
import AddDoctor from './pages/AddDoctor';
import EditDoctor from './pages/EditDoctor';
import Appointments from './pages/Appointments';
import AddAppointment from './pages/AddAppointment';
import EditAppointment from './pages/EditAppointment';
import Departments from './pages/Departments';
import AddDepartment from './pages/AddDepartment';
import EditDepartment from './pages/EditDepartment';
import Insurances from './pages/Insurances';
import AddInsurance from './pages/AddInsurance';
import EditInsurance from './pages/EditInsurance';


function App() {
  return (
    <Routes>
      {/* Root URL '/' ko Login par redirect kar rahe hain */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* In tamam pages par Global Header aur Footer dikhega */}
      <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/add-patient" element={<AddPatient />} />
              <Route path="/edit-patient/:id" element={<EditPatient />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/add-doctor" element={<AddDoctor />} />
              <Route path="/edit-doctor/:id" element={<EditDoctor />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/add-appointment" element={<AddAppointment />} />
              <Route path="/edit-appointment/:id" element={<EditAppointment />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/add-department" element={<AddDepartment />} />
              <Route path="/edit-department/:id" element={<EditDepartment />} />
              <Route path="/insurances" element={<Insurances />} />
              <Route path="/add-insurance" element={<AddInsurance />} />
              <Route path="/edit-insurance/:id" element={<EditInsurance />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;