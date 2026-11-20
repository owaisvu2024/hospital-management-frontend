import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';

const inputClass =
  'w-full h-11 px-3.5 rounded-xl border border-gray-300 dark:border-ink-700 bg-white dark:bg-ink-950 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-400';
const labelClass = 'block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1.5';

function EditDoctor() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    doctorName: '',
    email: '',
    specialization: '',
    maxPatientLimit: '',
    doctorTime: '',
  });
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/doctor/get/${id}`)
      .then((response) => {
        const data = response.data;
        setFormData({
          doctorName: data.doctorName || '',
          email: data.email || '',
          specialization: data.specialization || '',
          maxPatientLimit: data.maxPatientLimit || '',
          doctorTime: data.doctorTime || '',
        });
        setFetching(false);
      })
      .catch((err) => {
        console.error('Error fetching doctor for edit:', err);
        setError('Failed to load doctor details.');
        setFetching(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const payload = { ...formData, maxPatientLimit: Number(formData.maxPatientLimit) };

    API.patch(`/doctor/patch/${id}`, payload)
      .then(() => {
        setSuccess('Doctor updated successfully! Redirecting...');
        setTimeout(() => navigate('/doctors'), 1200);
      })
      .catch((err) => {
        console.error('Error updating doctor:', err);
        const backendMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.response?.data ||
          'Failed to update doctor.';
        setError(typeof backendMessage === 'object' ? JSON.stringify(backendMessage) : backendMessage);
        setSaving(false);
      });
  };

  if (fetching) {
    return (
      <div className="p-10 text-center font-semibold text-blue-600 dark:text-teal-300">
        Loading doctor details...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl mx-auto bg-white dark:bg-ink-800 border border-gray-200 dark:border-ink-700 rounded-2xl shadow-sm p-5 md:p-7">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 text-center">
          Edit Doctor (ID: {id})
        </h2>

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

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className={labelClass}>Doctor Name</label>
            <input type="text" name="doctorName" value={formData.doctorName} onChange={handleChange}
              required className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              required className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Specialization</label>
            <input type="text" name="specialization" value={formData.specialization} onChange={handleChange}
              required className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Max Patient Limit</label>
            <input type="number" name="maxPatientLimit" value={formData.maxPatientLimit} onChange={handleChange}
              required className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Doctor Timing</label>
            <input type="text" name="doctorTime" value={formData.doctorTime} onChange={handleChange}
              required className={inputClass} />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 h-12 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 text-white rounded-xl font-semibold transition"
            >
              {saving ? 'Updating...' : 'Update Doctor'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/doctors')}
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

export default EditDoctor;