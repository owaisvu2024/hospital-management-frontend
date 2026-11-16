import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';

function EditDepartment() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    departName: '',
    doctorId: ''
  });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // 🌟 Success notification banner state
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/doctor/getall?size=100')
      .then((res) => setDoctors(res.data.content || res.data))
      .catch((err) => console.error("Error fetching doctors", err));

    API.get(`/department/get/${id}`)
      .then((res) => {
        setFormData({
          departName: res.data.departName || '',
          doctorId: res.data.doctorId || ''
        });
      })
      .catch((err) => {
        console.error("Error fetching department", err);
        setError('Failed to load department data.');
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

    API.patch(`/department/patch/${id}`, {
      departName: formData.departName,
      doctorId: formData.doctorId ? Number(formData.doctorId) : null
    })
      .then(() => {
        setSuccess('Department updated successfully! Redirecting...');
        setTimeout(() => {
          navigate('/departments');
        }, 1200); // 1.2 seconds baad khud hi redirect ho jayega
      })
      .catch((err) => {
        console.error("Error updating department:", err);
        const backendMessage = 
          err.response?.data?.message || 
          err.response?.data?.error || 
          err.response?.data || 
          'Failed to update department.';
        setError(typeof backendMessage === 'object' ? JSON.stringify(backendMessage) : backendMessage);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 flex justify-center items-center transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-md max-w-md w-full border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Edit Department</h2>

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
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">Department Name</label>
            <input
              type="text"
              name="departName"
              value={formData.departName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">Doctor Head</label>
            <select
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <option value="">Select Doctor Head</option>
              {doctors.map((d) => (
                <option key={d.doctorId || d.id} value={d.doctorId || d.id}>
                  Dr. {d.doctorName} - {d.specialization} (ID: {d.doctorId || d.id})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {loading ? 'Updating...' : 'Update Department'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/departments')}
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

export default EditDepartment;