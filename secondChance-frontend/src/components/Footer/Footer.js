import React from 'react';
import { Leaf, Shield, Zap, GitBranch, MapPin } from 'lucide-react';

const styles = {
  footer: {
    background: '#1d1d1f',
    color: '#999',
    fontFamily: "'Samsung One', 'SamsungOne', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: '56px 24px 0',
  },
  inner: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '40px 32px',
    paddingBottom: '48px',
  },
  brand: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#fff',
    letterSpacing: '-0.3px',
    marginBottom: '10px',
  },
  tagline: {
    fontSize: '13px',
    color: '#777',
    lineHeight: '1.7',
    marginBottom: '16px',
  },
  badgeRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#aaa',
    border: '1px solid #333',
    borderRadius: '2px',
    padding: '4px 9px',
    letterSpacing: '0.2px',
  },
  colHeading: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: '16px',
  },
  linkList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  link: {
    fontSize: '13px',
    color: '#777',
    textDecoration: 'none',
    transition: 'color 0.15s',
    cursor: 'pointer',
  },
  staticLink: {
    fontSize: '13px',
    color: '#555',
    cursor: 'default',
  },
  divider: {
    height: '1px',
    background: '#2a2a2a',
  },
  bottom: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 0 24px',
    flexWrap: 'wrap',
    gap: '12px',
    fontSize: '12px',
    color: '#555',
  },
  bottomRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  bottomLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#555',
    textDecoration: 'none',
    transition: 'color 0.15s',
  },
};

const hoverLink = (e) => { e.target.style.color = '#fff'; };
const blurLink = (e) => { e.target.style.color = '#777'; };

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div style={styles.grid}>

          {/* Brand */}
          <div>
            <div style={styles.brand}>SecondChance</div>
            <p style={styles.tagline}>
              Where memories find new homes.<br />
              Give your items a second life.
            </p>
            <div style={styles.badgeRow}>
              <span style={styles.badge}><Leaf size={10} /> Sustainable</span>
              <span style={styles.badge}><Shield size={10} /> Secure</span>
              <span style={styles.badge}><Zap size={10} /> Fast</span>
            </div>
          </div>

          {/* Browse */}
          <div>
            <div style={styles.colHeading}>Browse</div>
            <div style={styles.linkList}>
              <a href="/app" style={styles.link} onMouseEnter={hoverLink} onMouseLeave={blurLink}>All Items</a>
              <a href="/app/search" style={styles.link} onMouseEnter={hoverLink} onMouseLeave={blurLink}>Search</a>
              <a href="/app/addItem" style={styles.link} onMouseEnter={hoverLink} onMouseLeave={blurLink}>Post an Item</a>
            </div>
          </div>

          {/* Account */}
          <div>
            <div style={styles.colHeading}>Account</div>
            <div style={styles.linkList}>
              <a href="/app/login" style={styles.link} onMouseEnter={hoverLink} onMouseLeave={blurLink}>Login</a>
              <a href="/app/register" style={styles.link} onMouseEnter={hoverLink} onMouseLeave={blurLink}>Register</a>
              <a href="/app/profile" style={styles.link} onMouseEnter={hoverLink} onMouseLeave={blurLink}>My Profile</a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <div style={styles.colHeading}>Categories</div>
            <div style={styles.linkList}>
              {['Kitchen', 'Living Room', 'Office', 'Bedroom'].map(cat => (
                <a
                  key={cat}
                  href={`/app/search?category=${encodeURIComponent(cat)}`}
                  style={styles.link}
                  onMouseEnter={hoverLink}
                  onMouseLeave={blurLink}
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>

          {/* Tech */}
          <div>
            <div style={styles.colHeading}>Built With</div>
            <div style={styles.linkList}>
              {['Node.js + Express', 'MongoDB Atlas', 'React', 'JWT Auth'].map(t => (
                <span key={t} style={styles.staticLink}>{t}</span>
              ))}
            </div>
          </div>

        </div>

        <div style={styles.divider} />

        <div style={styles.bottom}>
          <span>© {new Date().getFullYear()} SecondChance. All rights reserved.</span>
          <div style={styles.bottomRight}>
            <a
              href="https://github.com/ankit-prabhavak/backend-nodejs-capstone"
              target="_blank" rel="noreferrer"
              style={styles.bottomLink}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = '#555'}
            >
              <GitBranch size={12} /> GitHub
            </a>
            <span style={{ ...styles.bottomLink, cursor: 'default' }}>
              <MapPin size={12} /> India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}