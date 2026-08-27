import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const ToastContainer = () => {
  const { toasts, removeToast } = useNotification();

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      maxWidth: '380px',
      width: 'calc(100% - 3rem)'
    }}>
      {toasts.map((toast) => {
        let bg = 'var(--navy-primary)';
        let border = 'var(--navy-border)';
        let Icon = Info;
        let iconColor = '#00C4FF';

        if (toast.type === 'success') {
          bg = '#064E3B';
          border = '#059669';
          Icon = CheckCircle2;
          iconColor = '#10B981';
        } else if (toast.type === 'error') {
          bg = '#7F1D1D';
          border = '#DC2626';
          Icon = AlertTriangle;
          iconColor = '#F87171';
        }

        return (
          <div
            key={toast.id}
            style={{
              backgroundColor: bg,
              color: '#FFFFFF',
              border: `1px solid ${border}`,
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              animation: 'fadeIn 200ms ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Icon size={18} color={iconColor} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.3 }}>
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px'
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
