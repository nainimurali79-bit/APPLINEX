import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Zap, 
  Truck, 
  Heart, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import StatusBadge from '../common/StatusBadge';

const QuickViewModal = ({ appliance, isOpen, onClose, onRentClick }) => {
  const { toggleWishlist, isInWishlist, toggleCompare, isInCompare } = useWishlist();
  const [selectedTenure, setSelectedTenure] = useState(12);

  if (!isOpen || !appliance) return null;

  const inWishlist = isInWishlist(appliance.id);
  const inCompare = isInCompare(appliance.id);
  const isAvailable = appliance.status === 'available';

  // Calculate tenure discount
  const getTenureDiscount = (months) => {
    if (months >= 24) return 0.20;
    if (months >= 12) return 0.15;
    if (months >= 6) return 0.10;
    return 0;
  };

  const discount = getTenureDiscount(selectedTenure);
  const effectiveMonthlyRate = Math.round(appliance.monthly_price * (1 - discount));
  const securityDeposit = appliance.security_deposit || (appliance.monthly_price * 2);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 11, 20, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          maxWidth: '850px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          padding: '2rem'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748B',
            zIndex: 10
          }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Left: Product Image & Badges */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: '100%',
            height: '280px',
            backgroundColor: '#F8FAFC',
            borderRadius: '16px',
            border: '1px solid var(--border-light)',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
              <StatusBadge status={appliance.status} />
            </div>

            <img
              src={appliance.image_url}
              alt={appliance.name}
              style={{
                maxHeight: '100%',
                maxWidth: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))'
              }}
            />
          </div>

          {/* Quick Action Badges */}
          <div style={{ display: 'flex', gap: '0.75rem', width: '100%', marginTop: '1rem' }}>
            <button
              onClick={() => toggleWishlist(appliance)}
              className="btn btn-secondary btn-sm"
              style={{
                flex: 1,
                borderColor: inWishlist ? '#EF4444' : 'var(--border-medium)',
                color: inWishlist ? '#EF4444' : '#475569'
              }}
            >
              <Heart size={16} fill={inWishlist ? '#EF4444' : 'none'} />
              {inWishlist ? 'Saved' : 'Wishlist'}
            </button>
            <button
              onClick={() => toggleCompare(appliance)}
              className="btn btn-secondary btn-sm"
              style={{
                flex: 1,
                borderColor: inCompare ? 'var(--blue-primary)' : 'var(--border-medium)',
                color: inCompare ? 'var(--blue-primary)' : '#475569'
              }}
            >
              <Layers size={16} />
              {inCompare ? 'Comparing' : 'Compare'}
            </button>
          </div>
        </div>

        {/* Right: Product Details & Pricing */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {appliance.brand} • {appliance.category_name}
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--navy-primary)', marginTop: '4px', marginBottom: '0.5rem' }}>
            {appliance.name}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#F59E0B', fontWeight: 700, fontSize: '0.88rem' }}>
              <Star size={16} fill="#F59E0B" />
              <span>{parseFloat(appliance.rating).toFixed(1)}</span>
            </div>
            <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>• {appliance.reviews_count || 18} Verified Reviews</span>
          </div>

          {/* Key Specs Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {appliance.capacity && (
              <span style={{ backgroundColor: '#F1F5F9', color: '#334155', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>
                Capacity: {appliance.capacity}
              </span>
            )}
            {appliance.energy_rating && (
              <span style={{ backgroundColor: '#ECFDF5', color: '#059669', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>
                Energy: {appliance.energy_rating}
              </span>
            )}
            <span style={{ backgroundColor: '#EFF6FF', color: '#1E60D5', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>
              Free Installation & Stabilizer
            </span>
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            {appliance.description || "Premium smart inverter appliance optimized for high energy efficiency, silent performance, and continuous smart connectivity."}
          </p>

          {/* Tenure Selection Buttons */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>
              Select Tenure Plan:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
              {[3, 6, 12, 24].map((tenure) => (
                <button
                  key={tenure}
                  onClick={() => setSelectedTenure(tenure)}
                  style={{
                    padding: '0.45rem',
                    borderRadius: '8px',
                    border: selectedTenure === tenure ? '2px solid var(--blue-primary)' : '1px solid var(--border-medium)',
                    backgroundColor: selectedTenure === tenure ? '#EFF6FF' : '#FFFFFF',
                    color: selectedTenure === tenure ? 'var(--blue-primary)' : '#475569',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {tenure} Mo {getTenureDiscount(tenure) > 0 && <span style={{ color: '#10B981', display: 'block', fontSize: '0.65rem' }}>-{Math.round(getTenureDiscount(tenure) * 100)}%</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing & Rent CTA */}
          <div style={{
            backgroundColor: '#F8FAFC',
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            border: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase' }}>Effective Rate</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
                ₹{effectiveMonthlyRate.toLocaleString()} <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 400 }}>/mo</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 600 }}>
                ₹{parseInt(securityDeposit).toLocaleString()} Refundable Deposit
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link
                to={`/appliances/${appliance.id}`}
                onClick={onClose}
                className="btn btn-secondary btn-sm"
                style={{ textDecoration: 'none' }}
              >
                Full Details
              </Link>
              <button
                onClick={() => {
                  onClose();
                  onRentClick && onRentClick(appliance);
                }}
                disabled={!isAvailable}
                className="btn btn-primary"
                style={{
                  opacity: isAvailable ? 1 : 0.6,
                  cursor: isAvailable ? 'pointer' : 'not-allowed'
                }}
              >
                {isAvailable ? 'Rent Now' : 'Unavailable'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
