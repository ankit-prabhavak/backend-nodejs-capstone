import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AppContext';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [incorrect, setIncorrect] = useState('');
    const navigate = useNavigate();
    const bearerToken = sessionStorage.getItem('bearer-token');
    const { setIsLoggedIn } = useAppContext();

    useEffect(() => {
        if (sessionStorage.getItem('auth-token')) {
            navigate('/app');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await fetch(`${urlConfig.backendUrl}/api/secondchance/auth/login`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Authorization': bearerToken ? `Bearer ${bearerToken}` : '',
            },
            body: JSON.stringify({ email, password })
        });
        const json = await res.json();
        if (json.authtoken) {
            sessionStorage.setItem('auth-token', json.authtoken);
            sessionStorage.setItem('name', json.userName);
            sessionStorage.setItem('email', json.userEmail);
            navigate('/app');
            setIsLoggedIn(true);
        } else {
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            setIncorrect('Wrong password. Try again.');
            setTimeout(() => setIncorrect(''), 2000);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '420px', marginTop: '5rem', marginBottom: '5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>Sign in</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Welcome back to SecondChance</p>
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                    id="email"
                    type="text"
                    className="form-control"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setIncorrect(''); }}
                />
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                    id="password"
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setIncorrect(''); }}
                />
                {incorrect && (
                    <span style={{ color: '#dc2626', fontSize: '0.78rem', display: 'block', marginTop: '0.35rem' }}>{incorrect}</span>
                )}
            </div>
            <button className="btn btn-primary w-100" onClick={handleLogin}>Sign in</button>
            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                New here?{' '}
                <a href="/app/register" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Create an account</a>
            </p>
        </div>
    );
}

export default LoginPage;