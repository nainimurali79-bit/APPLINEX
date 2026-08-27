import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Lock, Mail, Eye, EyeOff, ArrowLeft, ShieldCheck, Headphones, User as UserIcon } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter your email and password.', 'error');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      addToast(`Welcome back, ${result.user.first_name || result.user.username}!`, 'success');
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (result.user.role === 'support') {
        navigate('/support/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      addToast(result.error || 'Invalid email or password.', 'error');
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
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1E60D5 0%, #00C4FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L3 19H8.5L12 11.5L15.5 19H21L12 3Z" fill="white" />
                <circle cx="12" cy="11.5" r="2" fill="#00C4FF" />
              </svg>
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-primary)', letterSpacing: '0.04em' }}>
              APPLINEX
            </span>
          </Link>
          <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>
            Smart Living, Simplified.
          </div>
        </div>

        {/* Login Card matching reference image */}
        <div className="app-card" style={{ padding: '2.25rem' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
              Welcome Back!
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '4px' }}>
              Login to your account
            </p>
          </div>

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

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: 'var(--blue-primary)', fontWeight: 600 }}>
                  Forgot Password?
                </Link>
              </div>
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
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0
                  }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#475569' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember Me
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-block btn-lg"
              style={{ marginBottom: '1.25rem' }}
            >
              {isSubmitting ? 'Authenticating...' : 'Login'}
            </button>

          </form>

          {/* Role Portal Switcher / Quick Navigation helper pills */}
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem', marginTop: '1rem' }}>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', textAlign: 'center', marginBottom: '0.65rem', fontWeight: 600 }}>
              Access Other Portals
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              <Link
                to="/admin/login"
                className="btn btn-secondary btn-sm"
                style={{ textDecoration: 'none', fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}
              >
                <ShieldCheck size={14} color="var(--blue-primary)" /> Admin Portal
              </Link>
              <Link
                to="/support/login"
                className="btn btn-secondary btn-sm"
                style={{ textDecoration: 'none', fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}
              >
                <Headphones size={14} color="var(--blue-primary)" /> Support Portal
              </Link>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748B' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ fontWeight: 700, color: 'var(--blue-primary)' }}>
              Create Account
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

export default Login;
