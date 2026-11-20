import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import hospitalLogo from '../assets/hospital-logo.png';

const links = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Patients', path: '/patients' },
  { name: 'Doctors', path: '/doctors' },
  { name: 'Appointments', path: '/appointments' },
  { name: 'Departments', path: '/departments' },
  { name: 'Insurance', path: '/insurances' },
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = () => {
    const next = !isDarkMode;
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    setIsDarkMode(next);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="bg-white dark:bg-ink-950 border-b border-gray-200 dark:border-ink-700 text-gray-800 dark:text-slate-100 sticky top-0 z-50 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-2">

          {/* Logo + brand */}
          <Link to="/dashboard" className="flex items-center gap-2.5 min-w-0 flex-1 md:flex-none md:mr-6">
            <img
              src={hospitalLogo}
              alt="MedCore Logo"
              className="w-9 h-9 rounded-lg object-cover border border-gray-200 dark:border-ink-700"
            />
            <span className="text-base sm:text-lg font-bold truncate">MedCore Hospital</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            {links.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive(l.path)
                    ? 'bg-blue-600 text-white dark:bg-teal-400/15 dark:text-teal-300'
                    : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-ink-800'
                }`}
              >
                {l.name}
              </Link>
            ))}
          </div>

          {/* Right buttons: mobile pe sirf icon */}
          <button
            onClick={toggleTheme}
            title="Toggle Theme"
            className="h-10 w-10 sm:w-auto sm:px-3 flex items-center justify-center gap-1.5 rounded-xl text-sm font-semibold border border-gray-300 dark:border-ink-700 bg-gray-100 dark:bg-ink-800 text-gray-800 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-ink-700 transition"
          >
            <span>{isDarkMode ? '☀️' : '🌙'}</span>
            <span className="hidden sm:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
          </button>

          <button
            onClick={handleLogout}
            title="Logout"
            className="h-10 w-10 sm:w-auto sm:px-4 flex items-center justify-center gap-1.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white dark:bg-red-950 dark:text-red-300 dark:border dark:border-red-900 dark:hover:bg-red-900 transition"
          >
            <svg className="w-5 h-5 sm:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;