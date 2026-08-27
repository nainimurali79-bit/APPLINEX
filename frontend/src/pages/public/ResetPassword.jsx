import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { Lock, Mail, ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.resetPassword({
        email,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setIsSubmitting(false);
      addToast('Password reset successfully! You can now login.', 'success');
      navigate('/login');
    } catch (err) {
      setIsSubmitting(false);
      addToast(err.response?.data?.error || 'Failed to reset password.', 'error');
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      backgroundColor: 'var(--bg-main)'
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #1E60D5 0%, #00C4FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L3 19H8.5L12 11.5L15.5 19H21L12 3Z" fill="white" />
                <circle cx="12" cy="11.5" r="2" fill="#00C4FF" />
              </svg>
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-primary)', letterSpacing: '0.04em' }}>
              APPLINEX
            </span>
          </Link>
        </div>

        <div className="app-card" style={{ padding: '2.25rem' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
              Set New Password
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '4px' }}>
              Choose a secure password for your account
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Registered Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={17} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter Email id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '2.4rem' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={17} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ paddingLeft: '2.4rem' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-block btn-lg"
              style={{ marginTop: '0.5rem', marginBottom: '1.25rem' }}
            >
              {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.85rem' }}>
              <Link to="/login" style={{ fontWeight: 600, color: 'var(--blue-primary)' }}>
                Back to Login
              </Link>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
