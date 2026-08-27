import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { 
  ShieldCheck, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  Package, 
  LayoutDashboard, 
  CreditCard, 
  Sparkles, 
  Headphones, 
  ChevronDown,
  Search,
  TrendingUp
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const { notifications, unreadCount, markAllAsRead } = useNotification();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      backgroundColor: 'rgba(5, 11, 20, 0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.35)'
    }}>
      <div className="container-custom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '74px' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #1E60D5 0%, #00C4FF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 196, 255, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L3 19H8.5L12 11.5L15.5 19H21L12 3Z" fill="white" />
              <circle cx="12" cy="11.5" r="2.2" fill="#00C4FF" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '1.45rem', fontWeight: '800', letterSpacing: '0.04em', color: '#FFFFFF', lineHeight: 1 }}>
              APPLINEX
            </div>
            <div style={{ fontSize: '0.66rem', color: '#00C4FF', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '3px', fontWeight: 600 }}>
              Smart Living Ecosystem
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '1.85rem' }} className="desktop-nav">
          <Link 
            to="/" 
            style={{ 
              color: isActive('/') ? '#00C4FF' : '#E2E8F0', 
              fontWeight: isActive('/') ? 600 : 500, 
              fontSize: '0.92rem',
              transition: 'color var(--transition-fast)'
            }}
          >
            Home
          </Link>
          <Link 
            to="/appliances" 
            style={{ 
              color: isActive('/appliances') ? '#00C4FF' : '#E2E8F0', 
              fontWeight: isActive('/appliances') ? 600 : 500, 
              fontSize: '0.92rem',
              transition: 'color var(--transition-fast)'
            }}
          >
            Appliances Catalog
          </Link>
          <Link 
            to="/dashboard/recommendations" 
            style={{ 
              color: '#C084FC', 
              fontWeight: 600, 
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'color var(--transition-fast)'
            }}
          >
            <Sparkles size={16} /> AI Advisor
          </Link>
          <a 
            href="/#why-applinex" 
            style={{ 
              color: '#94A3B8', 
              fontWeight: 500, 
              fontSize: '0.92rem',
              transition: 'color var(--transition-fast)'
            }}
          >
            Why Rent
          </a>
        </nav>

        {/* Action Controls & Authentication Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          
          {/* Quick Search Spotlight Button */}
          <button 
            onClick={openCommandPalette}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#94A3B8',
              cursor: 'pointer',
              fontSize: '0.82rem',
              transition: 'all 150ms ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.14)';
              e.currentTarget.style.borderColor = '#00C4FF';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.color = '#94A3B8';
            }}
            title="Press Ctrl+K to search"
          >
            <Search size={15} color="#00C4FF" />
            <span style={{ display: 'none' }} className="desktop-search-text">Search...</span>
            <kbd style={{
              fontSize: '0.68rem',
              padding: '0.15rem 0.4rem',
              borderRadius: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              color: '#E2E8F0',
              fontWeight: 600
            }}>
              Ctrl K
            </kbd>
          </button>

          {/* Notifications Bell */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              style={{
                background: notifOpen ? 'rgba(0, 196, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                border: notifOpen ? '1px solid #00C4FF' : '1px solid rgba(255, 255, 255, 0.15)',
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 150ms ease'
              }}
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '0.68rem',
                  fontWeight: '700',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 8px rgba(239, 68, 68, 0.7)'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {notifOpen && (
              <div style={{
                position: 'absolute',
                top: '48px',
                right: 0,
                width: '340px',
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-light)',
                zIndex: 1100,
                overflow: 'hidden',
                animation: 'fadeIn 200ms ease-out'
              }}>
                <div style={{
                  padding: '0.85rem 1.15rem',
                  backgroundColor: 'var(--navy-primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--navy-border)'
                }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Bell size={15} color="#00C4FF" /> Notifications
                  </div>
                  <button 
                    onClick={markAllAsRead} 
                    style={{ background: 'transparent', border: 'none', color: '#00C4FF', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Mark all read
                  </button>
                </div>
                <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
                      No new notifications right now.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} style={{
                        padding: '0.85rem 1.15rem',
                        borderBottom: '1px solid var(--border-light)',
                        backgroundColor: n.read ? '#FFFFFF' : '#F0F7FF',
                        transition: 'background-color 150ms ease'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.82rem', color: '#0F172A' }}>{n.title}</span>
                          <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{n.time}</span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#475569', margin: 0, lineHeight: 1.4 }}>{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Auth Buttons / Profile Dropdown */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  background: profileOpen ? 'rgba(30, 96, 213, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                  border: profileOpen ? '1px solid #1E60D5' : '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #1E60D5 0%, #00C4FF 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  boxShadow: '0 0 10px rgba(0, 196, 255, 0.3)'
                }}>
                  {user?.first_name ? user.first_name[0] : (user?.username ? user.username[0].toUpperCase() : 'U')}
                </div>
                <div style={{ textAlign: 'left', display: 'none' }} className="desktop-user-label">
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.1 }}>{user?.first_name || user?.username}</div>
                  <div style={{ fontSize: '0.68rem', color: '#00C4FF', textTransform: 'capitalize', marginTop: '2px', fontWeight: 600 }}>
                    {role === 'customer' ? 'Customer' : role === 'admin' ? 'Administrator' : 'Support Desk'}
                  </div>
                </div>
                <ChevronDown size={14} color="#94A3B8" />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  width: '260px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                  border: '1px solid var(--border-light)',
                  zIndex: 1100,
                  overflow: 'hidden',
                  animation: 'fadeIn 200ms ease-out'
                }}>
                  <div style={{ padding: '1rem 1.15rem', borderBottom: '1px solid var(--border-light)', backgroundColor: '#F8FAFC' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>
                      {user?.first_name} {user?.last_name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                      {user?.email}
                    </div>
                    <div style={{ marginTop: '6px' }}>
                      <span className={`badge badge-${role}`}>
                        <span className="pulse-dot pulse-dot-green" />
                        {role === 'customer' ? 'Customer Portal' : role === 'admin' ? 'Administrator' : 'Support Specialist'}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: '0.6rem' }}>
                    {role === 'customer' && (
                      <>
                        <Link to="/dashboard" onClick={() => setProfileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', color: '#1E293B', fontSize: '0.85rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 500 }}>
                          <LayoutDashboard size={16} color="#1E60D5" /> Customer Dashboard
                        </Link>
                        <Link to="/dashboard/rentals" onClick={() => setProfileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', color: '#1E293B', fontSize: '0.85rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 500 }}>
                          <Package size={16} color="#1E60D5" /> My Active Rentals
                        </Link>
                        <Link to="/dashboard/payments" onClick={() => setProfileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', color: '#1E293B', fontSize: '0.85rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 500 }}>
                          <CreditCard size={16} color="#1E60D5" /> Billing & Receipts
                        </Link>
                        <Link to="/dashboard/recommendations" onClick={() => setProfileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', color: '#7C3AED', fontSize: '0.85rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
                          <Sparkles size={16} color="#7C3AED" /> AI Smart Recommendations
                        </Link>
                        <Link to="/dashboard/profile" onClick={() => setProfileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', color: '#1E293B', fontSize: '0.85rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 500 }}>
                          <UserIcon size={16} color="#64748B" /> Profile & Addresses
                        </Link>
                      </>
                    )}

                    {role === 'admin' && (
                      <>
                        <Link to="/admin/dashboard" onClick={() => setProfileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', color: '#1E293B', fontSize: '0.85rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 500 }}>
                          <LayoutDashboard size={16} color="#1E60D5" /> Admin Command Center
                        </Link>
                        <Link to="/admin/appliances" onClick={() => setProfileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', color: '#1E293B', fontSize: '0.85rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 500 }}>
                          <Package size={16} color="#1E60D5" /> Inventory & Catalog
                        </Link>
                        <Link to="/admin/analytics" onClick={() => setProfileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', color: '#1E293B', fontSize: '0.85rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 500 }}>
                          <TrendingUp size={16} color="#10B981" /> Revenue Analytics
                        </Link>
                        <Link to="/admin/ai-insights" onClick={() => setProfileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', color: '#7C3AED', fontSize: '0.85rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
                          <Sparkles size={16} color="#7C3AED" /> AI Demand Forecast
                        </Link>
                      </>
                    )}

                    {role === 'support' && (
                      <>
                        <Link to="/support/dashboard" onClick={() => setProfileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', color: '#1E293B', fontSize: '0.85rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 500 }}>
                          <Headphones size={16} color="#0D9488" /> Support Desk Overview
                        </Link>
                        <Link to="/support/tickets" onClick={() => setProfileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', color: '#1E293B', fontSize: '0.85rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 500 }}>
                          <ShieldCheck size={16} color="#0D9488" /> Customer Tickets
                        </Link>
                      </>
                    )}

                    <div style={{ height: '1px', backgroundColor: '#E2E8F0', margin: '0.4rem 0' }} />
                    
                    <button 
                      onClick={handleLogout} 
                      style={{ 
                        width: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.65rem', 
                        padding: '0.6rem 0.75rem', 
                        color: '#EF4444', 
                        fontSize: '0.85rem', 
                        borderRadius: '8px', 
                        border: 'none', 
                        background: 'transparent', 
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontWeight: 600
                      }}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Link 
                to="/login" 
                style={{ 
                  color: '#FFFFFF', 
                  fontSize: '0.88rem', 
                  fontWeight: 600, 
                  padding: '0.5rem 0.95rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  textDecoration: 'none',
                  transition: 'all var(--transition-fast)'
                }}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="btn btn-primary btn-sm"
                style={{ textDecoration: 'none' }}
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: '4px'
            }}
            className="mobile-menu-btn"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--navy-surface)',
          borderBottom: '1px solid var(--navy-border)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          animation: 'fadeIn 200ms ease-out'
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ color: '#FFFFFF', fontWeight: 500 }}>Home</Link>
          <Link to="/appliances" onClick={() => setMobileMenuOpen(false)} style={{ color: '#FFFFFF', fontWeight: 500 }}>Appliances Catalog</Link>
          <Link to="/dashboard/recommendations" onClick={() => setMobileMenuOpen(false)} style={{ color: '#C084FC', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={16} /> AI Smart Advisor
          </Link>
          <a href="/#why-applinex" onClick={() => setMobileMenuOpen(false)} style={{ color: '#94A3B8', fontWeight: 500 }}>Why ApplineX</a>
          
          <div style={{ height: '1px', backgroundColor: 'var(--navy-border)' }} />
          
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Customer Login</Link>
            <span style={{ color: '#64748B' }}>•</span>
            <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)} style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Admin Portal</Link>
            <span style={{ color: '#64748B' }}>•</span>
            <Link to="/support/login" onClick={() => setMobileMenuOpen(false)} style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Support Portal</Link>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .desktop-search-text { display: inline !important; }
          .desktop-user-label { display: block !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;

