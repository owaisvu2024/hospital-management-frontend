import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const STATUS_STYLE = {
  PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  CONFIRMED: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  COMPLETED: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  CANCELLED: 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300',
};

function StatusPill({ status }) {
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
        STATUS_STYLE[status] || 'bg-gray-100 text-gray-600 dark:bg-ink-700 dark:text-slate-300'
      }`}
    >
      {status}
    </span>
  );
}

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const [appointmentId, setAppointmentId] = useState('');
  const [searchedAppointment, setSearchedAppointment] = useState(null);

  const navigate = useNavigate();

  const fetchAppointments = () => {
    setLoading(true);
    API.get(`/appointment/getall?page=${page}&size=${size}`)
      .then((response) => {
        setAppointments(response.data.content);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointment records.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAppointments();
  }, [page, size]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      API.delete(`/appointment/delete/${id}`)
        .then(() => {
          setSuccess('Appointment deleted successfully!');
          setTimeout(() => setSuccess(''), 3000);
          setSearchedAppointment(null);
          setAppointmentId('');
          fetchAppointments();
        })
        .catch((err) => {
          console.error('Error deleting appointment:', err);
          setError('Failed to delete appointment.');
        });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!appointmentId) {
      setSearchedAppointment(null);
      return;
    }
    API.get(`/appointment/get/${appointmentId}`)
      .then((res) => {
        setSearchedAppointment(res.data);
        setError('');
      })
      .catch((err) => {
        console.error('Appointment not found', err);
        setError('Appointment with this ID was not found.');
        setSearchedAppointment(null);
      });
  };

  const rows = searchedAppointment ? [searchedAppointment] : appointments;

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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Appointments</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">Book and track patient visits</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="hidden md:inline-flex h-11 items-center px-4 rounded-xl font-semibold bg-gray-700 dark:bg-ink-700 text-white hover:bg-gray-800 dark:hover:bg-ink-800 transition"
        >
          Back to Dashboard
        </button>
        <button
          onClick={() => navigate('/add-appointment')}
          className="h-11 px-4 rounded-xl font-semibold bg-green-600 hover:bg-green-700 text-white transition whitespace-nowrap"
        >
          + Book<span className="hidden sm:inline"> Appointment</span>
        </button>
      </div>

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
          placeholder="Search by appointment ID"
          value={appointmentId}
          onChange={(e) => setAppointmentId(e.target.value)}
          className="flex-1 min-w-0 h-12 px-4 rounded-xl border border-gray-300 dark:border-ink-700 bg-white dark:bg-ink-800 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-400"
        />
        <button
          type="submit"
          className="h-12 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          Search
        </button>
        {searchedAppointment && (
          <button
            type="button"
            onClick={() => { setSearchedAppointment(null); setAppointmentId(''); setError(''); }}
            className="h-12 px-4 rounded-xl bg-gray-400 dark:bg-ink-700 hover:bg-gray-500 text-white font-semibold transition"
          >
            Clear
          </button>
        )}
      </form>

      {rows.length === 0 && (
        <div className="bg-white dark:bg-ink-800 border border-gray-200 dark:border-ink-700 rounded-2xl p-8 text-center text-gray-500 dark:text-slate-400">
          {loading ? 'Loading appointments...' : 'No appointments available.'}
        </div>
      )}

      {/* Desktop table */}
      {rows.length > 0 && (
        <div className="hidden md:block bg-white dark:bg-ink-800 border border-gray-200 dark:border-ink-700 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-ink-900 text-gray-600 dark:text-slate-400 uppercase text-xs tracking-wide">
                <th className="py-3 px-5">ID</th>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5">Reason</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">Patient ID</th>
                <th className="py-3 px-5">Doctor ID</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-ink-700">
              {rows.map((a) => (
                <tr key={a.appointmentId} className="hover:bg-gray-50 dark:hover:bg-ink-700/40">
                  <td className="py-3 px-5 text-gray-500 dark:text-slate-400">{a.appointmentId}</td>
                  <td className="py-3 px-5 font-semibold text-gray-800 dark:text-slate-100 whitespace-nowrap">{a.appointmentDate}</td>
                  <td className="py-3 px-5 text-gray-800 dark:text-slate-200">{a.reason}</td>
                  <td className="py-3 px-5"><StatusPill status={a.status} /></td>
                  <td className="py-3 px-5 text-gray-500 dark:text-slate-400">{a.patientId}</td>
                  <td className="py-3 px-5 text-gray-500 dark:text-slate-400">{a.doctorId}</td>
                  <td className="py-3 px-5">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => navigate(`/edit-appointment/${a.appointmentId}`)} className={editBtn}>Edit</button>
                      <button onClick={() => handleDelete(a.appointmentId)} className={delBtn}>Delete</button>
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
          {rows.map((a) => (
            <div
              key={a.appointmentId}
              className="bg-white dark:bg-ink-800 border border-gray-200 dark:border-ink-700 rounded-2xl p-4 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-lg bg-purple-100 dark:bg-purple-400/15">
                  📅
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 dark:text-white">{a.appointmentDate}</div>
                  <div className="text-xs text-gray-500 dark:text-slate-400">Appointment #{a.appointmentId}</div>
                </div>
                <StatusPill status={a.status} />
              </div>
              <div className="text-sm text-gray-700 dark:text-slate-300">{a.reason}</div>
              <div className="text-xs text-gray-500 dark:text-slate-400">
                Patient ID {a.patientId} · Doctor ID {a.doctorId}
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigate(`/edit-appointment/${a.appointmentId}`)} className={`flex-1 h-10 ${editBtn}`}>Edit</button>
                <button onClick={() => handleDelete(a.appointmentId)} className={`flex-1 h-10 ${delBtn}`}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!searchedAppointment && totalPages > 1 && (
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

export default Appointments;