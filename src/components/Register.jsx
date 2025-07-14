import React, { useState } from 'react';
import carBg from '../assets/car3.png';

const Register = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        vehicle: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle registration logic here
        alert('Registered!');
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                width: '100vw',
                background: `url(${carBg}) center center/cover no-repeat`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <form
                onSubmit={handleSubmit}
                style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                    borderRadius: '2rem',
                    padding: '2.5rem 2.5rem 2rem 2.5rem',
                    backdropFilter: 'blur(16px) saturate(120%)',
                    WebkitBackdropFilter: 'blur(16px) saturate(120%)',
                    border: '1.5px solid rgba(255,255,255,0.18)',
                    minWidth: 400,
                    maxWidth: 400,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <h2 style={{ color: '#ffe066', fontWeight: 800, fontSize: '2rem', marginBottom: '1.5rem', letterSpacing: '0.01em' }}>
                    Register
                </h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />
                <div style={{ width: '100%', position: 'relative' }}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        style={{ ...inputStyle, paddingRight: 40 }}
                    />
                    <span
                        onClick={() => setShowPassword((v) => !v)}
                        style={{
                            position: 'absolute',
                            right: 16,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#ffe066',
                            cursor: 'pointer',
                            fontSize: 18,
                            userSelect: 'none',
                        }}
                        title={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {/* {showPassword ? '🙈' : '👁️'} */}
                    </span>
                </div>
                <input
                    type="text"
                    name="vehicle"
                    placeholder="Vehicle Number"
                    value={form.vehicle}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />
                <button
                    type="submit"
                    style={{
                        marginTop: '1.5rem',
                        background: 'linear-gradient(90deg, #ffe066 60%, #ffd700 100%)',
                        color: '#222',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        border: 'none',
                        borderRadius: '1rem',
                        padding: '0.9rem 2.5rem',
                        boxShadow: '0 2px 12px 0 #ffe06644',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                >
                    Register
                </button>
            </form>
        </div>
    );
};

const inputStyle = {
    width: '100%',
    marginBottom: '1.2rem',
    padding: '0.9rem 1.2rem',
    borderRadius: '1rem',
    border: '1.5px solid #ffe06699',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 500,
    outline: 'none',
    boxShadow: '0 1px 4px 0 #ffe06622',
    letterSpacing: '0.01em',
};

export default Register; 