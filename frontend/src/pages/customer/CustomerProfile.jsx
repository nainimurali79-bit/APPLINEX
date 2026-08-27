import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { User, Mail, Phone, MapPin, Building, ShieldCheck, Check } from 'lucide-react';

const CustomerProfile = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useNotification();

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    postal_code: user?.postal_code || '',
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateProfile(formData);
    setSaving(false);

    if (res.success) {
      addToast('Profile updated successfully.', 'success');
    } else {
      addToast('Failed to update profile.', 'error');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '80vh', padding: '2rem 0 4rem' }}>
      <div className="container-custom" style={{ maxWidth: '800px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            ACCOUNT SETTINGS
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--navy-primary)', marginTop: '2px' }}>
            Customer Profile
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
            Manage your personal identity, delivery addresses, and contact preferences.
          </p>
        </div>

        {/* Profile Card */}
        <div className="app-card" style={{ padding: '2.25rem' }}>
          
          {/* User Avatar Summary Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', marginBottom: '1.75rem' }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: 'var(--blue-primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: 800
            }}>
              {user?.first_name ? user.first_name[0] : (user?.username ? user.username[0].toUpperCase() : 'U')}
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
                {user?.first_name} {user?.last_name}
              </h2>
              <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                {user?.email}
              </div>
              <div style={{ marginTop: '4px' }}>
                <span className="badge badge-available">Verified Customer Account</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  className="form-control"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  className="form-control"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Email Address (Read-only)</label>
                <input
                  type="email"
                  className="form-control"
                  value={user?.email || ''}
                  readOnly
                  style={{ backgroundColor: '#F1F5F9' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Default Delivery Street Address</label>
              <textarea
                name="address"
                rows="3"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
                placeholder="Flat No, Building, Street Address, Landmark"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  className="form-control"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Bangalore"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Postal / PIN Code</label>
                <input
                  type="text"
                  name="postal_code"
                  className="form-control"
                  value={formData.postal_code}
                  onChange={handleChange}
                  placeholder="560038"
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary btn-lg"
              >
                <Check size={18} /> {saving ? 'Saving Profile...' : 'Save Profile Changes'}
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};

export default CustomerProfile;
