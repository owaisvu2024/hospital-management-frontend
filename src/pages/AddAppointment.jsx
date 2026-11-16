import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function AddAppointment() {
  const [formData, setFormData] = useState({
    appointmentDate: '',
    reason: '',
    status: '',
    patientId: '',
    doctorId: ''
  });
  
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // 🌟 Success notification banner state
  const navigate = useNavigate();

  useEffect(() => {
    // Dropdowns ke liye Patients aur Doctors fetch kar rahe hain
    API.get('/patient/getall?size=100')
      .then((res) => setPatients(res.data.content || res.data))
      .catch((err) => console.error("Error fetching patients", err));

    API.get('/doctor/getall?size=100')
      .then((res) => setDoctors(res.data.content || res.data))
      .catch((err) => console.error("Error fetching doctors", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    API.post('/appointment/post', {
      ...formData,
      patientId: Number(formData.patientId),
      doctorId: Number(formData.doctorId)
    })
      .then(() => {
        setSuccess('Appointment booked successfully! Redirecting...');
        setTimeout(() => {
          navigate('/appointments');
        }, 1200); // 1.2 seconds baad khud hi redirect ho jayega
      })
      .catch((err) => {
        console.error("Error adding appointment:", err);
        const backendMessage = 
          err.response?.data?.message || 
          err.response?.data?.error || 
          err.response?.data || 
          'Failed to book appointment.';
        setError(typeof backendMessage === 'object' ? JSON.stringify(backendMessage) : backendMessage);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 flex justify-center items-center transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Book New Appointment</h2>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/35 border-l-4 border-green-500 p-4 mb-4">
            <p className="text-green-700 dark:text-green-300 text-sm font-medium">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">Appointment Date</label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">Reason</label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="e.g. Fever, Checkup"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <option value="">Select Status</option>
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">Select Patient</label>
            <select
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <option value="">Select Patient</option>
              {patients.map((p) => (
                <option key={p.patientId} value={p.patientId}>
                  {p.patientName} (ID: {p.patientId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">Select Doctor</label>
            <select
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <option value="">Select Doctor</option>
              {doctors.map((d) => (
                <option key={d.doctorId} value={d.doctorId}>
                  Dr. {d.doctorName} - {d.specialization} (ID: {d.doctorId})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/appointments')}
              className="w-full bg-gray-500 dark:bg-gray-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAppointment;