import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

function Signup() {
    // 1. Form ki inputs (userName, password, roles) ke liye state
    const [formData, setFormData] = useState({
        userName: '',
        password: '',
        roles: ['PATIENT'] // Default role patient rakha hai
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    // 2. Input change ko handle karne ke liye function
    const handleChange = (e) => {
        if (e.target.name === 'roles') {
            // Spring Boot mein roles Set<Role> hain, is liye array ki shakal mein bhej rahe hain
            setFormData({
                ...formData,
                roles: [e.target.value]
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        }
    };

    // 3. Jab user Signup button dabayega
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Spring Boot ke signup endpoint par POST request bhej rahe hain
            await API.post('/auth/signup', formData);
            
            alert('Signup Successful! Please login now.');
            navigate('/login'); // Signup ke baad user ko Login page par bhej do
        } catch (err) {
            setError('Signup failed! Username might already exist or check backend.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-200">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-green-600 dark:text-green-400">Hospital Signup</h2>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/35 border-l-4 border-red-500 p-3 mb-4">
                        <p className="text-red-500 dark:text-red-300 text-sm">{error}</p>
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Username</label>
                    <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        required
                    />
                </div>

                

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200 font-semibold mb-4"
                >
                    Register / Signup
                </button>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account? <Link to="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Login here</Link>
                </p>
            </form>
        </div>
    );
}

export default Signup;