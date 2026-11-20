import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const inputClass =
  'w-full h-11 px-3.5 rounded-xl border border-gray-300 dark:border-ink-700 bg-white dark:bg-ink-950 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-400';
const labelClass = 'block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1.5';

function AddPatient() {
  const [formData, setFormData] = useState({
    patientName: '',
    gender: 'Male',
    email: '',
    bloodGroup: '',
    insuranceId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Insurance ID khali ya 0 ho to null bhejo taake backend 400 na de
    const payload = {
      ...formData,
      insuranceId:
        formData.insuranceId && formData.insuranceId !== '0' && Number(formData.insuranceId) !== 0
          ? Number(formData.insuranceId)
          : null,
    };

    API.post('/patient/post', payload)
      .then(() => {
        setSuccess('Patient added successfully! Redirecting...');
        setTimeout(() => navigate('/patients'), 1200);
      })
      .catch((err) => {
        console.error('Error adding patient:', err);
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
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl mx-auto bg-white dark:bg-ink-800 border border-gray-200 dark:border-ink-700 rounded-2xl shadow-sm p-5 md:p-7">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 text-center">Add New Patient</h2>

        {error && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-xl p-3 mb-4">
            <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900 rounded-xl p-3 mb-4">
            <p className="text-green-700 dark:text-green-300 text-sm font-medium">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Patient Name</label>
            <input type="text" name="patientName" value={formData.patientName} onChange={handleChange}
              required placeholder="Enter full name" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              required placeholder="example@email.com" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Blood Group</label>
            <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}
              required placeholder="e.g. B+, O+" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Insurance ID (Optional)</label>
            <input type="number" name="insuranceId" value={formData.insuranceId} onChange={handleChange}
              placeholder="Enter insurance ID if applicable" className={inputClass} />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-12 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded-xl font-semibold transition"
            >
              {loading ? 'Saving...' : 'Save Patient'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/patients')}
              className="flex-1 h-12 bg-slate-500 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-700 text-white rounded-xl font-semibold transition"
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