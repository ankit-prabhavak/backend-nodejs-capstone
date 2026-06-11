import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { urlConfig } from "../../config";
import { useAppContext } from '../../context/AppContext';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f5f5f5',
    fontFamily: "'Samsung One', 'SamsungOne', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: '40px 16px 80px',
  },
  inner: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1428a0',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    marginBottom: '28px',
    letterSpacing: '0.2px',
  },
  card: {
    background: '#fff',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  imageWrap: {
    width: '100%',
    maxHeight: '420px',
    background: '#f0f0f0',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    maxHeight: '420px',
    objectFit: 'cover',
    display: 'block',
  },
  noImage: {
    padding: '80px 0',
    color: '#bbb',
    fontSize: '14px',
  },
  cardBody: {
    padding: '36px 40px',
  },
  itemName: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1d1d1f',
    letterSpacing: '-0.3px',
    marginBottom: '24px',
  },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0',
    borderTop: '1px solid #f0f0f0',
    marginBottom: '28px',
  },
  metaCell: {
    padding: '16px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  metaLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px',
  },
  metaValue: {
    fontSize: '15px',
    color: '#1d1d1f',
    fontWeight: '500',
  },
  descLabel: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '10px',
  },
  descText: {
    fontSize: '15px',
    color: '#444',
    lineHeight: '1.7',
  },
  commentsSection: {
    marginTop: '24px',
    background: '#fff',
    borderRadius: '2px',
    padding: '32px 40px',
  },
  commentsTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1d1d1f',
    marginBottom: '20px',
    letterSpacing: '-0.1px',
  },
  commentCard: {
    borderTop: '1px solid #f0f0f0',
    paddingTop: '16px',
    paddingBottom: '8px',
  },
  commentAuthor: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1428a0',
    marginBottom: '4px',
  },
  commentText: {
    fontSize: '14px',
    color: '#555',
    lineHeight: '1.6',
  },
  noComments: {
    fontSize: '14px',
    color: '#bbb',
    paddingTop: '8px',
  },
  stateMsg: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    fontSize: '15px',
    color: '#888',
    fontFamily: "'Samsung One', sans-serif",
  },
};

function DetailsPage() {
  const navigate = useNavigate();
  const { itemId } = useParams();
  const [gift, setGift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useAppContext();

  useEffect(() => {
    if (!isLoggedIn) navigate('/app/login');
    window.scrollTo(0, 0);
    const fetchItem = async () => {
      try {
        const response = await fetch(`${urlConfig.backendUrl}/api/secondchance/items/${itemId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setGift(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
    window.scrollTo(0, 0);
  }, [itemId, isLoggedIn, navigate]);

  if (loading) return <div style={styles.stateMsg}>Loading...</div>;
  if (error) return <div style={styles.stateMsg}>Error: {error}</div>;
  if (!gift) return <div style={styles.stateMsg}>Item not found</div>;

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <button
          style={styles.backBtn}
          onMouseEnter={e => e.target.style.opacity = '0.7'}
          onMouseLeave={e => e.target.style.opacity = '1'}
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div style={styles.card}>
          <div style={styles.imageWrap}>
            {gift.image
              ? <img src={urlConfig.backendUrl + gift.image} alt={gift.name} style={styles.image} />
              : <div style={styles.noImage}>No image available</div>
            }
          </div>
          <div style={styles.cardBody}>
            <h1 style={styles.itemName}>{gift.name}</h1>

            <div style={styles.metaGrid}>
              {[
                ['Category', gift.category],
                ['Condition', gift.condition],
                ['Date Added', gift.date_added],
                ['Age (Years)', gift.age_years],
              ].map(([label, value]) => (
                <div key={label} style={styles.metaCell}>
                  <div style={styles.metaLabel}>{label}</div>
                  <div style={styles.metaValue}>{value}</div>
                </div>
              ))}
            </div>

            <div style={styles.descLabel}>Description</div>
            <p style={styles.descText}>{gift.description}</p>
          </div>
        </div>

        <div style={styles.commentsSection}>
          <h3 style={styles.commentsTitle}>Comments</h3>
          {gift.comments.length > 0
            ? gift.comments.map((comment, index) => (
              <div key={index} style={styles.commentCard}>
                <div style={styles.commentAuthor}>{comment.author}</div>
                <div style={styles.commentText}>{comment.comment}</div>
              </div>
            ))
            : <div style={styles.noComments}>No comments yet.</div>
          }
        </div>
      </div>
    </div>
  );
}

export default DetailsPage;