import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  X, 
  Trash2, 
  ArrowRight, 
  ShoppingBag, 
  Star 
} from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import RentalBookingModal from '../customer/RentalBookingModal';

const WishlistDrawer = () => {
  const { wishlist, removeFromWishlist, clearWishlist, isWishlistOpen, setIsWishlistOpen, wishlistCount } = useWishlist();
  const [selectedAppliance, setSelectedAppliance] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  if (!isWishlistOpen) return null;

  const handleRentClick = (appliance) => {
    setSelectedAppliance(appliance);
    setBookingModalOpen(true);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 11, 20, 0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 1100,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={() => setIsWishlistOpen(false)}
    >
      <div
        style={{
          width: '420px',
          maxWidth: '85vw',
          height: '100%',
          backgroundColor: '#FFFFFF',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1110,
          animation: 'slideLeft 0.25s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-main)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Heart size={20} color="#EF4444" fill="#EF4444" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy-primary)', margin: 0 }}>
              Saved Wishlist ({wishlistCount})
            </h3>
          </div>

          <button
            onClick={() => setIsWishlistOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748B',
              padding: '4px'
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {wishlistCount === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748B' }}>
              <Heart size={48} color="#CBD5E1" style={{ margin: '0 auto 1rem' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '0.5rem' }}>
                Your Wishlist is Empty
              </h4>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                Tap the heart icon on any appliance card to save it for quick access and rental comparison.
              </p>
              <Link
                to="/appliances"
                onClick={() => setIsWishlistOpen(false)}
                className="btn btn-primary btn-sm"
                style={{ marginTop: '1.25rem', textDecoration: 'none', display: 'inline-flex' }}
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            wishlist.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid var(--border-light)',
                  padding: '1rem',
                  display: 'flex',
                  gap: '1rem',
                  boxShadow: 'var(--shadow-xs)',
                  position: 'relative'
                }}
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  style={{
                    width: '70px',
                    height: '70px',
                    objectFit: 'contain',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '8px',
                    padding: '4px'
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--blue-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {item.brand} • {item.category_name}
                  </div>
                  <h4 style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: 'var(--navy-primary)',
                    margin: '2px 0 4px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.name}
                  </h4>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--navy-primary)', marginBottom: '0.5rem' }}>
                    ₹{parseInt(item.monthly_price).toLocaleString()} <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 400 }}>/mo</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => handleRentClick(item)}
                      disabled={item.status !== 'available'}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                    >
                      Rent Now
                    </button>
                    <Link
                      to={`/appliances/${item.id}`}
                      onClick={() => setIsWishlistOpen(false)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', textDecoration: 'none' }}
                    >
                      View
                    </Link>
                  </div>
                </div>

                <button
                  onClick={() => removeFromWishlist(item.id)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    padding: '2px'
                  }}
                  title="Remove from wishlist"
                >
                  <X size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlistCount > 0 && (
          <div style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid var(--border-light)',
            backgroundColor: 'var(--bg-main)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <button
              onClick={clearWishlist}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Trash2 size={14} /> Clear All
            </button>

            <Link
              to="/appliances"
              onClick={() => setIsWishlistOpen(false)}
              className="btn btn-primary btn-sm"
              style={{ textDecoration: 'none' }}
            >
              Explore More <ArrowRight size={14} />
            </Link>
          </div>
        )}

      </div>

      {/* Booking Modal */}
      {selectedAppliance && (
        <RentalBookingModal
          appliance={selectedAppliance}
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
        />
      )}
    </div>
  );
};

export default WishlistDrawer;
