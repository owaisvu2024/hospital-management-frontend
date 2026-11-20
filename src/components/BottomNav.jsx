import React from 'react';
import { NavLink } from 'react-router-dom';

const items = [
  { name: 'Home', path: '/dashboard', icon: '🏠' },
  { name: 'Patients', path: '/patients', icon: '👥' },
  { name: 'Doctors', path: '/doctors', icon: '🩺' },
  { name: 'Appointments', path: '/appointments', icon: '📅' },
];

function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 h-[68px] flex bg-white dark:bg-ink-950 border-t border-gray-200 dark:border-ink-700">
      {items.map((i) => (
        <NavLink
          key={i.path}
          to={i.path}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-0.5 text-[11px] ${
              isActive
                ? 'font-bold text-blue-600 dark:text-teal-300'
                : 'font-medium text-gray-500 dark:text-slate-400'
            }`
          }
        >
          <span className="text-xl leading-none">{i.icon}</span>
          {i.name}
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNav;