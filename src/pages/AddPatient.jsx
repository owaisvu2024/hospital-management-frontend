import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function AddPatient() {
  const [formData, setFormData] = useState({
    patientName: '',
    gender: 'Male',
    email: '',
    bloodGroup: '',
    insuranceId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // 🌟 Success notification banner state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Insurance ID agar khali ho ya '0' ho toh null bhejo taake backend 400 error na de
    const payload = {
      ...formData,
      insuranceId: formData.insuranceId && formData.insuranceId !== '0' && Number(formData.insuranceId) !== 0 
        ? Number(formData.insuranceId) 
        : null
    };

    API.post('/patient/post', payload)
      .then(() => {
        setSuccess('Patient added successfully! Redirecting...');
        setTimeout(() => {
          navigate('/patients');
        }, 1200); // 1.2 seconds baad khud hi redirect ho jayega
      })
      .catch((err) => {
        console.error("Error adding patient:", err);
        const backendMessage = 
          err.response?.data?.message || 
          err.response?.data?.error || 
          err.response?.data || 
          'Failed to add patient. Please try again.';
        
        setError(typeof backendMessage === 'object' ? JSON.stringify(backendMessage) : backendMessage);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 flex justify-center items-center transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Add New Patient</h2>

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
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">Patient Name</label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">Blood Group</label>
            <input
              type="text"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="e.g. B+, O+"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">Insurance ID (Optional)</label>
            <input
              type="number"
              name="insuranceId"
              value={formData.insuranceId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="Enter insurance ID if applicable"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              {loading ? 'Saving...' : 'Save Patient'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/patients')}
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

export default AddPatient;