import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';

const inputClass =
  'w-full h-11 px-3.5 rounded-xl border border-gray-300 dark:border-ink-700 bg-white dark:bg-ink-950 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-400';
const labelClass = 'block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1.5';

function EditPatient() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    patientName: '',
    gender: 'Male',
    email: '',
    bloodGroup: '',
    insuranceId: '',
  });
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/patient/get/${id}`)
      .then((response) => {
        const data = response.data;
        setFormData({
          patientName: data.patientName || '',
          gender: data.gender || 'Male',
          email: data.email || '',
          bloodGroup: data.bloodGroup || '',
          insuranceId: data.insuranceId || '',
        });
        setFetching(false);
      })
      .catch((err) => {
        console.error('Error fetching patient for edit:', err);
        setError('Failed to load patient details.');
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

    const payload = {
      ...formData,
      insuranceId:
        formData.insuranceId && Number(formData.insuranceId) !== 0
          ? Number(formData.insuranceId)
          : null,
    };

    API.patch(`/patient/patch/${id}`, payload)
      .then(() => {
        setSuccess('Patient updated successfully! Redirecting...');
        setTimeout(() => navigate('/patients'), 1200);
      })
      .catch((err) => {
        console.error('Error updating patient:', err);
        setError('Failed to update patient.');
        setSaving(false);
      });
  };

  if (fetching) {
    return (
      <div className="p-10 text-center font-semibold text-blue-600 dark:text-teal-300">
        Loading patient details...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl mx-auto bg-white dark:bg-ink-800 border border-gray-200 dark:border-ink-700 rounded-2xl shadow-sm p-5 md:p-7">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 text-center">
          Edit Patient (ID: {id})
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
            <label className={labelClass}>Patient Name</label>
            <input type="text" name="patientName" value={formData.patientName} onChange={handleChange}
              required className={inputClass} />
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
              required className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Blood Group</label>
            <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}
              required className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Insurance ID</label>
            <input type="number" name="insuranceId" value={formData.insuranceId} onChange={handleChange}
              className={inputClass} />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 h-12 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 text-white rounded-xl font-semibold transition"
            >
              {saving ? 'Updating...' : 'Update Patient'}
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

export default EditPatient;