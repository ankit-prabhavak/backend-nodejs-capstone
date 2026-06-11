import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AppContext';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f5f5f5',
    fontFamily: "'Samsung One', 'SamsungOne', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '60px 16px',
  },
  card: {
    background: '#fff',
    width: '100%',
    maxWidth: '420px',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  cardTop: {
    background: '#1428a0',
    padding: '36px 36px 32px',
  },
  avatarCircle: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '14px',
    letterSpacing: '-0.5px',
  },
  userName: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#fff',
    letterSpacing: '-0.2px',
    marginBottom: '4px',
  },
  userEmail: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.7)',
  },
  cardBody: {
    padding: '32px 36px',
  },
  detailRow: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
  },
  detailLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '5px',
  },
  detailValue: {
    fontSize: '15px',
    color: '#1d1d1f',
    fontWeight: '500',
  },
  divider: {
    height: '1px',
    background: '#f0f0f0',
    margin: '8px 0 24px',
  },
  editBtn: {
    width: '100%',
    padding: '14px',
    background: '#1428a0',
    color: '#fff',
    border: 'none',
    borderRadius: '2px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    letterSpacing: '0.2px',
    transition: 'background 0.15s',
  },
  // Edit form styles
  formSection: {
    padding: '36px 36px',
  },
  formTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1d1d1f',
    marginBottom: '28px',
    letterSpacing: '-0.2px',
  },
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '15px',
    border: '1.5px solid #e0e0e0',
    borderRadius: '2px',
    background: '#fafafa',
    color: '#1d1d1f',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '20px',
    transition: 'border-color 0.15s',
  },
  disabledInput: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '15px',
    border: '1.5px solid #f0f0f0',
    borderRadius: '2px',
    background: '#f7f7f7',
    color: '#aaa',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '20px',
    cursor: 'not-allowed',
  },
  saveBtn: {
    width: '100%',
    padding: '14px',
    background: '#1428a0',
    color: '#fff',
    border: 'none',
    borderRadius: '2px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '10px',
    transition: 'background 0.15s',
  },
  cancelBtn: {
    width: '100%',
    padding: '14px',
    background: 'none',
    color: '#666',
    border: '1.5px solid #e0e0e0',
    borderRadius: '2px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  successMsg: {
    color: '#1428a0',
    fontSize: '13px',
    fontStyle: 'italic',
    textAlign: 'center',
    minHeight: '20px',
    display: 'block',
    marginTop: '10px',
  },
};

const Profile = () => {
  const [userDetails, setUserDetails] = useState({});
  const [updatedDetails, setUpdatedDetails] = useState({});
  const { setUserName } = useAppContext();
  const [changed, setChanged] = useState("");
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authtoken = sessionStorage.getItem("auth-token");
    if (!authtoken) {
      navigate("/app/login");
    } else {
      fetchUserProfile();
    }
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const authtoken = sessionStorage.getItem("auth-token");
      const email = sessionStorage.getItem("email");
      const name = sessionStorage.getItem('name');
      if (name || authtoken) {
        const storedUserDetails = { name, email };
        setUserDetails(storedUserDetails);
        setUpdatedDetails(storedUserDetails);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    setUpdatedDetails({ ...updatedDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const authtoken = sessionStorage.getItem("auth-token");
      const email = sessionStorage.getItem("email");
      if (!authtoken || !email) { navigate("/app/login"); return; }

      const response = await fetch(`${urlConfig.backendUrl}/api/secondchance/auth/update`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${authtoken}`,
          "Content-Type": "application/json",
          "Email": email,
        },
        body: JSON.stringify({ ...updatedDetails }),
      });

      if (response.ok) {
        sessionStorage.setItem("name", updatedDetails.name);
        setUserDetails(updatedDetails);
        setEditMode(false);
        setUserName(updatedDetails.name);
        setChanged("Name updated successfully!");
        setTimeout(() => { setChanged(""); navigate("/"); }, 1000);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const initials = userDetails.name
    ? userDetails.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {editMode ? (
          <div style={styles.formSection}>
            <div style={styles.formTitle}>Edit Profile</div>

            <label style={styles.label}>Email</label>
            <input
              type="email" name="email"
              value={userDetails.email}
              style={styles.disabledInput}
              disabled
            />

            <label style={styles.label}>Name</label>
            <input
              type="text" name="name"
              value={updatedDetails.name || ''}
              onChange={handleInputChange}
              style={styles.input}
              onFocus={e => e.target.style.borderColor = '#1428a0'}
              onBlur={e => e.target.style.borderColor = '#e0e0e0'}
              placeholder="Your full name"
            />

            <button
              style={styles.saveBtn}
              onMouseEnter={e => e.target.style.background = '#0e1f7a'}
              onMouseLeave={e => e.target.style.background = '#1428a0'}
              onClick={handleSubmit}
            >
              Save changes
            </button>
            <button
              style={styles.cancelBtn}
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
            <span style={styles.successMsg}>{changed}</span>
          </div>
        ) : (
          <>
            <div style={styles.cardTop}>
              <div style={styles.avatarCircle}>{initials}</div>
              <div style={styles.userName}>{userDetails.name}</div>
              <div style={styles.userEmail}>{userDetails.email}</div>
            </div>
            <div style={styles.cardBody}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Full name</span>
                <span style={styles.detailValue}>{userDetails.name || '—'}</span>
              </div>
              <div style={styles.divider} />
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Email address</span>
                <span style={styles.detailValue}>{userDetails.email || '—'}</span>
              </div>
              <div style={{ height: '8px' }} />
              <button
                style={styles.editBtn}
                onMouseEnter={e => e.target.style.background = '#0e1f7a'}
                onMouseLeave={e => e.target.style.background = '#1428a0'}
                onClick={() => setEditMode(true)}
              >
                Edit profile
              </button>
              <span style={styles.successMsg}>{changed}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;