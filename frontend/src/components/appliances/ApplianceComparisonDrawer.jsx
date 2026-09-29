import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, X, ArrowRight, Trash2 } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

const ApplianceComparisonDrawer = () => {
  const { compareList, removeFromCompare, clearCompare, compareCount } = useWishlist();

  if (compareCount === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(11, 25, 44, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '16px',
        border: '1px solid rgba(0, 196, 255, 0.4)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
        padding: '0.85rem 1.5rem',
        zIndex: 990,
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        maxWidth: '90vw',
        animation: 'slideDown 0.3s ease-out'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          backgroundColor: 'rgba(0, 196, 255, 0.2)',
          color: '#00C4FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Layers size={18} />
        </div>
        <div>
          <div style={{ color: '#FFFFFF', fontSize: '0.88rem', fontWeight: 700 }}>
            Appliance Comparison
          </div>
          <div style={{ color: '#94A3B8', fontSize: '0.72rem' }}>
            {compareCount} of 4 selected
          </div>
        </div>
      </div>

      {/* Appliance thumbnails */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        {compareList.map((item) => (
          <div
            key={item.id}
            style={{
              position: 'relative',
              width: '48px',
              height: '48px',
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <img
              src={item.image_url}
              alt={item.name}
              style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
            />
            <button
              onClick={() => removeFromCompare(item.id)}
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Remove"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Link
          to="/appliances/compare"
          className="btn btn-primary btn-sm"
          style={{
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            fontSize: '0.82rem',
            boxShadow: '0 0 15px rgba(0, 196, 255, 0.4)'
          }}
        >
          Compare Now <ArrowRight size={14} />
        </Link>

        <button
          onClick={clearCompare}
          style={{
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            fontSize: '0.78rem',
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <Trash2 size={14} /> Clear
        </button>
      </div>
    </div>
  );
};

export default ApplianceComparisonDrawer;
