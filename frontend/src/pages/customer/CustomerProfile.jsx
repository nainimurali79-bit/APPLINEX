import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Building,
  ShieldCheck,
  Check,
  Camera,
  UploadCloud,
  Sparkles,
  Trash2,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';

const PRESET_AVATARS = [
  { id: 'av1', label: 'Priya (Tech)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80' },
  { id: 'av2', label: 'Rahul (Exec)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80' },
  { id: 'av3', label: 'Ananya (Design)', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&auto=format&fit=crop&q=80' },
  { id: 'av4', label: 'Arjun (Engineer)', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80' },
  { id: 'av5', label: 'Neha (Creative)', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&auto=format&fit=crop&q=80' },
  { id: 'av6', label: 'Vikram (Analyst)', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=240&auto=format&fit=crop&q=80' },
  { id: 'av7', label: 'Sneha (Leader)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80' },
  { id: 'av8', label: 'Kabir (Finance)', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=240&auto=format&fit=crop&q=80' },
];

const CustomerProfile = () => {
  const { user, updateProfile, uploadAvatar } = useAuth();
  const { addToast } = useNotification();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    postal_code: user?.postal_code || '',
    profile_image: user?.profile_image || '',
  });

  const [saving, setSaving] = useState(false);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectPreset = (url) => {
    setFormData((prev) => ({ ...prev, profile_image: url }));
    addToast('Preset avatar selected. Click "Save Profile Changes" to apply.', 'info');
  };

  const handleClearPhoto = () => {
    setFormData((prev) => ({ ...prev, profile_image: '' }));
    addToast('Photo removed. Monogram initials will be shown.', 'info');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file (JPG, PNG, WEBP, GIF).', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast('Image size exceeds 5MB limit.', 'error');
      return;
    }

    setUploadingPic(true);
    try {
      const res = await uploadAvatar(file);
      if (res.success) {
        setFormData((prev) => ({ ...prev, profile_image: res.profile_image }));
        addToast('Profile picture uploaded and updated successfully!', 'success');
      } else {
        addToast(res.error || 'Failed to upload photo.', 'error');
      }
    } catch (err) {
      addToast('An error occurred during picture upload.', 'error');
    } finally {
      setUploadingPic(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
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

  const activePhoto = formData.profile_image || user?.profile_image;

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '80vh', padding: '2rem 0 4rem' }}>
      <div className="container-custom" style={{ maxWidth: '840px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {user?.role === 'admin' ? 'ADMIN WORKSPACE' : user?.role === 'support' ? 'SUPPORT DESK' : 'ACCOUNT SETTINGS'}
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--navy-primary)', marginTop: '2px' }}>
            {user?.role === 'admin' ? 'Administrator Profile & Avatar' : user?.role === 'support' ? 'Support Staff Profile & Avatar' : 'Customer Profile & Avatar'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
            {user?.role === 'admin'
              ? 'Manage your system administrator credentials, security, avatar photo, and contact information.'
              : user?.role === 'support'
              ? 'Manage your customer support specialist identity, avatar photo, and contact details.'
              : 'Manage your personal profile picture, identity details, delivery addresses, and contact preferences.'}
          </p>
        </div>

        {/* Profile Card */}
        <div className="app-card" style={{ padding: '2.25rem' }}>
          
          {/* User Avatar Summary Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingBottom: '1.75rem', borderBottom: '1px solid var(--border-light)', marginBottom: '2rem', flexWrap: 'wrap' }}>
            
            {/* Avatar with live preview and upload badge */}
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '88px',
                height: '88px',
                borderRadius: '50%',
                backgroundColor: user?.role === 'admin' ? '#312E81' : user?.role === 'support' ? '#065F46' : 'var(--blue-primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.2rem',
                fontWeight: 800,
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(30, 96, 213, 0.25)',
                border: '3px solid #FFFFFF',
                outline: '2px solid var(--blue-primary)',
              }}>
                {activePhoto ? (
                  <img
                    src={activePhoto}
                    alt={user?.first_name || 'Profile'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  user?.first_name ? user.first_name[0] : (user?.username ? user.username[0].toUpperCase() : 'U')
                )}
              </div>
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Change Photo"
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--navy-primary)',
                  color: '#FFFFFF',
                  border: '2px solid #FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  transition: 'transform 150ms ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Camera size={15} />
              </button>
            </div>

            <div style={{ flex: 1, minWidth: '220px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
                {user?.first_name || (user?.role === 'admin' ? 'Admin' : user?.role === 'support' ? 'Support Specialist' : 'Customer')} {user?.last_name || ''}
              </h2>
              <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                {user?.email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '6px' }}>
                {user?.role === 'admin' ? (
                  <span className="badge" style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', border: '1px solid #C7D2FE', fontWeight: 700 }}>
                    🛡️ System Administrator
                  </span>
                ) : user?.role === 'support' ? (
                  <span className="badge" style={{ backgroundColor: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', fontWeight: 700 }}>
                    🎧 Support Specialist
                  </span>
                ) : (
                  <span className="badge badge-available">
                    👤 Verified Customer Account
                  </span>
                )}
                <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>• Member since 2026</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPic}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}
              >
                <UploadCloud size={15} />
                {uploadingPic ? 'Uploading...' : 'Upload Photo'}
              </button>
              {activePhoto && (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleClearPhoto}
                  style={{ color: '#EF4444', borderColor: '#FCA5A5' }}
                  title="Remove picture"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Preset Avatars Gallery */}
          <div style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '2rem',
            border: '1px solid var(--border-light)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
                <Sparkles size={16} color="var(--blue-primary)" />
                Choose a Preset Profile Avatar
              </div>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--blue-primary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <ExternalLink size={13} />
                {showUrlInput ? 'Hide URL input' : 'Paste custom image URL'}
              </button>
            </div>

            {/* Preset Avatars Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(76px, 1fr))', gap: '0.75rem' }}>
              {PRESET_AVATARS.map((av) => {
                const isSelected = activePhoto === av.url;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => handleSelectPreset(av.url)}
                    style={{
                      background: 'none',
                      border: isSelected ? '3px solid var(--blue-primary)' : '2px solid #E2E8F0',
                      borderRadius: '50%',
                      padding: '2px',
                      cursor: 'pointer',
                      transition: 'transform 150ms ease, border-color 150ms ease',
                      width: '64px',
                      height: '64px',
                      margin: '0 auto',
                      display: 'block',
                      boxShadow: isSelected ? '0 0 12px rgba(30, 96, 213, 0.4)' : 'none',
                      transform: isSelected ? 'scale(1.05)' : 'scale(1)'
                    }}
                    title={av.label}
                  >
                    <img
                      src={av.url}
                      alt={av.label}
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Custom URL Input (expandable) */}
            {showUrlInput && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed #CBD5E1' }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Direct Image URL</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="url"
                    name="profile_image"
                    className="form-control"
                    placeholder="https://example.com/photo.jpg"
                    value={formData.profile_image}
                    onChange={handleChange}
                    style={{ fontSize: '0.85rem' }}
                  />
                  {formData.profile_image && (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => setFormData({ ...formData, profile_image: '' })}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}
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
              <label className="form-label">
                {user?.role === 'customer' ? 'Default Delivery Street Address' : 'Office / Contact Street Address'}
              </label>
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

            {/* Digital KYC Verification Box (Rentomojo Standard) */}
            <div style={{
              margin: '1.5rem 0',
              padding: '1.25rem',
              borderRadius: '12px',
              backgroundColor: '#F0FDF4',
              border: '1px solid #BBF7D0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontWeight: 700, fontSize: '0.95rem' }}>
                  <ShieldCheck size={20} /> Digital e-KYC Verification
                </div>
                <span style={{
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  textTransform: 'uppercase'
                }}>
                  ● {user?.kyc_status?.toUpperCase() || 'VERIFIED'}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#166534', lineHeight: 1.4, margin: '0 0 0.75rem 0' }}>
                Your identity is digitally verified for instant appliance approvals, zero security deposit delays, and express delivery dispatch.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.82rem', color: '#15803D' }}>
                <div>ID Document: <strong>{user?.kyc_document_type || 'Aadhaar Card'}</strong></div>
                <div>Doc Number: <strong>{user?.kyc_document_number || '•••• •••• 8899'}</strong></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button
                type="submit"
                disabled={saving || uploadingPic}
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
