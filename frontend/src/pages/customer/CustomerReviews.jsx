import React, { useState, useEffect } from 'react';
import { reviewsApi, rentalsApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import StarRating from '../../components/common/StarRating';
import StatusBadge from '../../components/common/StatusBadge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { Star, MessageSquare, CheckCircle2, Sparkles, Send } from 'lucide-react';

const CustomerReviews = () => {
  const [rentals, setRentals] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Submission Form State
  const [selectedRentalId, setSelectedRentalId] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addToast } = useNotification();

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      rentalsApi.getRentals(),
      reviewsApi.getReviews({ user_only: 'true' })
    ])
      .then(([rentalsRes, reviewsRes]) => {
        setRentals(rentalsRes.data);
        setReviews(reviewsRes.data);
        if (rentalsRes.data.length > 0 && !selectedRentalId) {
          setSelectedRentalId(rentalsRes.data[0].id);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedRentalId) {
      addToast('Please select a rented appliance.', 'error');
      return;
    }
    if (!reviewText.trim()) {
      addToast('Please write your experience review.', 'error');
      return;
    }

    const selectedRental = rentals.find((r) => r.id === parseInt(selectedRentalId));
    if (!selectedRental) return;

    setIsSubmitting(true);
    try {
      await reviewsApi.createReview({
        appliance: selectedRental.appliance,
        rental: selectedRental.id,
        rating,
        review_text: reviewText,
      });

      setIsSubmitting(false);
      setReviewText('');
      setRating(5);
      addToast('Thank you! Your review has been submitted.', 'success');
      fetchData();
    } catch (err) {
      setIsSubmitting(false);
      addToast('Failed to submit review.', 'error');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '80vh', padding: '2rem 0 4rem' }}>
      <div className="container-custom">
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            CUSTOMER REVIEWS
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--navy-primary)', marginTop: '2px' }}>
            Rate & Review Appliances
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
            Share your authentic feedback on rented household appliances to help other smart living enthusiasts.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 440px) 1fr',
          gap: '2rem',
          alignItems: 'start'
        }} className="reviews-split-grid">
          
          {/* Left: Rate Your Experience Card matching reference */}
          <div className="app-card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-primary)', marginBottom: '0.35rem' }}>
              Rate Your Experience
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '1.5rem' }}>
              Select one of your rented appliances to submit a verified rating.
            </p>

            <form onSubmit={handleSubmitReview}>
              
              <div className="form-group">
                <label className="form-label">Select Rented Appliance</label>
                {rentals.length === 0 ? (
                  <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                    You have no rentals to review yet.
                  </div>
                ) : (
                  <select
                    className="form-control"
                    value={selectedRentalId}
                    onChange={(e) => setSelectedRentalId(e.target.value)}
                  >
                    {rentals.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.appliance_details?.name} ({r.rental_id})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Star Rating selector */}
              <div className="form-group">
                <label className="form-label">Your Rating</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0' }}>
                  <StarRating
                    rating={rating}
                    size={28}
                    interactive={true}
                    onChange={(val) => setRating(val)}
                  />
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#F59E0B' }}>
                    {rating}.0 ★
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Review Text</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Great product! Working perfectly. Cooling is fast and silent..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || rentals.length === 0}
                className="btn btn-primary btn-block btn-lg"
              >
                <Send size={16} /> {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>

            </form>
          </div>

          {/* Right: My Submitted Reviews History */}
          <div className="app-card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-primary)', marginBottom: '1.25rem' }}>
              My Reviews History
            </h2>

            {loading ? (
              <SkeletonLoader count={2} height="120px" />
            ) : reviews.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                <MessageSquare size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
                <p style={{ margin: 0 }}>You haven't submitted any reviews yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '10px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div>
                        <h4 style={{ fontWeight: 700, color: 'var(--navy-primary)', fontSize: '0.95rem' }}>
                          {rev.appliance_name}
                        </h4>
                        <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                          {new Date(rev.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <StarRating rating={rev.rating} size={15} />
                        <StatusBadge status={rev.status} />
                      </div>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                      "{rev.review_text}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 850px) {
          .reviews-split-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CustomerReviews;
