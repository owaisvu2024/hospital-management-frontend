import React, { useState, useEffect } from 'react';
import StaffSignupModal from '../components/StaffSignupModal';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const modules = [
  { title: 'Patients Module', desc: 'View patient records, register new patients, and manage patient information seamlessly.', btn: 'Manage Patients', path: '/patients', top: 'border-t-blue-600', color: 'bg-blue-600 hover:bg-blue-700' },
  { title: 'Doctors Module', desc: 'Browse the list of medical professionals and check their availability and schedules.', btn: 'Manage Doctors', path: '/doctors', top: 'border-t-green-600', color: 'bg-green-600 hover:bg-green-700' },
  { title: 'Appointments Module', desc: 'Book new appointments, view the scheduling calendar, and manage patient visits.', btn: 'Manage Appointments', path: '/appointments', top: 'border-t-purple-600', color: 'bg-purple-600 hover:bg-purple-700' },
  { title: 'Insurance Module', desc: 'Manage insurance policies, track provider details, and monitor validity dates.', btn: 'Manage Insurances', path: '/insurances', top: 'border-t-yellow-500', color: 'bg-yellow-500 hover:bg-yellow-600' },
  { title: 'Departments Module', desc: 'Manage hospital departments, organizational structure, and assigned department heads.', btn: 'Manage Departments', path: '/departments', top: 'border-t-indigo-600', color: 'bg-indigo-600 hover:bg-indigo-700' },
  { title: 'Staff Signup Module', desc: 'Register new doctors, receptionists, or users securely with specific roles.', btn: 'Add New User', path: null, top: 'border-t-red-600', color: 'bg-red-600 hover:bg-red-700' },
];

const statCards = [
  { key: 'patients', label: 'Patients', color: 'text-teal-600 dark:text-teal-300', path: '/patients' },
  { key: 'doctors', label: 'Doctors', color: 'text-blue-600 dark:text-blue-300', path: '/doctors' },
  { key: 'appointments', label: 'Appointments', color: 'text-purple-600 dark:text-purple-300', path: '/appointments' },
  { key: 'departments', label: 'Departments', color: 'text-amber-600 dark:text-amber-300', path: '/departments' },
];

function Dashboard() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get('/dashboard/stats')
      .then((res) => setStats(res.data))
      .catch((err) => console.error('Error fetching dashboard stats:', err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-5 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Welcome back to MedCore Hospital</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {statCards.map((s) => (
          <button
            key={s.key}
            onClick={() => navigate(s.path)}
            className="text-left bg-white dark:bg-ink-800 border border-gray-200 dark:border-ink-700 rounded-2xl px-4 py-3 md:px-5 md:py-4 hover:border-gray-300 dark:hover:border-slate-500 transition"
          >
            <div className="text-xs md:text-sm text-gray-500 dark:text-slate-400">{s.label}</div>
            <div className={`text-2xl md:text-3xl font-bold ${s.color}`}>
              {stats ? stats[s.key] : <span className="inline-block w-10 h-7 rounded bg-gray-200 dark:bg-ink-700 animate-pulse" />}
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {modules.map((m) => (
          <div
            key={m.title}
            className={`bg-white dark:bg-ink-800 rounded-2xl shadow-sm p-5 md:p-6 border border-gray-200 dark:border-ink-700 border-t-4 ${m.top} flex flex-col justify-between`}
          >
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white mb-2">{m.title}</h2>
              <p className="text-gray-600 dark:text-slate-400 text-sm mb-5">{m.desc}</p>
            </div>
            <button
              onClick={() => (m.path ? navigate(m.path) : setIsModalOpen(true))}
              className={`w-full h-11 ${m.color} text-white rounded-xl font-semibold transition`}
            >
              {m.btn}
            </button>
          </div>
        ))}
      </div>

      <StaffSignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default Dashboard;