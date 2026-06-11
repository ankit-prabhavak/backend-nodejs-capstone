import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from "../../config";
import { useAppContext } from '../../context/AppContext';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f5f5f5',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '60px 16px',
    fontFamily: "'Samsung One', 'SamsungOne', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  card: {
    background: '#fff',
    width: '100%',
    maxWidth: '480px',
    padding: '48px 40px',
    borderRadius: '4px',
  },
  heading: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1d1d1f',
    marginBottom: '36px',
    letterSpacing: '-0.3px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#666',
    marginBottom: '6px',
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '15px',
    color: '#1d1d1f',
    border: '1.5px solid #e0e0e0',
    borderRadius: '2px',
    background: '#fafafa',
    outline: 'none',
    transition: 'border-color 0.15s',
    boxSizing: 'border-box',
    marginBottom: '20px',
  },
  select: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '15px',
    color: '#1d1d1f',
    border: '1.5px solid #e0e0e0',
    borderRadius: '2px',
    background: '#fafafa',
    outline: 'none',
    appearance: 'none',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  textarea: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '15px',
    color: '#1d1d1f',
    border: '1.5px solid #e0e0e0',
    borderRadius: '2px',
    background: '#fafafa',
    outline: 'none',
    resize: 'vertical',
    minHeight: '100px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    marginBottom: '20px',
  },
  fileWrapper: {
    border: '1.5px dashed #ccc',
    borderRadius: '2px',
    padding: '16px',
    marginBottom: '28px',
    background: '#fafafa',
    fontSize: '14px',
    color: '#666',
  },
  fileInput: {
    fontSize: '14px',
    color: '#444',
    cursor: 'pointer',
  },
  button: {
    width: '100%',
    padding: '15px',
    background: '#1428a0',
    color: '#fff',
    border: 'none',
    borderRadius: '2px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    letterSpacing: '0.3px',
    transition: 'background 0.15s',
    marginBottom: '12px',
  },
  message: {
    color: '#1428a0',
    fontSize: '13px',
    fontStyle: 'italic',
    minHeight: '20px',
    display: 'block',
    textAlign: 'center',
  },
  divider: {
    height: '1px',
    background: '#f0f0f0',
    marginBottom: '20px',
  },
};

function ItemPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Living');
  const [condition, setCondition] = useState('New');
  const [zipcode, setZipcode] = useState('10110');
  const [age_days, setAge_days] = useState(0);
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState(null);
  const { isLoggedIn } = useAppContext();

  useEffect(() => {
    if (!isLoggedIn) navigate('/app/login');
  });

  const handleAddItem = async () => {
    const formData = new FormData();
    const file = document.getElementById('file').files[0];
    formData.append('file', file);
    formData.append('name', document.getElementById('name').value);
    formData.append('category', category);
    formData.append('condition', condition);
    formData.append('zipcode', document.getElementById('zipcode').value);
    let age_days = document.getElementById('age_days').value;
    formData.append('age_days', age_days);
    formData.append('age_years', (age_days / 365).toFixed(2));
    formData.append('description', document.getElementById('description').value);
    formData.append('image', `/images/${file.name}`);
    formData.append('comments', []);

    try {
      let url = `${urlConfig.backendUrl}/api/secondchance/items`;
      console.log(url);
      const response = await fetch(url, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      if (data) {
        setMessage("Item added successfully!");
        setTimeout(() => { setMessage(""); navigate("/"); }, 500);
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  const focusStyle = (e) => { e.target.style.borderColor = '#1428a0'; e.target.style.background = '#fff'; };
  const blurStyle = (e) => { e.target.style.borderColor = '#e0e0e0'; e.target.style.background = '#fafafa'; };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>List an Item</h2>
        <div style={styles.divider} />

        <label style={styles.label} htmlFor="name">Item Name</label>
        <input
          id="name" type="text" style={styles.input}
          placeholder="e.g. Wooden coffee table"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={focusStyle} onBlur={blurStyle}
        />

        <label style={styles.label} htmlFor="category">Category</label>
        <select id="category" style={styles.select} onChange={(e) => setCategory(e.target.value)} onFocus={focusStyle} onBlur={blurStyle}>
          {['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'].map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <label style={styles.label} htmlFor="condition">Condition</label>
        <select id="condition" style={styles.select} onChange={(e) => setCondition(e.target.value)} onFocus={focusStyle} onBlur={blurStyle}>
          {['New', 'Like New', 'Older'].map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <label style={styles.label} htmlFor="zipcode">ZIP Code</label>
        <input
          id="zipcode" type="text" style={styles.input}
          placeholder="e.g. 10001"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
          onFocus={focusStyle} onBlur={blurStyle}
        />

        <label style={styles.label} htmlFor="age_days">Age (days)</label>
        <input
          id="age_days" type="text" style={styles.input}
          placeholder="e.g. 365"
          value={age_days}
          onChange={(e) => setAge_days(e.target.value)}
          onFocus={focusStyle} onBlur={blurStyle}
        />

        <label style={styles.label} htmlFor="description">Description</label>
        <textarea
          id="description" style={styles.textarea}
          placeholder="Describe the item's features, size, material..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onFocus={focusStyle} onBlur={blurStyle}
        />

        <label style={styles.label}>Photo</label>
        <div style={styles.fileWrapper}>
          <input style={styles.fileInput} type="file" id="file" name="file" accept=".jpg, .png, .gif" />
        </div>

        <button
          style={styles.button}
          onMouseEnter={(e) => e.target.style.background = '#0e1f7a'}
          onMouseLeave={(e) => e.target.style.background = '#1428a0'}
          onClick={handleAddItem}
        >
          Add Item
        </button>
        <span style={styles.message}>{message}</span>
      </div>
    </div>
  );
}

export default ItemPage;