import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import hospitalLogo from '../assets/hospital-logo.png';

function Login() {
    const [credentials, setCredentials] = useState({ userName: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [slow, setSlow] = useState(false); // server dair se jawab de to message
    const navigate = useNavigate();

    useEffect(() => {
        // Saved theme lagao (login pe Navbar nahi hota)
        document.documentElement.classList.toggle('dark', localStorage.getItem('theme') === 'dark');

        // Render ko pehle se jaga do. Jawab kuch bhi aaye, server uth jayega.
        API.get('/').catch(() => {});
    }, []);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const timer = setTimeout(() => setSlow(true), 4000);

        try {
            const response = await API.post('/auth/login', credentials);
            const token = response.data.token || response.data.accessToken || response.data;
            localStorage.setItem('token', token);
            navigate('/dashboard');
        } catch (err) {
            console.error('Login Error:', err);
            if (err.response) {
                setError('Invalid username or password!');
            } else {
                setError('Server se jawab nahi aaya. Thori der baad dobara try karo.');
            }
        } finally {
            clearTimeout(timer);
            setSlow(false);
            setLoading(false);
        }
    };

    const inputClass =
        'w-full h-12 px-3.5 rounded-xl border border-gray-300 dark:border-ink-700 bg-white dark:bg-ink-950 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-400';

    return (
        <div className="relative flex justify-center items-center min-h-screen bg-gray-100 dark:bg-ink-900 p-4 transition-colors duration-200">
            <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-ink-800 p-6 sm:p-8 rounded-2xl shadow-md w-full max-w-md border border-gray-200 dark:border-ink-700"
            >
                <div className="flex flex-col items-center gap-2 mb-6">
                    <img
                        src={hospitalLogo}
                        alt="MedCore Logo"
                        className="w-14 h-14 rounded-xl object-cover border border-gray-200 dark:border-ink-700"
                    />
                    <h2 className="text-2xl font-bold text-blue-600 dark:text-teal-300">Hospital Login</h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400">MedCore Hospital Management System</p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-xl p-3 mb-4">
                        <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-slate-200 text-sm font-semibold mb-1.5">Username</label>
                    <input
                        type="text"
                        name="userName"
                        value={credentials.userName}
                        onChange={handleChange}
                        placeholder="Enter username"
                        autoComplete="username"
                        className={inputClass}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 dark:text-slate-200 text-sm font-semibold mb-1.5">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        autoComplete="current-password"
                        className={inputClass}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition"
                >
                    {loading && (
                        <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    )}
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                {slow && (
                    <p className="mt-4 text-center text-sm text-amber-600 dark:text-amber-300">
                        Server start ho raha hai, 30-60 second lag sakte hain. Page band mat karo.
                    </p>
                )}
            </form>

            <p className="absolute bottom-4 inset-x-0 text-center text-xs text-gray-500 dark:text-slate-500">
                Developed by Owais Shuja
            </p>
        </div>
    );
}

export default Login;