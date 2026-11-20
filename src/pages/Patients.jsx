import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const initials = (name = '') =>
  name.split(' ').filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

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
        console.error('Error fetching patients:', err);
        setError('Failed to load patient records.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPatients();
  }, [page, size]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      API.delete(`/patient/delete/${id}`)
        .then(() => {
          setSuccess('Patient deleted successfully!');
          setTimeout(() => setSuccess(''), 3000);
          setSearchedPatient(null);
          setSearchId('');
          fetchPatients();
        })
        .catch((err) => {
          console.error('Error deleting patient:', err);
          setError('Failed to delete patient.');
        });
    }
  };

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
        console.error('Patient not found', err);
        setError('Patient with this ID was not found.');
        setSearchedPatient(null);
      });
  };

  const rows = searchedPatient ? [searchedPatient] : patients;

  const editBtn =
    'h-9 px-3 rounded-lg text-sm font-semibold border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-ink-700 transition';
  const delBtn =
    'h-9 px-3 rounded-lg text-sm font-semibold border border-red-300 dark:border-red-900 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950 transition';
  const pageBtn = (disabled) =>
    `h-10 px-4 rounded-xl text-sm font-semibold text-white transition ${
      disabled ? 'bg-gray-300 dark:bg-ink-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
    }`;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Patients</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">Manage patient records</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="hidden md:inline-flex h-11 items-center px-4 rounded-xl font-semibold bg-gray-700 dark:bg-ink-700 text-white hover:bg-gray-800 dark:hover:bg-ink-800 transition"
        >
          Back to Dashboard
        </button>
        <button
          onClick={() => navigate('/add-patient')}
          className="h-11 px-4 rounded-xl font-semibold bg-green-600 hover:bg-green-700 text-white transition whitespace-nowrap"
        >
          + Add<span className="hidden sm:inline"> Patient</span>
        </button>
      </div>

      {/* Banners */}
      {success && (
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900 rounded-xl p-3 mb-4">
          <p className="text-green-700 dark:text-green-300 text-sm font-medium">{success}</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-xl p-3 mb-4">
          <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-5">
        <input
          type="number"
          placeholder="Search by patient ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="flex-1 min-w-0 h-12 px-4 rounded-xl border border-gray-300 dark:border-ink-700 bg-white dark:bg-ink-800 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-400"
        />
        <button
          type="submit"
          className="h-12 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          Search
        </button>
        {searchedPatient && (
          <button
            type="button"
            onClick={() => { setSearchedPatient(null); setSearchId(''); setError(''); }}
            className="h-12 px-4 rounded-xl bg-gray-400 dark:bg-ink-700 hover:bg-gray-500 text-white font-semibold transition"
          >
            Clear
          </button>
        )}
      </form>

      {/* Empty / loading */}
      {rows.length === 0 && (
        <div className="bg-white dark:bg-ink-800 border border-gray-200 dark:border-ink-700 rounded-2xl p-8 text-center text-gray-500 dark:text-slate-400">
          {loading ? 'Loading patients...' : 'No patients available.'}
        </div>
      )}

      {/* Desktop table */}
      {rows.length > 0 && (
        <div className="hidden md:block bg-white dark:bg-ink-800 border border-gray-200 dark:border-ink-700 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-ink-900 text-gray-600 dark:text-slate-400 uppercase text-xs tracking-wide">
                <th className="py-3 px-5">ID</th>
                <th className="py-3 px-5">Name</th>
                <th className="py-3 px-5">Gender</th>
                <th className="py-3 px-5">Blood</th>
                <th className="py-3 px-5">Email</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-ink-700">
              {rows.map((p) => (
                <tr key={p.patientId} className="hover:bg-gray-50 dark:hover:bg-ink-700/40">
                  <td className="py-3 px-5 text-gray-500 dark:text-slate-400">{p.patientId}</td>
                  <td className="py-3 px-5 font-semibold text-gray-800 dark:text-slate-100">{p.patientName}</td>
                  <td className="py-3 px-5 text-gray-800 dark:text-slate-200">{p.gender}</td>
                  <td className="py-3 px-5">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-300">
                      {p.bloodGroup}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-gray-500 dark:text-slate-400">{p.email}</td>
                  <td className="py-3 px-5">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => navigate(`/edit-patient/${p.patientId}`)} className={editBtn}>Edit</button>
                      <button onClick={() => handleDelete(p.patientId)} className={delBtn}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile cards */}
      {rows.length > 0 && (
        <div className="md:hidden space-y-3">
          {rows.map((p) => (
            <div
              key={p.patientId}
              className="bg-white dark:bg-ink-800 border border-gray-200 dark:border-ink-700 rounded-2xl p-4 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center font-bold text-sm bg-teal-100 dark:bg-teal-400/15 text-teal-700 dark:text-teal-300">
                  {initials(p.patientName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 dark:text-white truncate">{p.patientName}</div>
                  <div className="text-xs text-gray-500 dark:text-slate-400">ID {p.patientId} · {p.gender}</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-300">
                  {p.bloodGroup}
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-slate-400 break-all">{p.email}</div>
              <div className="flex gap-2">
                <button onClick={() => navigate(`/edit-patient/${p.patientId}`)} className={`flex-1 h-10 ${editBtn}`}>Edit</button>
                <button onClick={() => handleDelete(p.patientId)} className={`flex-1 h-10 ${delBtn}`}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!searchedPatient && totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 mt-6">
          <button
            disabled={page === 0}
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            className={pageBtn(page === 0)}
          >
            Previous
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
            Page {page + 1} of {totalPages}
          </span>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
            className={pageBtn(page + 1 >= totalPages)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Patients;