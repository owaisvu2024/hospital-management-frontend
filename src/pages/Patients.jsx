import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // 🌟 Success notification banner state
  
  // Pagination states
  const [page, setPage] = useState(0);      
  const [size, setSize] = useState(5);      
  const [totalPages, setTotalPages] = useState(0); 

  // Search state
  const [searchId, setSearchId] = useState('');
  const [searchedPatient, setSearchedPatient] = useState(null);

  const navigate = useNavigate();

  const fetchPatients = () => {
    setLoading(true);
    API.get(`/patient/getall?page=${page}&size=${size}`)
      .then((response) => {
        setPatients(response.data.content);      
        setTotalPages(response.data.totalPages);  
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching patients:", err);
        setError('Failed to load patient records.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPatients();
  }, [page, size]);

  // Delete Patient
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      API.delete(`/patient/delete/${id}`)
        .then(() => {
          setSuccess('Patient deleted successfully!');
          setTimeout(() => setSuccess(''), 3000); // 3 seconds baad auto-clear
          fetchPatients(); 
        })
        .catch((err) => {
          console.error("Error deleting patient:", err);
          setError('Failed to delete patient.');
        });
    }
  };

  // Search Patient by ID
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchId) {
      setSearchedPatient(null);
      return;
    }
    API.get(`/patient/get/${searchId}`)
      .then((res) => {
        setSearchedPatient(res.data);
        setError('');
      })
      .catch((err) => {
        console.error("Patient not found", err);
        setError('Patient with this ID was not found.');
        setSearchedPatient(null);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-3 sm:p-6 lg:p-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        
        {/* Header & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Patients Management Hub</h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigate('/add-patient')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition text-center w-full sm:w-auto"
            >
              + Add New Patient
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-700 dark:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-700 transition text-center w-full sm:w-auto"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Success & Error Banners */}
        {success && (
          <div className="bg-green-50 dark:bg-green-900/35 border-l-4 border-green-500 p-3 mb-4">
            <p className="text-green-700 dark:text-green-300 text-sm font-medium">{success}</p>
          </div>
        )}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/35 border-l-4 border-red-500 p-3 mb-4">
            <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            type="number"
            placeholder="Search by Patient ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 sm:flex-none bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Search
            </button>
            {searchedPatient && (
              <button
                type="button"
                onClick={() => { setSearchedPatient(null); setSearchId(''); setError(''); }}
                className="flex-1 sm:flex-none bg-gray-400 dark:bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 dark:hover:bg-gray-700 transition"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Patients Table Container with Horizontal Scrolling Support */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 uppercase">
                <th className="py-3 px-3 sm:px-4 whitespace-nowrap">ID</th>
                <th className="py-3 px-3 sm:px-4 whitespace-nowrap">Name</th>
                <th className="py-3 px-3 sm:px-4 whitespace-nowrap">Gender</th>
                <th className="py-3 px-3 sm:px-4 whitespace-nowrap">Blood Group</th>
                <th className="py-3 px-3 sm:px-4 whitespace-nowrap">Email</th>
                <th className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {searchedPatient ? (
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-3 sm:px-4 text-gray-800 dark:text-gray-200 whitespace-nowrap">{searchedPatient.patientId}</td>
                  <td className="py-3 px-3 sm:px-4 font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">{searchedPatient.patientName}</td>
                  <td className="py-3 px-3 sm:px-4 text-gray-800 dark:text-gray-200 whitespace-nowrap">{searchedPatient.gender}</td>
                  <td className="py-3 px-3 sm:px-4 text-gray-800 dark:text-gray-200 whitespace-nowrap">{searchedPatient.bloodGroup}</td>
                  <td className="py-3 px-3 sm:px-4 text-gray-800 dark:text-gray-200 whitespace-nowrap">{searchedPatient.email}</td>
                  <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => navigate(`/edit-patient/${searchedPatient.patientId}`)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs sm:text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(searchedPatient.patientId)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs sm:text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ) : patients.length > 0 ? (
                patients.map((p) => (
                  <tr key={p.patientId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-3 sm:px-4 text-gray-800 dark:text-gray-200 whitespace-nowrap">{p.patientId}</td>
                    <td className="py-3 px-3 sm:px-4 font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">{p.patientName}</td>
                    <td className="py-3 px-3 sm:px-4 text-gray-800 dark:text-gray-200 whitespace-nowrap">{p.gender}</td>
                    <td className="py-3 px-3 sm:px-4 text-gray-800 dark:text-gray-200 whitespace-nowrap">{p.bloodGroup}</td>
                    <td className="py-3 px-3 sm:px-4 text-gray-800 dark:text-gray-200 whitespace-nowrap">{p.email}</td>
                    <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/edit-patient/${p.patientId}`)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs sm:text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.patientId)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs sm:text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 text-center text-gray-500 dark:text-gray-400">
                    {loading ? 'Loading patients...' : 'No patients available.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {!searchedPatient && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              disabled={page === 0}
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg font-semibold text-white ${
                page === 0 ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Previous
            </button>

            <span className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">
              Page {page + 1} of {totalPages}
            </span>

            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg font-semibold text-white ${
                page + 1 >= totalPages ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Patients;