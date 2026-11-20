import React from 'react';

function Footer() {
  return (
    <footer className="bg-white dark:bg-ink-950 border-t border-gray-200 dark:border-ink-700 py-4 mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-slate-400">
        <p>© 2026 MedCore Hospital Management System. All rights reserved.</p>
        <p className="font-semibold text-blue-600 dark:text-blue-400">
            Version 1.0.0 | Developed by{' '}
   <a href="https://github.com/owaisvu2024" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
     Owais Shuja
   </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;