import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const ApplianceCard = ({ appliance, onRentClick, isAiRecommended = false, matchScore }) => {
  const isAvailable = appliance.status === 'available';

  return (
    <div 
      className={`app-card app-card-hover ${isAiRecommended ? 'app-card-ai' : ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top badges bar */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 2
      }}>
        <StatusBadge status={appliance.status} />

        {isAiRecommended && matchScore && (
          <span style={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #00C4FF 100%)',
            color: '#FFFFFF',
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '9999px',
            boxShadow: '0 2px 8px rgba(124, 58, 237, 0.4)'
          }}>
            {matchScore}% Match
          </span>
        )}

        {appliance.featured && !isAiRecommended && (
          <span style={{
            backgroundColor: '#1E60D5',
            color: '#FFFFFF',
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '9999px'
          }}>
            Popular
          </span>
        )}
      </div>

      {/* Image Container with hover zoom */}
      <Link to={`/appliances/${appliance.id}`} style={{ textDecoration: 'none', display: 'block', overflow: 'hidden' }}>
        <div style={{
          height: '210px',
          width: '100%',
          backgroundColor: '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-light)',
          position: 'relative'
        }}>
          <img
            src={appliance.image_url}
            alt={appliance.name}
            loading="lazy"
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
              transition: 'transform var(--transition-normal)'
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        </div>
      </Link>

      {/* Card Content Area */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        
        {/* Category & Brand info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {appliance.brand} • {appliance.category_name}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#F59E0B', fontSize: '0.8rem', fontWeight: 700 }}>
            <Star size={13} fill="#F59E0B" />
            <span>{parseFloat(appliance.rating).toFixed(1)}</span>
            <span style={{ color: '#94A3B8', fontWeight: 400, fontSize: '0.72rem' }}>({appliance.reviews_count})</span>
          </div>
        </div>

        {/* Appliance Name */}
        <Link to={`/appliances/${appliance.id}`} style={{ textDecoration: 'none' }}>
          <h4 style={{
            fontSize: '0.98rem',
            fontWeight: 700,
            color: 'var(--navy-primary)',
            lineHeight: 1.35,
            marginBottom: '0.6rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.7rem'
          }}>
            {appliance.name}
          </h4>
        </Link>

        {/* Feature Pills */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {appliance.capacity && (
            <span style={{ fontSize: '0.72rem', backgroundColor: '#F1F5F9', color: '#475569', padding: '2px 7px', borderRadius: '4px', fontWeight: 500 }}>
              {appliance.capacity}
            </span>
          )}
          {appliance.energy_rating && (
            <span style={{ fontSize: '0.72rem', backgroundColor: '#ECFDF5', color: '#059669', padding: '2px 7px', borderRadius: '4px', fontWeight: 500 }}>
              {appliance.energy_rating}
            </span>
          )}
        </div>

        {/* Price & Action Section */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem'
        }}>
          <div>
            <div style={{ fontSize: '0.68rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Rent from</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
                ₹{parseInt(appliance.monthly_price).toLocaleString()}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>/mo</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <Link 
              to={`/appliances/${appliance.id}`} 
              className="btn btn-secondary btn-sm"
              style={{ textDecoration: 'none', padding: '0.45rem 0.65rem' }}
            >
              Details
            </Link>
            <button
              onClick={() => onRentClick && onRentClick(appliance)}
              disabled={!isAvailable}
              className={`btn btn-sm ${isAvailable ? (isAiRecommended ? 'btn-ai' : 'btn-primary') : 'btn-secondary'}`}
              style={{
                opacity: isAvailable ? 1 : 0.6,
                cursor: isAvailable ? 'pointer' : 'not-allowed',
                padding: '0.45rem 0.85rem'
              }}
            >
              {isAvailable ? 'Rent Now' : 'Unavailable'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ApplianceCard;
