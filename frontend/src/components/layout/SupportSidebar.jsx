import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  HelpCircle, 
  AlertOctagon, 
  Star, 
  LogOut 
} from 'lucide-react';

const SupportSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/support/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/support/dashboard', icon: LayoutDashboard },
    { name: 'Tickets', path: '/support/tickets', icon: HelpCircle },
    { name: 'Complaints', path: '/support/complaints', icon: AlertOctagon },
    { name: 'Review Moderation', path: '/support/reviews', icon: Star },
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--navy-primary)',
      borderRight: '1px solid var(--navy-border)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'calc(100vh - 72px)',
      flexShrink: 0
    }}>
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--navy-border)' }}>
        <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
          SUPPORT PORTAL
        </div>
        <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.92rem', marginTop: '2px' }}>
          Customer Help Desk
        </div>
      </div>

      <nav style={{ padding: '1rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.7rem 0.9rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '0.88rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#FFFFFF' : '#94A3B8',
                backgroundColor: isActive ? 'var(--blue-primary)' : 'transparent',
                borderLeft: isActive ? '3px solid #00C4FF' : '3px solid transparent',
                transition: 'all var(--transition-fast)'
              })}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div style={{ padding: '1rem', borderTop: '1px solid var(--navy-border)' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.65rem 0.9rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#F87171',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 600
          }}
        >
          <LogOut size={16} /> Logout Staff
        </button>
      </div>
    </aside>
  );
};

export default SupportSidebar;
