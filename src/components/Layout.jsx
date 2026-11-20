import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import BottomNav from './BottomNav';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-ink-900 text-gray-900 dark:text-slate-100 flex flex-col pb-[68px] md:pb-0 transition-colors duration-200">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <BottomNav />
    </div>
  );
}

export default Layout;