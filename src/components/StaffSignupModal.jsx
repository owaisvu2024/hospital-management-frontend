import React, { useState } from 'react';
import axios from 'axios';

const StaffSignupModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        userName: '',
        password: '',
        roles: ['DOCTOR'] // Default role
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null; // Agar modal band hai toh kuch na dikhaye

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            // LocalStorage se Admin ka JWT Token uthana hai
            const token = localStorage.getItem('token'); 
            console.log("Mera Token yeh hai:", token);

            await axios.post(
                'http://localhost:8090/api/admin/add-user', 
                formData, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage('✅ User successfully registered by Admin!');
            setFormData({ userName: '', password: '', roles: ['DOCTOR'] });
        } catch (err) {
            setError(err.response?.data?.message || '❌ Failed to register user');
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '400px', position: 'relative' }}>
                <h3>Register New Staff (Doctor/Receptionist)</h3>
                
                {message && <p style={{ color: 'green' }}>{message}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Username:</label><br />
                        <input 
                            type="text" 
                            value={formData.userName} 
                            onChange={(e) => setFormData({ ...formData, userName: e.target.value })} 
                            required 
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label>Password:</label><br />
                        <input 
                            type="password" 
                            value={formData.password} 
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                            required 
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label>Select Role:</label><br />
                        <select 
                            value={formData.roles[0]} 
                            onChange={(e) => setFormData({ ...formData, roles: [e.target.value] })}
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        >
                            <option value="DOCTOR">DOCTOR</option>
                            <option value="RECEPTIONIST">RECEPTIONIST</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <button type="submit" style={{ background: 'blue', color: 'white', padding: '10px 15px', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                            Create Account
                        </button>
                        <button type="button" onClick={onClose} style={{ background: 'gray', color: 'white', padding: '10px 15px', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StaffSignupModal;