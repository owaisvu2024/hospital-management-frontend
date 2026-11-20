import React, { useState } from 'react';
import api from '../services/api';

const StaffSignupModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        userName: '',
        password: '',
        roles: ['DOCTOR'],
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleClose = () => {
        setMessage('');
        setError('');
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            await api.post('/admin/add-user', formData);
            setMessage('✅ User successfully registered by Admin!');
            setFormData({ userName: '', password: '', roles: ['DOCTOR'] });
        } catch (err) {
            setError(err.response?.data?.message || '❌ Failed to register user');
        }
    };

    const inputClass =
        'w-full h-11 px-3.5 rounded-xl border border-gray-300 dark:border-ink-700 bg-white dark:bg-ink-950 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-400';
    const labelClass = 'block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1.5';

    return (
        <div
            onClick={handleClose}
            className="fixed inset-0 z-[100] bg-black/70 flex items-end md:items-center justify-center"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full md:max-w-md bg-white dark:bg-ink-800 border border-gray-200 dark:border-ink-700 rounded-t-2xl md:rounded-2xl p-5 pb-6 md:p-7 max-h-[92vh] overflow-y-auto"
            >
                <div className="md:hidden w-10 h-1 rounded-full bg-gray-300 dark:bg-ink-700 mx-auto mb-4" />

                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Register New Staff</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
                    Create a login for a doctor or receptionist.
                </p>

                {message && (
                    <p className="mb-3 text-sm rounded-xl p-3 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300">
                        {message}
                    </p>
                )}
                {error && (
                    <p className="mb-3 text-sm rounded-xl p-3 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-300">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className={labelClass}>Username</label>
                        <input
                            type="text"
                            value={formData.userName}
                            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                            placeholder="Enter username"
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Enter password"
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Select Role</label>
                        <select
                            value={formData.roles[0]}
                            onChange={(e) => setFormData({ ...formData, roles: [e.target.value] })}
                            className={inputClass}
                        >
                            <option value="DOCTOR">DOCTOR</option>
                            <option value="RECEPTIONIST">RECEPTIONIST</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>

                    <div className="flex gap-3 mt-1">
                        <button
                            type="submit"
                            className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
                        >
                            Create Account
                        </button>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 h-11 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-semibold transition"
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StaffSignupModal;