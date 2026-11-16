import React, { useState } from 'react';
import StaffSignupModal from "../components/StaffSignupModal";
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      
      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Patients Module Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-t-4 border-blue-600 border-x border-b border-gray-200 dark:border-gray-700 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Patients Module</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              View patient records, register new patients, and manage patient information seamlessly.
            </p>
          </div>
          <button
            onClick={() => navigate('/patients')}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-center"
          >
            Manage Patients
          </button>
        </div>

        {/* Doctors Module Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-t-4 border-green-600 border-x border-b border-gray-200 dark:border-gray-700 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Doctors Module</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              Browse the list of medical professionals and check their availability and schedules.
            </p>
          </div>
          <button
            onClick={() => navigate('/doctors')}
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition text-center"
          >
            Manage Doctors
          </button>
        </div>

        {/* Appointments Module Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-t-4 border-purple-600 border-x border-b border-gray-200 dark:border-gray-700 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Appointments Module</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              Book new appointments, view the scheduling calendar, and manage patient visits.
            </p>
          </div>
          <button
            onClick={() => navigate('/appointments')}
            className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition text-center"
          >
            Manage Appointments
          </button>
        </div>

        {/* Insurance Module Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-t-4 border-yellow-500 border-x border-b border-gray-200 dark:border-gray-700 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Insurance Module</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              Manage insurance policies, track provider details, and monitor validity dates.
            </p>
          </div>
          <button
            onClick={() => navigate('/insurances')}
            className="w-full bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition text-center"
          >
            Manage Insurances
          </button>
        </div>

        {/* Departments Module Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-t-4 border-indigo-600 border-x border-b border-gray-200 dark:border-gray-700 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Departments Module</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              Manage hospital departments, organizational structure, and assigned department heads.
            </p>
          </div>
          <button
            onClick={() => navigate('/departments')}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition text-center"
          >
            Manage Departments
          </button>
        </div>

        {/* Staff Signup Module Card (Now perfectly styled & aligned) */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-t-4 border-red-600 border-x border-b border-gray-200 dark:border-gray-700 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Staff Signup Module</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              Register new doctors, receptionists, or users securely with specific roles.
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition text-center"
          >
            Add New User
          </button>
        </div>

      </div>
      
      {/* Staff Signup Modal Popup */}
      <StaffSignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

    </div>
  );
}

export default Dashboard;