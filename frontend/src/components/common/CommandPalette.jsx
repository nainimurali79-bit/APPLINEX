import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  Package, 
  CreditCard, 
  Headphones, 
  ShieldCheck, 
  Compass, 
  User, 
  X,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { appliancesApi } from '../../services/api';

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [appliances, setAppliances] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      appliancesApi.getAppliances({ limit: 12 })
        .then(res => {
          const items = res.data.results || res.data || [];
          setAppliances(items.slice(0, 8));
        })
        .catch(() => setAppliances([]));
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else window.dispatchEvent(new CustomEvent('open-command-palette'));
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Build searchable items
  const baseActions = [
    { title: 'Explore Appliances Catalog', subtitle: 'Browse all refrigerators, washers & smart appliances', path: '/appliances', icon: Package, group: 'Navigation' },
    { title: 'AI Recommendation Assistant', subtitle: 'Get tailored appliance recommendations', path: '/dashboard/recommendations', icon: Sparkles, group: 'Smart Features' },
    { title: 'My Active Rentals & Tracker', subtitle: 'View rental status, timeline, & return requests', path: '/dashboard/rentals', icon: Layers, group: 'Customer' },
    { title: 'Payments & Invoices', subtitle: 'Manage billing receipts and transactions', path: '/dashboard/payments', icon: CreditCard, group: 'Customer' },
    { title: 'Support & Help Desk', subtitle: 'Raise tickets or chat with support specialists', path: '/support/tickets', icon: Headphones, group: 'Support' },
    { title: 'Admin Command Center', subtitle: 'System analytics, inventory & rental logs', path: '/admin/dashboard', icon: ShieldCheck, group: 'Administration' },
    { title: 'User Profile & Preferences', subtitle: 'Update delivery addresses and personal settings', path: '/dashboard/profile', icon: User, group: 'Account' },
  ];

  const matchedAppliances = appliances
    .filter(a => !query || a.name?.toLowerCase().includes(query.toLowerCase()) || a.category?.name?.toLowerCase().includes(query.toLowerCase()))
    .map(a => ({
      title: a.name,
      subtitle: `${a.category?.name || 'Appliance'} • ₹${a.monthly_rent || 0}/mo`,
      path: `/appliances/${a.id}`,
      icon: Package,
      group: 'Appliances',
      image: a.main_image
    }));

  const matchedActions = baseActions.filter(a => 
    !query || a.title.toLowerCase().includes(query.toLowerCase()) || a.subtitle.toLowerCase().includes(query.toLowerCase()) || a.group.toLowerCase().includes(query.toLowerCase())
  );

  const combinedResults = [...matchedActions, ...matchedAppliances];

  const handleSelect = (item) => {
    navigate(item.path);
    onClose();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 11, 20, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
        paddingLeft: '1rem',
        paddingRight: '1rem'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '640px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          animation: 'slideDown 200ms ease-out forwards'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem 1.25rem',
          borderBottom: '1px solid #E2E8F0',
          backgroundColor: '#F8FAFC'
        }}>
          <Search size={20} color="#1E60D5" />
          <input 
            type="text"
            placeholder="Type a command, appliance name, or page..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              backgroundColor: 'transparent',
              color: '#0F172A',
              fontWeight: 500
            }}
          />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.2rem 0.5rem',
            borderRadius: '6px',
            backgroundColor: '#E2E8F0',
            fontSize: '0.75rem',
            color: '#64748B',
            fontWeight: 600
          }}>
            ESC
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Results Body */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '0.5rem' }}>
          {combinedResults.length === 0 ? (
            <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#64748B' }}>
              <Compass size={36} color="#94A3B8" style={{ margin: '0 auto 0.75rem auto' }} />
              <p style={{ fontWeight: 600, color: '#1E293B', marginBottom: '0.25rem' }}>No matching results</p>
              <p style={{ fontSize: '0.85rem' }}>Try searching for "refrigerator", "rentals", or "dashboard"</p>
            </div>
          ) : (
            combinedResults.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={`${item.title}-${idx}`}
                  onClick={() => handleSelect(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    backgroundColor: selectedIndex === idx ? '#EEF4FF' : 'transparent',
                    transition: 'all 120ms ease'
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.title}
                        style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: '#F1F5F9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#1E60D5'
                      }}>
                        <IconComp size={18} />
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0F172A' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 600, 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '4px',
                      backgroundColor: '#F1F5F9',
                      color: '#475569'
                    }}>
                      {item.group}
                    </span>
                    <ArrowRight size={14} color="#94A3B8" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div style={{
          padding: '0.65rem 1.25rem',
          backgroundColor: '#F8FAFC',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: '#64748B'
        }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span>Navigation: <strong>↑ ↓</strong></span>
            <span>Select: <strong>↵ Enter</strong></span>
            <span>Close: <strong>Esc</strong></span>
          </div>
          <span style={{ color: '#00C4FF', fontWeight: 600 }}>ApplineX Command v2.0</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
