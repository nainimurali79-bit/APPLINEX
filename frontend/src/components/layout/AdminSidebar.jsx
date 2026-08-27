import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  CreditCard, 
  RotateCcw, 
  Wrench, 
  FileText, 
  BarChart3, 
  Sparkles, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Appliances', path: '/admin/appliances', icon: Package },
    { name: 'Rentals', path: '/admin/rentals', icon: ShoppingBag },
    { name: 'Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Returns', path: '/admin/returns', icon: RotateCcw },
    { name: 'Maintenance', path: '/admin/maintenance', icon: Wrench },
    { name: 'Reports', path: '/admin/reports', icon: FileText },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'AI Insights', path: '/admin/ai-insights', icon: Sparkles, isAi: true },
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
      {/* Header section in sidebar */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--navy-border)' }}>
        <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
          ADMIN PORTAL
        </div>
        <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.92rem', marginTop: '2px' }}>
          Operations & Control
        </div>
      </div>

      {/* Navigation List */}
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
                justifyContent: 'space-between',
                padding: '0.7rem 0.9rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '0.88rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#FFFFFF' : '#94A3B8',
                backgroundColor: isActive 
                  ? (item.isAi ? 'rgba(124, 58, 237, 0.25)' : 'var(--blue-primary)') 
                  : 'transparent',
                borderLeft: isActive 
                  ? (item.isAi ? '3px solid #C084FC' : '3px solid #00C4FF') 
                  : '3px solid transparent',
                transition: 'all var(--transition-fast)'
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={18} color={item.isAi ? '#C084FC' : 'currentColor'} />
                <span>{item.name}</span>
              </div>
              {item.isAi && (
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  backgroundColor: 'rgba(124, 58, 237, 0.35)',
                  color: '#DDD6FE',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                  AI
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer logout */}
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
          <LogOut size={16} /> Logout Admin
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
