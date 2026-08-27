import React, { useState, useEffect } from 'react';
import { reviewsApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import StarRating from '../../components/common/StarRating';
import StatusBadge from '../../components/common/StatusBadge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { MessageSquare, Check, X, Search, ShieldCheck } from 'lucide-react';

const ReviewModeration = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { addToast } = useNotification();

  const fetchReviews = () => {
    setLoading(true);
    reviewsApi.getModerationList()
      .then((res) => {
        setReviews(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleModerate = async (reviewId, action) => {
    try {
      await reviewsApi.moderateReview(reviewId, action);
      addToast(`Review marked as ${action}.`, 'success');
      fetchReviews();
    } catch (err) {
      addToast('Failed to moderate review.', 'error');
    }
  };

  const filteredReviews = reviews.filter((r) =>
    r.appliance_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.review_text?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          CONTENT INTEGRITY
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--navy-primary)', marginTop: '2px' }}>
          Customer Review Moderation Desk
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
          Approve or reject customer product feedback to maintain catalog reliability.
        </p>
      </div>

      {/* Table Card */}
      <div className="app-card" style={{ padding: '1.5rem' }}>
        
        <div style={{ marginBottom: '1.5rem', maxWidth: '360px', position: 'relative' }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search reviews, products, users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.2rem' }}
          />
        </div>

        {loading ? (
          <SkeletonLoader count={4} height="80px" />
        ) : filteredReviews.length === 0 ? (
          <div style={{ padding: '3.5rem', textAlign: 'center', color: '#94A3B8' }}>
            No reviews found matching criteria.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Appliance</th>
                  <th>Rating</th>
                  <th>Review Feedback</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Moderation Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((rev) => (
                  <tr key={rev.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{rev.customer_name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{rev.customer_email}</div>
                    </td>
                    <td><strong style={{ color: 'var(--navy-primary)' }}>{rev.appliance_name}</strong></td>
                    <td><StarRating rating={rev.rating} size={13} /></td>
                    <td style={{ maxWidth: '300px', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      "{rev.review_text}"
                    </td>
                    <td><StatusBadge status={rev.status} /></td>
                    <td style={{ fontSize: '0.78rem', color: '#64748B' }}>{new Date(rev.created_at).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {rev.status !== 'approved' && (
                          <button
                            onClick={() => handleModerate(rev.id, 'approved')}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem', backgroundColor: '#10B981' }}
                          >
                            <Check size={12} /> Approve
                          </button>
                        )}
                        {rev.status !== 'rejected' && (
                          <button
                            onClick={() => handleModerate(rev.id, 'rejected')}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem', color: 'var(--error-red)' }}
                          >
                            <X size={12} /> Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default ReviewModeration;
