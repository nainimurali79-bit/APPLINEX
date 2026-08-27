import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getBadgeConfig = () => {
    switch (status?.toLowerCase()) {
      case 'available':
      case 'active':
      case 'approved':
      case 'successful':
      case 'completed':
      case 'excellent':
      case 'good':
        return { label: status, className: 'badge-available', icon: CheckCircle2 };
      case 'rented':
      case 'in_progress':
      case 'refunded':
      case 'payment_completed':
        return { label: status?.replace('_', ' '), className: 'badge-rented', icon: RefreshCw };
      case 'pending':
      case 'scheduled':
      case 'minor_wear':
      case 'return_requested':
        return { label: status?.replace('_', ' '), className: 'badge-pending', icon: Clock };
      case 'maintenance':
      case 'failed':
      case 'rejected':
      case 'cancelled':
      case 'needs_repair':
      case 'damaged':
        return { label: status?.replace('_', ' '), className: 'badge-maintenance', icon: AlertTriangle };
      default:
        return { label: status || 'Unknown', className: 'badge-pending', icon: Clock };
    }
  };

  const { label, className, icon: Icon } = getBadgeConfig();

  return (
    <span className={`badge ${className}`} style={{ textTransform: 'capitalize' }}>
      <Icon size={12} />
      <span>{label}</span>
    </span>
  );
};

export default StatusBadge;
