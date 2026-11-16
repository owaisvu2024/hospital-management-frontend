import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function Login() {
    // 1. Form ki inputs (username aur password) ko yaad rakhne ke liye useState
    const [credentials, setCredentials] = useState({
        userName: '',
        password: ''
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    // 2. Jab user input box mein kuch type karega, yeh function state update karega
    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    // 3. Jab user Login button dabayega, yeh function chalega
    const handleSubmit = async (e) => {
        e.preventDefault(); // Page ko reload hone se bachata hai
        setError('');

        try {
            // Spring Boot backend ko POST request bhej rahe hain
            const response = await API.post('/auth/login', credentials);
            
            // Console mein check karne ke liye ke backend exactly kya bhej raha hai
            console.log("Backend Response:", response.data);

            // 💡 Smart fix: Chahe token object mein ho ya seedha string ho, yeh utha lega
            const token = response.data.token || response.data.accessToken || response.data;
            
            // LocalStorage mein save kar do
            localStorage.setItem('token', token);
            
            alert('Login Successful!');
            navigate('/dashboard'); // Dashboard par bhej do
        } catch (err) {
            console.error("Login Error:", err);
            setError('Invalid username or password!');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-200">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">Hospital Login</h2>

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
                        value={credentials.userName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
                >
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;