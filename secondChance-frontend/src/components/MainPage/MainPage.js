import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Package, Calendar } from 'lucide-react';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AppContext';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f5f5f5',
    fontFamily: "'Samsung One', 'SamsungOne', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    paddingBottom: '60px',
  },
  hero: {
    background: '#1428a0',
    padding: '64px 24px 56px',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#fff',
    letterSpacing: '-0.5px',
    marginBottom: '12px',
  },
  heroSub: {
    fontSize: '16px',
    color: 'rgba(255,255,255,0.75)',
    marginBottom: '28px',
    lineHeight: '1.6',
  },
  heroBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '13px 28px',
    background: '#fff',
    color: '#1428a0',
    border: 'none',
    borderRadius: '2px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    letterSpacing: '0.2px',
    transition: 'background 0.15s, color 0.15s',
  },
  section: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '36px 16px 0',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1d1d1f',
    letterSpacing: '-0.2px',
  },
  sectionCount: {
    fontSize: '13px',
    color: '#999',
    fontWeight: '500',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '16px',
  },
  card: {
    background: '#fff',
    borderRadius: '2px',
    overflow: 'hidden',
    transition: 'transform 0.15s, box-shadow 0.15s',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
  },
  imageWrap: {
    width: '100%',
    aspectRatio: '4/3',
    background: '#f0f0f0',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  noImage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    color: '#ccc',
    fontSize: '12px',
  },
  cardBody: {
    padding: '16px 18px 12px',
    flex: 1,
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1d1d1f',
    marginBottom: '8px',
    letterSpacing: '-0.1px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  conditionNew: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: '700',
    color: '#1428a0',
    background: '#e8ecf8',
    padding: '3px 8px',
    borderRadius: '2px',
    letterSpacing: '0.2px',
    marginBottom: '8px',
  },
  conditionOther: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: '700',
    color: '#7a5c00',
    background: '#fef3cd',
    padding: '3px 8px',
    borderRadius: '2px',
    letterSpacing: '0.2px',
    marginBottom: '8px',
  },
  dateAdded: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#aaa',
    marginTop: '4px',
  },
  cardFooter: {
    padding: '0 18px 16px',
  },
  viewBtn: {
    width: '100%',
    padding: '10px',
    background: '#1428a0',
    color: '#fff',
    border: 'none',
    borderRadius: '2px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.15s',
    letterSpacing: '0.2px',
  },
};

function MainPage() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const { isLoggedIn } = useAppContext();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${urlConfig.backendUrl}/api/secondchance/items`);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.log('Fetch error: ' + error.message);
      }
    };
    fetchItems();
  }, []);

  const goToDetailsPage = (itemId) => navigate(`/app/item/${itemId}`);
  const handleAddItem = () => navigate(`/app/addItem`);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div style={styles.page}>
      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Find Items a New Home</h1>
        <p style={styles.heroSub}>
          Browse pre-owned items in your area.<br />Sustainable, affordable, community-driven.
        </p>
        {isLoggedIn && (
          <button
            style={styles.heroBtn}
            onMouseEnter={e => { e.currentTarget.style.background = '#e8ecf8'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
            onClick={handleAddItem}
          >
            <Plus size={15} />
            Post an Item
          </button>
        )}
      </div>

      {/* Grid */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>Available Items</span>
          <span style={styles.sectionCount}>{items.length} listings</span>
        </div>

        <div style={styles.grid}>
          {items.map((item) => (
            <div
              key={item.id}
              style={styles.card}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.09)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <div style={styles.imageWrap}>
                {item.image ? (
                  <img src={urlConfig.backendUrl + item.image} alt={item.name} style={styles.image} />
                ) : (
                  <div style={styles.noImage}>
                    <Package size={28} strokeWidth={1.2} />
                    <span>No Image</span>
                  </div>
                )}
              </div>

              <div style={styles.cardBody}>
                <div style={styles.cardTitle}>{item.name}</div>
                <span style={item.condition === 'New' ? styles.conditionNew : styles.conditionOther}>
                  {item.condition}
                </span>
                <div style={styles.dateAdded}>
                  <Calendar size={11} />
                  {formatDate(item.date_added)}
                </div>
              </div>

              <div style={styles.cardFooter}>
                <button
                  style={styles.viewBtn}
                  onMouseEnter={e => e.target.style.background = '#0e1f7a'}
                  onMouseLeave={e => e.target.style.background = '#1428a0'}
                  onClick={() => goToDetailsPage(item.id)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainPage;