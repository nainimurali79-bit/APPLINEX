import React, { useState, useEffect } from 'react';
import { authApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import Modal from '../../components/common/Modal';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { 
  Users, 
  Search, 
  UserCheck, 
  ShieldCheck, 
  Headphones, 
  Mail, 
  Phone, 
  MapPin, 
  Eye, 
  RefreshCw,
  UserPlus,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newUserData, setNewUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    role: 'customer',
    password: '',
    is_active: true
  });

  const { addToast } = useNotification();

  const fetchUsers = () => {
    setLoading(true);
    authApi.getUsers({ role: roleFilter !== 'all' ? roleFilter : undefined })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        addToast('Failed to load users list.', 'error');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserData.email || !newUserData.password) {
      addToast('Email and password are required.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      await authApi.createUser(newUserData);
      addToast('User created successfully!', 'success');
      setCreateUserModalOpen(false);
      setNewUserData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postal_code: '',
        role: 'customer',
        password: '',
        is_active: true
      });
      fetchUsers();
    } catch (err) {
      const errs = err.response?.data?.errors;
      const firstErr = typeof errs === 'object' ? Object.values(errs)[0] : 'Failed to create user.';
      addToast(Array.isArray(firstErr) ? firstErr[0] : firstErr, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    const fullName = `${u.first_name || ''} ${u.last_name || ''}`.toLowerCase();
    const email = (u.email || '').toLowerCase();
    const username = (u.username || '').toLowerCase();
    const phone = (u.phone || '').toLowerCase();
    return fullName.includes(term) || email.includes(term) || username.includes(term) || phone.includes(term);
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return { bg: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', label: 'Admin', icon: ShieldCheck };
      case 'support':
        return { bg: 'rgba(124, 58, 237, 0.15)', color: '#8B5CF6', label: 'Support', icon: Headphones };
      default:
        return { bg: 'rgba(16, 185, 129, 0.15)', color: '#10B981', label: 'Customer', icon: UserCheck };
    }
  };

  const customerCount = users.filter(u => u.role === 'customer').length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const supportCount = users.filter(u => u.role === 'support').length;

  return (
    <div style={{ padding: '2rem' }}>
      
      {/* Page Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy-primary)', letterSpacing: '-0.02em' }}>
            Registered Users & Customers
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Manage and view all registered users, customer accounts, and administrative staff.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={fetchUsers} 
            className="btn btn-secondary" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RefreshCw size={16} /> Refresh
          </button>
          <button 
            onClick={() => setCreateUserModalOpen(true)} 
            className="btn btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <UserPlus size={16} /> Add User
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div className="app-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Accounts</span>
            <Users size={20} color="var(--blue-primary)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-primary)', marginTop: '0.5rem' }}>
            {users.length}
          </div>
        </div>

        <div className="app-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Customers</span>
            <UserCheck size={20} color="#10B981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10B981', marginTop: '0.5rem' }}>
            {customerCount}
          </div>
        </div>

        <div className="app-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Support Staff</span>
            <Headphones size={20} color="#8B5CF6" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#8B5CF6', marginTop: '0.5rem' }}>
            {supportCount}
          </div>
        </div>

        <div className="app-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Administrators</span>
            <ShieldCheck size={20} color="#EF4444" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#EF4444', marginTop: '0.5rem' }}>
            {adminCount}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="app-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search by name, email, username or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['all', 'customer', 'support', 'admin'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`btn btn-sm ${roleFilter === role ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {role === 'all' ? 'All Roles' : role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="app-card" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem' }}>
            <SkeletonLoader count={5} height="48px" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Users size={48} color="#94A3B8" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy-primary)' }}>No Users Found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              {search ? 'Try adjusting your search query.' : 'No registered users match the selected role.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="app-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-secondary)', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>
                  <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy-primary)', textTransform: 'uppercase' }}>User / Email</th>
                  <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy-primary)', textTransform: 'uppercase' }}>Role</th>
                  <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy-primary)', textTransform: 'uppercase' }}>Phone</th>
                  <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy-primary)', textTransform: 'uppercase' }}>Location</th>
                  <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy-primary)', textTransform: 'uppercase' }}>Joined</th>
                  <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy-primary)', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy-primary)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const roleMeta = getRoleBadge(u.role);
                  const RoleIcon = roleMeta.icon;
                  return (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(30, 96, 213, 0.1)',
                            color: 'var(--blue-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            flexShrink: 0
                          }}>
                            {u.first_name ? u.first_name[0].toUpperCase() : u.username[0].toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--navy-primary)' }}>
                              {u.first_name || u.last_name ? `${u.first_name || ''} ${u.last_name || ''}`.trim() : u.username}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.3rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: roleMeta.bg,
                          color: roleMeta.color
                        }}>
                          <RoleIcon size={13} /> {roleMeta.label}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                        {u.phone || '—'}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                        {u.city || u.address ? `${u.city || ''} ${u.postal_code ? `(${u.postal_code})` : ''}`.trim() : '—'}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: u.is_active ? '#10B981' : '#EF4444'
                        }}>
                          {u.is_active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                          {u.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setDetailsModalOpen(true);
                          }}
                          className="btn btn-sm btn-secondary"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                        >
                          <Eye size={14} /> Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <Modal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          title="User Account Details"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: 'rgba(30, 96, 213, 0.1)',
                color: 'var(--blue-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.3rem'
              }}>
                {selectedUser.first_name ? selectedUser.first_name[0].toUpperCase() : selectedUser.username[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
                  {selectedUser.first_name || selectedUser.last_name ? `${selectedUser.first_name || ''} ${selectedUser.last_name || ''}`.trim() : selectedUser.username}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Username: @{selectedUser.username} (ID: #{selectedUser.id})
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Email Address</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--navy-primary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={14} color="var(--blue-primary)" /> {selectedUser.email}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Phone Number</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--navy-primary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Phone size={14} color="var(--blue-primary)" /> {selectedUser.phone || 'Not provided'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Role</span>
                <div style={{ marginTop: '2px' }}>
                  {getRoleBadge(selectedUser.role).label}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Account Status</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: selectedUser.is_active ? '#10B981' : '#EF4444', marginTop: '2px' }}>
                  {selectedUser.is_active ? 'Active' : 'Disabled'}
                </div>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Address</span>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '2px', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                <MapPin size={15} color="var(--blue-primary)" style={{ marginTop: '3px', flexShrink: 0 }} />
                <span>{selectedUser.address ? `${selectedUser.address}, ${selectedUser.city || ''} - ${selectedUser.postal_code || ''}` : 'No address on file'}</span>
              </div>
            </div>

            <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setDetailsModalOpen(false)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create User Modal */}
      <Modal
        isOpen={createUserModalOpen}
        onClose={() => setCreateUserModalOpen(false)}
        title="Add New User / Customer"
      >
        <form onSubmit={handleCreateUser}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                value={newUserData.first_name}
                onChange={(e) => setNewUserData({ ...newUserData, first_name: e.target.value })}
                placeholder="e.g. John"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                value={newUserData.last_name}
                onChange={(e) => setNewUserData({ ...newUserData, last_name: e.target.value })}
                placeholder="e.g. Doe"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                required
                className="form-control"
                value={newUserData.email}
                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                value={newUserData.phone}
                onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="form-control"
                value={newUserData.role}
                onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
              >
                <option value="customer">Customer</option>
                <option value="support">Support Staff</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Password * (min 6 chars)</label>
              <input
                type="password"
                required
                minLength={6}
                className="form-control"
                value={newUserData.password}
                onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              value={newUserData.address}
              onChange={(e) => setNewUserData({ ...newUserData, address: e.target.value })}
              placeholder="Door No, Street Name, Area"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={() => setCreateUserModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default AdminUsers;
