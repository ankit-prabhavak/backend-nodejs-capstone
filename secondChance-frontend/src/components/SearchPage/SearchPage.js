import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f5f5f5',
    fontFamily: "'Samsung One', 'SamsungOne', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: '0 0 60px',
  },
  hero: {
    background: '#1428a0',
    padding: '40px 24px 36px',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '16px',
    letterSpacing: '-0.2px',
  },
  searchRow: {
    display: 'flex',
    maxWidth: '520px',
    margin: '0 auto',
    gap: '0',
  },
  searchInput: {
    flex: 1,
    padding: '13px 18px',
    fontSize: '15px',
    border: 'none',
    borderRadius: '2px 0 0 2px',
    outline: 'none',
    background: '#fff',
    color: '#1d1d1f',
  },
  searchButton: {
    padding: '13px 22px',
    background: '#fff',
    color: '#1428a0',
    border: 'none',
    borderRadius: '0 2px 2px 0',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    letterSpacing: '0.3px',
    borderLeft: '1px solid #e0e0e0',
    transition: 'background 0.15s',
  },
  body: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '32px 16px 0',
    display: 'flex',
    gap: '28px',
    alignItems: 'flex-start',
  },
  sidebar: {
    width: '200px',
    flexShrink: 0,
    background: '#fff',
    borderRadius: '2px',
    padding: '24px 20px',
  },
  sidebarTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1428a0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '18px',
  },
  filterLabel: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
    marginBottom: '5px',
    marginTop: '14px',
  },
  select: {
    width: '100%',
    padding: '9px 10px',
    fontSize: '14px',
    border: '1.5px solid #e0e0e0',
    borderRadius: '2px',
    background: '#fafafa',
    color: '#1d1d1f',
    outline: 'none',
    appearance: 'none',
    cursor: 'pointer',
  },
  sliderLabel: {
    fontSize: '13px',
    color: '#444',
    marginBottom: '6px',
    marginTop: '14px',
    display: 'block',
  },
  slider: {
    width: '100%',
    accentColor: '#1428a0',
  },
  results: {
    flex: 1,
    minWidth: 0,
  },
  resultsCount: {
    fontSize: '13px',
    color: '#888',
    marginBottom: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
  },
  productCard: {
    background: '#fff',
    borderRadius: '2px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  productImage: {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    display: 'block',
    background: '#f0f0f0',
  },
  productBody: {
    padding: '14px 16px',
  },
  productName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1d1d1f',
    marginBottom: '6px',
    letterSpacing: '-0.1px',
  },
  productDesc: {
    fontSize: '13px',
    color: '#888',
    lineHeight: '1.5',
    marginBottom: '12px',
  },
  viewBtn: {
    display: 'inline-block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#1428a0',
    background: 'none',
    border: '1.5px solid #1428a0',
    borderRadius: '2px',
    padding: '6px 14px',
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s',
  },
  empty: {
    background: '#fff',
    borderRadius: '2px',
    padding: '48px 24px',
    textAlign: 'center',
    color: '#999',
    fontSize: '15px',
  },
};

const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
const conditions = ['New', 'Like New', 'Older'];

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [ageRange, setAgeRange] = useState(6);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${urlConfig.backendUrl}/api/secondchance/items`);
        if (!response.ok) throw new Error(`HTTP error; ${response.status}`);
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.log('Fetch error: ' + error.message);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = async () => {
    const baseUrl = `${urlConfig.backendUrl}/api/secondchance/search?`;
    const queryParams = new URLSearchParams({
      name: searchQuery,
      age_years: ageRange,
      category: document.getElementById('categorySelect').value,
      condition: document.getElementById('conditionSelect').value,
    }).toString();
    try {
      const response = await fetch(`${baseUrl}${queryParams}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Failed to fetch search results:', error);
    }
  };

  const goToDetailsPage = (productId) => navigate(`/app/product/${productId}`);

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch(); };

  return (
    <div style={styles.page}>
      {/* Hero / Search Bar */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Find Pre-Loved Items Near You</h1>
        <div style={styles.searchRow}>
          <input
            type="text"
            style={styles.searchInput}
            placeholder="Search items..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            style={styles.searchButton}
            onMouseEnter={e => e.target.style.background = '#f0f0f0'}
            onMouseLeave={e => e.target.style.background = '#fff'}
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {/* Main body */}
      <div style={styles.body}>
        {/* Filters sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarTitle}>Filters</div>

          <label style={styles.filterLabel} htmlFor="categorySelect">Category</label>
          <select id="categorySelect" style={styles.select}>
            <option value="">All</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <label style={styles.filterLabel} htmlFor="conditionSelect">Condition</label>
          <select id="conditionSelect" style={styles.select}>
            <option value="">All</option>
            {conditions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <span style={styles.sliderLabel}>Under {ageRange} yr{ageRange !== 1 ? 's' : ''} old</span>
          <input
            type="range" id="ageRange" style={styles.slider}
            min="1" max="10" value={ageRange}
            onChange={e => setAgeRange(e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#bbb', marginTop: '3px' }}>
            <span>1</span><span>10</span>
          </div>
        </div>

        {/* Results */}
        <div style={styles.results}>
          <div style={styles.resultsCount}>{searchResults.length} item{searchResults.length !== 1 ? 's' : ''} found</div>
          {searchResults.length > 0 ? (
            <div style={styles.grid}>
              {searchResults.map(product => (
                <div
                  key={product.id}
                  style={styles.productCard}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                >
                  <img
                    src={urlConfig.backendUrl + product.image}
                    alt={product.name}
                    style={styles.productImage}
                  />
                  <div style={styles.productBody}>
                    <div style={styles.productName}>{product.name}</div>
                    <div style={styles.productDesc}>{product.description?.slice(0, 70)}...</div>
                    <button
                      style={styles.viewBtn}
                      onMouseEnter={e => { e.target.style.background = '#1428a0'; e.target.style.color = '#fff'; }}
                      onMouseLeave={e => { e.target.style.background = 'none'; e.target.style.color = '#1428a0'; }}
                      onClick={() => goToDetailsPage(product.id)}
                    >
                      View details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.empty}>No items match your filters. Try adjusting them.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;