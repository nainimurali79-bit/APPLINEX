import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { 
  Users, 
  ShieldAlert, 
  Headphones, 
  UserCheck, 
  ChevronUp, 
  ChevronDown, 
  Zap,
  Sparkles,
  Check
} from 'lucide-react';

const DemoRoleSwitcher = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const { addToast } = useNotification();
  const [expanded, setExpanded] = useState(false);
  const [loadingRole, setLoadingRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const demoAccounts = [
    {
      role: 'customer',
      label: 'Customer Demo',
      email: 'customer@applinex.com',
      password: 'Customer@123',
      name: 'John Doe',
      target: '/dashboard',
      color: '#1E60D5',
      icon: UserCheck,
      badge: 'Active User'
    },
    {
      role: 'admin',
      label: 'Admin Workspace',
      email: 'admin@applinex.com',
      password: 'Admin@123',
      name: 'System Admin',
      target: '/admin/dashboard',
      color: '#7C3AED',
      icon: ShieldAlert,
      badge: 'Superuser'
    },
    {
      role: 'support',
      label: 'Support Desk',
      email: 'support@applinex.com',
      password: 'Support@123',
      name: 'Support Agent',
      target: '/support/dashboard',
      color: '#0D9488',
      icon: Headphones,
      badge: 'Helpdesk'
    }
  ];

  const handleSwitch = async (account) => {
    setLoadingRole(account.role);
    try {
      logout();
      await login({ email: account.email, password: account.password });
      addToast(`Switched to ${account.label} session!`, 'success');
      navigate(account.target);
    } catch (err) {
      addToast(`Demo login failed. Please ensure backend is running.`, 'error');
    } finally {
      setLoadingRole(null);
      setExpanded(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9990,
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Expanded Modal Dock */}
      {expanded && (
        <div style={{
          marginBottom: '0.75rem',
          width: '300px',
          backgroundColor: 'rgba(11, 25, 44, 0.95)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 196, 255, 0.15)',
          padding: '1rem',
          animation: 'fadeIn 200ms ease-out forwards',
          color: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={16} color="#00C4FF" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                Instant Role Switcher
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'rgba(0, 196, 255, 0.2)', color: '#00C4FF', fontWeight: 600 }}>
              Demo
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {demoAccounts.map((acc) => {
              const IconComponent = acc.icon;
              const isCurrent = user?.email === acc.email;
              const isLoading = loadingRole === acc.role;

              return (
                <button
                  key={acc.role}
                  onClick={() => handleSwitch(acc)}
                  disabled={isLoading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: isCurrent ? `1px solid ${acc.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                    background: isCurrent ? 'rgba(30, 96, 213, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.borderColor = acc.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isCurrent ? 'rgba(30, 96, 213, 0.25)' : 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.borderColor = isCurrent ? acc.color : 'rgba(255, 255, 255, 0.08)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: acc.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IconComponent size={16} color="#FFFFFF" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>
                        {acc.label}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                        {acc.name}
                      </div>
                    </div>
                  </div>

                  <div>
                    {isCurrent ? (
                      <span style={{ 
                        fontSize: '0.7rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.2rem',
                        color: '#10B981', 
                        fontWeight: 600 
                      }}>
                        <Check size={13} /> Active
                      </span>
                    ) : (
                      <span style={{
                        fontSize: '0.7rem',
                        color: '#94A3B8',
                        padding: '0.2rem 0.4rem',
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.08)'
                      }}>
                        Switch
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.7rem', color: '#94A3B8', textAlign: 'center' }}>
            Tip: Press <kbd style={{ padding: '0.1rem 0.3rem', background: 'rgba(255, 255, 255, 0.15)', borderRadius: '3px' }}>Ctrl + K</kbd> anytime for Command Center
          </div>
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.65rem 1rem',
          borderRadius: '9999px',
          background: 'linear-gradient(135deg, #0B192C 0%, #1E3A63 100%)',
          color: '#FFFFFF',
          border: '1px solid rgba(0, 196, 255, 0.3)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 196, 255, 0.25)',
          cursor: 'pointer',
          transition: 'all 200ms ease',
          fontSize: '0.85rem',
          fontWeight: 600
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
          e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 196, 255, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 196, 255, 0.25)';
        }}
      >
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#00C4FF',
          boxShadow: '0 0 8px #00C4FF'
        }} />
        <span>Demo: {user ? (user.role ? user.role.toUpperCase() : 'USER') : 'GUEST'}</span>
        {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>
    </div>
  );
};

export default DemoRoleSwitcher;
