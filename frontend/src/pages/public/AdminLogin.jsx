import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      if (result.user.role !== 'admin') {
        addToast('Access denied. Administrator privileges required.', 'error');
        return;
      }
      addToast('Admin authentication successful.', 'success');
      navigate('/admin/dashboard');
    } else {
      addToast(result.error || 'Invalid administrator credentials.', 'error');
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
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'var(--navy-primary)',
            color: '#00C4FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem',
            border: '1px solid var(--navy-border)'
          }}>
            <ShieldCheck size={28} />
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-primary)', letterSpacing: '0.04em' }}>
            APPLINEX ADMIN
          </h1>
          <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Secure Administrator Gateway
          </div>
        </div>

        {/* Card */}
        <div className="app-card" style={{ padding: '2.25rem', borderTop: '4px solid var(--blue-primary)' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Admin Email</label>
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
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={17} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-block btn-lg"
              style={{ marginTop: '1rem', marginBottom: '1.25rem' }}
            >
              {isSubmitting ? 'Authenticating...' : 'Admin Login'}
            </button>
          </form>

          <div style={{ textAlign: 'center', fontSize: '0.82rem', color: '#64748B' }}>
            Customer looking to rent?{' '}
            <Link to="/login" style={{ fontWeight: 600, color: 'var(--blue-primary)' }}>
              Customer Login
            </Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#64748B' }}>
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
