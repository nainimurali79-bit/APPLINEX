import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { User, Mail, Phone, MapPin, Lock, ArrowLeft } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirm_password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      addToast('Passwords do not match.', 'error');
      return;
    }

    setIsSubmitting(true);
    const result = await register(formData);
    setIsSubmitting(false);

    if (result.success) {
      addToast('Account created successfully! Welcome to APPLINEX.', 'success');
      navigate('/dashboard');
    } else {
      const errs = result.errors;
      const firstErr = typeof errs === 'object' ? Object.values(errs)[0] : 'Registration failed.';
      addToast(Array.isArray(firstErr) ? firstErr[0] : firstErr, 'error');
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
      <div style={{ width: '100%', maxWidth: '520px' }}>
        
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

        {/* Register Card */}
        <div className="app-card" style={{ padding: '2.25rem' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
              Create Your Account
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '4px' }}>
              Join APPLINEX for smart household appliance rentals
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    name="first_name"
                    className="form-control"
                    placeholder="Enter First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    style={{ paddingLeft: '2.2rem' }}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  className="form-control"
                  placeholder="Enter Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter Email id"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.2rem' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="Enter Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.2rem' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Delivery Address</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  placeholder="Enter Delivery Address"
                  value={formData.address}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.2rem' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                    style={{ paddingLeft: '2.2rem' }}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  name="confirm_password"
                  className="form-control"
                  placeholder="Confirm Password"
                  value={formData.confirm_password}
                  onChange={handleChange}
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
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>

          </form>

          <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748B' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 700, color: 'var(--blue-primary)' }}>
              Login
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

export default Register;
