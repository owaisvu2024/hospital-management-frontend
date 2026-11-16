import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';

function EditInsurance() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    policyNumber: '',
    provider: '',
    validUntil: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // 🌟 Success notification banner state
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/insurance/get/${id}`)
      .then((res) => {
        setFormData({
          policyNumber: res.data.policyNumber || '',
          provider: res.data.provider || '',
          validUntil: res.data.validUntil || ''
        });
      })
      .catch((err) => {
        console.error("Error fetching insurance", err);
        setError('Failed to load insurance data.');
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Backend patch endpoint: /insurance/update/{insuranceId}
    API.patch(`/insurance/update/${id}`, formData)
      .then(() => {
        setSuccess('Insurance updated successfully! Redirecting...');
        setTimeout(() => {
          navigate('/insurances');
        }, 1200); // 1.2 seconds baad khud hi redirect ho jayega
      })
      .catch((err) => {
        console.error("Error updating insurance:", err);
        const backendMessage = 
          err.response?.data?.message || 
          err.response?.data?.error || 
          err.response?.data || 
          'Failed to update insurance policy.';
        setError(typeof backendMessage === 'object' ? JSON.stringify(backendMessage) : backendMessage);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 flex justify-center items-center transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-md max-w-md w-full border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Edit Insurance</h2>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/35 border-l-4 border-red-500 p-4 mb-4">
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
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">Policy Number</label>
            <input
              type="text"
              name="policyNumber"
              value={formData.policyNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">Provider</label>
            <input
              type="text"
              name="provider"
              value={formData.provider}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">Valid Until</label>
            <input
              type="date"
              name="validUntil"
              value={formData.validUntil}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {loading ? 'Updating...' : 'Update Insurance'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/insurances')}
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

export default EditInsurance;