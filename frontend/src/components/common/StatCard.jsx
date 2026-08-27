import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'blue', subtext, trend, isAi = false }) => {
  const getColorStyles = () => {
    switch (color) {
      case 'green':
        return { bg: 'rgba(16, 185, 129, 0.1)', iconColor: '#10B981', border: '#A7F3D0' };
      case 'purple':
        return { bg: 'rgba(124, 58, 237, 0.1)', iconColor: '#7C3AED', border: '#DDD6FE' };
      case 'amber':
      case 'orange':
        return { bg: 'rgba(245, 158, 11, 0.1)', iconColor: '#F59E0B', border: '#FDE68A' };
      case 'red':
        return { bg: 'rgba(239, 68, 68, 0.1)', iconColor: '#EF4444', border: '#FECACA' };
      case 'cyan':
        return { bg: 'rgba(0, 196, 255, 0.1)', iconColor: '#00C4FF', border: '#B3EDFF' };
      case 'blue':
      default:
        return { bg: 'rgba(30, 96, 213, 0.1)', iconColor: '#1E60D5', border: '#C7DCFF' };
    }
  };

  const styles = getColorStyles();

  return (
    <div className={`app-card ${isAi ? 'app-card-ai' : ''}`} style={{
      padding: '1.35rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div>
        <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
          {title}
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy-primary)', lineHeight: 1.1 }}>
          {value}
        </div>
        {subtext && (
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.35rem' }}>
            {subtext}
          </div>
        )}
        {trend && (
          <div style={{ fontSize: '0.75rem', color: trend.startsWith('+') ? '#10B981' : '#EF4444', fontWeight: 600, marginTop: '0.35rem' }}>
            {trend} from last month
          </div>
        )}
      </div>

      {Icon && (
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: styles.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: styles.iconColor,
          flexShrink: 0
        }}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
