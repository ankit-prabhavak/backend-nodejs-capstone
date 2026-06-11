import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AppContext';

const styles = {
  nav: {
    background: '#fff',
    borderBottom: '1px solid #e8e8e8',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    fontFamily: "'Samsung One', 'SamsungOne', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  inner: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 24px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1428a0',
    textDecoration: 'none',
    letterSpacing: '-0.3px',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  navLink: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#444',
    textDecoration: 'none',
    padding: '6px 12px',
    borderRadius: '2px',
    transition: 'color 0.15s, background 0.15s',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
  },
  welcomeBtn: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1d1d1f',
    padding: '6px 12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '2px',
    transition: 'background 0.15s',
  },
  loginBtn: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1428a0',
    textDecoration: 'none',
    padding: '7px 16px',
    border: '1.5px solid #1428a0',
    borderRadius: '2px',
    transition: 'background 0.15s, color 0.15s',
    marginLeft: '4px',
  },
  registerBtn: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    textDecoration: 'none',
    padding: '7px 16px',
    background: '#1428a0',
    border: '1.5px solid #1428a0',
    borderRadius: '2px',
    transition: 'background 0.15s',
    marginLeft: '4px',
  },
  logoutBtn: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#666',
    background: 'none',
    border: '1.5px solid #e0e0e0',
    borderRadius: '2px',
    padding: '7px 16px',
    cursor: 'pointer',
    marginLeft: '4px',
    transition: 'background 0.15s, color 0.15s',
  },
  // Mobile
  hamburger: {
    display: 'none',
    flexDirection: 'column',
    gap: '5px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px',
  },
  hamburgerLine: {
    width: '22px',
    height: '2px',
    background: '#1d1d1f',
    borderRadius: '1px',
    display: 'block',
  },
  mobileMenu: {
    borderTop: '1px solid #f0f0f0',
    background: '#fff',
    padding: '12px 24px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  mobileLink: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#444',
    textDecoration: 'none',
    padding: '10px 0',
    borderBottom: '1px solid #f5f5f5',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: '#f5f5f5',
    textAlign: 'left',
    width: '100%',
  },
};

export default function Navbar() {
  const { isLoggedIn, setIsLoggedIn, userName, setUserName } = useAppContext();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const authTokenFromSession = sessionStorage.getItem('auth-token');
    const nameFromSession = sessionStorage.getItem('name');
    if (authTokenFromSession) {
      if (isLoggedIn && nameFromSession) {
        setUserName(nameFromSession);
      } else {
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('email');
        setIsLoggedIn(false);
      }
    }
  }, [isLoggedIn, setIsLoggedIn, setUserName]);

  const handleLogout = () => {
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('email');
    setIsLoggedIn(false);
    setMenuOpen(false);
    navigate('/app');
  };

  const hoverBg = (e) => { e.currentTarget.style.background = '#f5f5f5'; };
  const clearBg = (e) => { e.currentTarget.style.background = 'none'; };

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Brand */}
        <a href="/app" style={styles.brand}>SecondChance</a>

        {/* Desktop links */}
        {!isMobile && (
          <ul style={styles.links}>
            <li>
              <a href="/home.html" style={styles.navLink} onMouseEnter={hoverBg} onMouseLeave={clearBg}>Home</a>
            </li>
            <li>
              <Link to="/app" style={styles.navLink} onMouseEnter={hoverBg} onMouseLeave={clearBg}>Items</Link>
            </li>
            <li>
              <Link to="/app/search" style={styles.navLink} onMouseEnter={hoverBg} onMouseLeave={clearBg}>Search</Link>
            </li>

            {isLoggedIn ? (
              <>
                <li>
                  <button
                    style={styles.welcomeBtn}
                    onMouseEnter={hoverBg} onMouseLeave={clearBg}
                    onClick={() => navigate('/app/profile')}
                  >
                    {userName}
                  </button>
                </li>
                <li>
                  <button
                    style={styles.logoutBtn}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.color = '#1d1d1f'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#666'; }}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/app/login"
                    style={styles.loginBtn}
                    onMouseEnter={e => { e.currentTarget.style.background = '#1428a0'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#1428a0'; }}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/app/register"
                    style={styles.registerBtn}
                    onMouseEnter={e => { e.currentTarget.style.background = '#0e1f7a'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#1428a0'; }}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button style={{ ...styles.hamburger, display: 'flex' }} onClick={() => setMenuOpen(o => !o)}>
            <span style={styles.hamburgerLine} />
            <span style={styles.hamburgerLine} />
            <span style={styles.hamburgerLine} />
          </button>
        )}
      </div>

      {/* Mobile menu */}
      {isMobile && menuOpen && (
        <div style={styles.mobileMenu}>
          <a href="/home.html" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Home</a>
          <Link to="/app" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Items</Link>
          <Link to="/app/search" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Search</Link>
          {isLoggedIn ? (
            <>
              <button style={styles.mobileLink} onClick={() => { navigate('/app/profile'); setMenuOpen(false); }}>
                {userName}
              </button>
              <button style={{ ...styles.mobileLink, color: '#c00' }} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/app/login" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/app/register" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}