import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const { addToast } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      addToast('Please enter your registered email address.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.forgotPassword(email);
      setIsSubmitting(false);
      setSent(true);
      addToast(`Password reset link sent to ${email}.`, 'success');
    } catch (err) {
      setIsSubmitting(false);
      addToast('Failed to dispatch reset link.', 'error');
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
        
        {/* Brand */}
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
              Forgot Password?
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '4px' }}>
              Enter your email and we'll send you a password reset link.
            </p>
          </div>

          {sent ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <CheckCircle2 size={28} />
              </div>
              <h4 style={{ color: 'var(--navy-primary)', fontWeight: 700, marginBottom: '0.5rem' }}>Reset Link Dispatched</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.5rem' }}>
                Check your inbox for instructions to reset your account password.
              </p>
              <Link to="/reset-password" className="btn btn-primary btn-block">
                Proceed to Reset Form
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email</label>
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-block btn-lg"
                style={{ marginTop: '0.5rem', marginBottom: '1.25rem' }}
              >
                {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.85rem' }}>
                <Link to="/login" style={{ fontWeight: 600, color: 'var(--blue-primary)' }}>
                  Back to Login
                </Link>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
