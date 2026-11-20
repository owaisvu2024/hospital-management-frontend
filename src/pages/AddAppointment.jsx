import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const inputClass =
  'w-full h-11 px-3.5 rounded-xl border border-gray-300 dark:border-ink-700 bg-white dark:bg-ink-950 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-400';
const labelClass = 'block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1.5';

function AddAppointment() {
  const [formData, setFormData] = useState({
    appointmentDate: '',
    reason: '',
    status: '',
    patientId: '',
    doctorId: '',
  });

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/patient/getall?size=100')
      .then((res) => setPatients(res.data.content || res.data))
      .catch((err) => console.error('Error fetching patients', err));

    API.get('/doctor/getall?size=100')
      .then((res) => setDoctors(res.data.content || res.data))
      .catch((err) => console.error('Error fetching doctors', err));
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
      doctorId: Number(formData.doctorId),
    })
      .then(() => {
        setSuccess('Appointment booked successfully! Redirecting...');
        setTimeout(() => navigate('/appointments'), 1200);
      })
      .catch((err) => {
        console.error('Error adding appointment:', err);
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
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl mx-auto bg-white dark:bg-ink-800 border border-gray-200 dark:border-ink-700 rounded-2xl shadow-sm p-5 md:p-7">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 text-center">Book New Appointment</h2>

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
            <label className={labelClass}>Appointment Date</label>
            <input type="date" name="appointmentDate" value={formData.appointmentDate}
              onChange={handleChange} required className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Reason</label>
            <input type="text" name="reason" value={formData.reason} onChange={handleChange}
              required placeholder="e.g. Fever, Checkup" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Status</label>
            <select name="status" value={formData.status} onChange={handleChange} required className={inputClass}>
              <option value="">Select Status</option>
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Select Patient</label>
            <select name="patientId" value={formData.patientId} onChange={handleChange} required className={inputClass}>
              <option value="">Select Patient</option>
              {patients.map((p) => (
                <option key={p.patientId} value={p.patientId}>
                  {p.patientName} (ID: {p.patientId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Select Doctor</label>
            <select name="doctorId" value={formData.doctorId} onChange={handleChange} required className={inputClass}>
              <option value="">Select Doctor</option>
              {doctors.map((d) => (
                <option key={d.doctorId} value={d.doctorId}>
                  Dr. {d.doctorName} - {d.specialization} (ID: {d.doctorId})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-12 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded-xl font-semibold transition"
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/appointments')}
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

export default AddAppointment;