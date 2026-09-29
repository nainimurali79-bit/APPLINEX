import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { appliancesApi, reviewsApi } from '../../services/api';
import RentalBookingModal from '../../components/customer/RentalBookingModal';
import StatusBadge from '../../components/common/StatusBadge';
import StarRating from '../../components/common/StarRating';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { 
  ShieldCheck, 
  Truck, 
  Wrench, 
  Star, 
  Check, 
  Zap, 
  Info, 
  ArrowLeft, 
  Share2, 
  Heart,
  Calendar,
  Lock,
  Layers
} from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useNotification } from '../../context/NotificationContext';

const ApplianceDetail = () => {
  const { id } = useParams();
  const { toggleWishlist, isInWishlist, toggleCompare, isInCompare } = useWishlist();
  const { addToast } = useNotification();
  const [appliance, setAppliance] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    appliancesApi.getAppliance(id)
      .then((res) => {
        setAppliance(res.data);
        setActiveImage(res.data.image_url);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    reviewsApi.getReviews({ appliance_id: id })
      .then((res) => setReviews(res.data))
      .catch(console.error);
  }, [id]);

  if (loading) {
    return (
      <div className="container-custom" style={{ padding: '3rem 1.5rem' }}>
        <SkeletonLoader count={2} height="400px" />
      </div>
    );
  }

  if (!appliance) {
    return (
      <div className="container-custom" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h2>Appliance Not Found</h2>
        <p style={{ color: '#64748B', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
          The requested appliance could not be found or is no longer listed.
        </p>
        <Link to="/appliances" className="btn btn-primary">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const isAvailable = appliance.status === 'available';

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '80vh', padding: '2rem 0 4rem' }}>
      <div className="container-custom">
        
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748B', marginBottom: '1.5rem' }}>
          <Link to="/" style={{ color: '#64748B' }}>Home</Link>
          <span>/</span>
          <Link to="/appliances" style={{ color: '#64748B' }}>Appliances</Link>
          <span>/</span>
          <Link to={`/appliances?category=${appliance.category_slug}`} style={{ color: '#64748B' }}>{appliance.category_name}</Link>
          <span>/</span>
          <span style={{ color: 'var(--navy-primary)', fontWeight: 600 }}>{appliance.name}</span>
        </div>

        {/* Top Product Hero Block */}
        <div className="app-card" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1fr) 1.2fr',
            gap: '3rem',
            alignItems: 'start'
          }} className="detail-hero-grid">
            
            {/* Left Image Gallery */}
            <div>
              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '16px',
                border: '1px solid var(--border-light)',
                padding: '2.5rem',
                height: '380px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                position: 'relative'
              }}>
                <img
                  src={activeImage || appliance.image_url}
                  alt={appliance.name}
                  style={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    transition: 'transform var(--transition-normal)'
                  }}
                />
              </div>

              {/* Thumbnails if gallery exists */}
              {appliance.gallery_images && appliance.gallery_images.length > 0 && (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div
                    onClick={() => setActiveImage(appliance.image_url)}
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '8px',
                      border: activeImage === appliance.image_url ? '2px solid var(--blue-primary)' : '1px solid var(--border-medium)',
                      padding: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    <img src={appliance.image_url} alt="Main" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                  </div>
                  {appliance.gallery_images.map((imgUrl, i) => (
                    <div
                      key={i}
                      onClick={() => setActiveImage(imgUrl)}
                      style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '8px',
                        border: activeImage === imgUrl ? '2px solid var(--blue-primary)' : '1px solid var(--border-medium)',
                        padding: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#FFFFFF'
                      }}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${i}`} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Information & Action Panel */}
            <div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {appliance.brand} • {appliance.category_name}
                </span>
                <StatusBadge status={appliance.status} />
              </div>

              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--navy-primary)', lineHeight: 1.25, marginBottom: '0.75rem' }}>
                {appliance.name}
              </h1>

              {/* Rating and Code */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <StarRating rating={parseFloat(appliance.rating)} size={16} />
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy-primary)' }}>
                    {parseFloat(appliance.rating).toFixed(1)}
                  </span>
                  <span style={{ color: '#64748B', fontSize: '0.82rem' }}>
                    ({appliance.reviews_count} verified reviews)
                  </span>
                </div>
                <span style={{ color: '#CBD5E1' }}>•</span>
                <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                  Model: <strong style={{ color: 'var(--text-primary)' }}>{appliance.model_number || appliance.appliance_code}</strong>
                </div>
              </div>

              {/* Price Box */}
              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                border: '1px solid var(--border-light)',
                padding: '1.25rem 1.5rem',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>
                    Monthly Rental Plan
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
                      ₹{parseInt(appliance.monthly_price).toLocaleString()}
                    </span>
                    <span style={{ fontSize: '0.9rem', color: '#64748B' }}>/month</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}>
                    Refundable Security Deposit: ₹{parseInt(appliance.security_deposit).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '2px' }}>
                    Returned fully upon lease closure
                  </div>
                </div>
              </div>

              {/* Key Specs Highlights */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.75rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--border-light)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase' }}>Capacity</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--navy-primary)', marginTop: '2px' }}>{appliance.capacity || 'Standard'}</div>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--border-light)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase' }}>Energy</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#059669', marginTop: '2px' }}>{appliance.energy_rating || '5 Star'}</div>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--border-light)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase' }}>Type</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--navy-primary)', marginTop: '2px' }}>{appliance.subcategory || appliance.appliance_type || 'Smart'}</div>
                </div>
              </div>

              {/* Primary Action Button & Auxiliary Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => setBookingModalOpen(true)}
                    disabled={!isAvailable}
                    className="btn btn-primary btn-lg"
                    style={{
                      flex: 1,
                      opacity: isAvailable ? 1 : 0.6,
                      cursor: isAvailable ? 'pointer' : 'not-allowed',
                      boxShadow: isAvailable ? '0 4px 20px rgba(30, 96, 213, 0.4)' : 'none'
                    }}
                  >
                    {isAvailable ? 'Rent Now • Quick Setup' : 'Currently Unavailable'}
                  </button>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(appliance)}
                    style={{
                      padding: '0 1.25rem',
                      backgroundColor: isInWishlist(appliance.id) ? '#FEF2F2' : '#F1F5F9',
                      border: isInWishlist(appliance.id) ? '1px solid #FECACA' : '1px solid var(--border-light)',
                      borderRadius: '12px',
                      color: isInWishlist(appliance.id) ? '#EF4444' : '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    title={isInWishlist(appliance.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart size={20} fill={isInWishlist(appliance.id) ? '#EF4444' : 'none'} />
                  </button>
                </div>

                {/* Compare & Share Row */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => toggleCompare(appliance)}
                    className="btn btn-secondary btn-sm"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      backgroundColor: isInCompare(appliance.id) ? 'var(--blue-subtle)' : '#F8FAFC',
                      borderColor: isInCompare(appliance.id) ? 'var(--blue-primary)' : 'var(--border-light)',
                      color: isInCompare(appliance.id) ? 'var(--blue-primary)' : 'var(--navy-primary)',
                      fontWeight: 600,
                      padding: '0.65rem 1rem',
                      borderRadius: '10px'
                    }}
                  >
                    <Layers size={16} />
                    {isInCompare(appliance.id) ? 'In Comparison List' : 'Add to Compare'}
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      addToast('Product link copied to clipboard!', 'success');
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      padding: '0.65rem 1rem',
                      borderRadius: '10px'
                    }}
                    title="Share Appliance"
                  >
                    <Share2 size={16} /> Share
                  </button>
                </div>
              </div>

              {/* Reliability Assurance Badges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', fontSize: '0.78rem', color: '#475569' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Truck size={16} color="var(--blue-primary)" /> Free Doorstep Setup
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Wrench size={16} color="var(--blue-primary)" /> Free Annual Service
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} color="var(--blue-primary)" /> Damage Protection
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Features & Specifications Sections */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '2rem',
          marginBottom: '2.5rem'
        }} className="detail-bottom-grid">
          
          {/* Features */}
          <div className="app-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '1.25rem' }}>
              Key Features & Innovations
            </h3>
            
            {appliance.description && (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {appliance.description}
              </p>
            )}

            {appliance.features && appliance.features.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {appliance.features.map((feature, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                      <Check size={13} strokeWidth={3} />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detailed Specifications Table */}
          <div className="app-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '1.25rem' }}>
              Technical Specifications
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ color: '#64748B' }}>Brand</span>
                <span style={{ fontWeight: 600 }}>{appliance.brand}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ color: '#64748B' }}>Model Number</span>
                <span style={{ fontWeight: 600 }}>{appliance.model_number || appliance.appliance_code}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ color: '#64748B' }}>Dimensions</span>
                <span style={{ fontWeight: 600 }}>{appliance.dimensions || 'Standard Form Factor'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ color: '#64748B' }}>Power Consumption</span>
                <span style={{ fontWeight: 600 }}>{appliance.power_consumption || 'Eco Certified'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ color: '#64748B' }}>Maintenance Support</span>
                <span style={{ fontWeight: 600, color: '#059669' }}>100% Free Onsite Fix</span>
              </div>

              {appliance.specifications && Object.entries(appliance.specifications).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ color: '#64748B' }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Customer Reviews Section */}
        <div className="app-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
                Verified Customer Reviews
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '2px' }}>
                Feedback from active renters of {appliance.name}.
              </p>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.9rem' }}>
              No reviews submitted yet for this model.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {reviews.map((rev) => (
                <div key={rev.id} style={{
                  padding: '1.25rem',
                  borderRadius: '10px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid var(--border-light)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      {rev.customer_avatar ? (
                        <img
                          src={rev.customer_avatar}
                          alt={rev.customer_name || 'Customer'}
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '1px solid #E2E8F0',
                            flexShrink: 0
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        style={{
                          display: rev.customer_avatar ? 'none' : 'flex',
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--blue-subtle)',
                          color: 'var(--blue-primary)',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          flexShrink: 0
                        }}
                      >
                        {rev.customer_name ? rev.customer_name[0] : 'U'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--navy-primary)' }}>{rev.customer_name || 'Verified Renter'}</div>
                        <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{new Date(rev.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                      </div>
                    </div>
                    <StarRating rating={rev.rating} size={14} />
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    {rev.review_text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Booking Modal */}
      <RentalBookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        appliance={appliance}
        onBookingComplete={() => {
          setAppliance((prev) => ({ ...prev, status: 'rented' }));
        }}
      />

      <style>{`
        @media (max-width: 900px) {
          .detail-hero-grid, .detail-bottom-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ApplianceDetail;
