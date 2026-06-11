import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AppContext';

function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showerr, setShowerr] = useState('');
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAppContext();

    const handleRegister = async () => {
        const response = await fetch(`${urlConfig.backendUrl}/api/secondchance/auth/register`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, email, password })
        });
        const json = await response.json();
        if (json.authtoken) {
            sessionStorage.setItem('auth-token', json.authtoken);
            sessionStorage.setItem('name', firstName);
            sessionStorage.setItem('email', json.email);
            navigate('/app');
            setIsLoggedIn(true);
        }
        if (json.error) setShowerr(json.error);
    };

    return (
        <div className="container" style={{ maxWidth: '420px', marginTop: '5rem', marginBottom: '5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>Create account</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Join SecondChance today</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                    <label htmlFor="firstName" className="form-label">First name</label>
                    <input id="firstName" type="text" className="form-control" placeholder="First" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="lastName" className="form-label">Last name</label>
                    <input id="lastName" type="text" className="form-control" placeholder="Last" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input id="email" type="text" className="form-control" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                {showerr && <span style={{ color: '#dc2626', fontSize: '0.78rem', display: 'block', marginTop: '0.35rem' }}>{showerr}</span>}
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="form-label">Password</label>
                <input id="password" type="password" className="form-control" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className="btn btn-primary w-100" onClick={handleRegister}>Create account</button>
            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Already a member?{' '}
                <a href="/app/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Sign in</a>
            </p>
        </div>
    );
}

export default RegisterPage;