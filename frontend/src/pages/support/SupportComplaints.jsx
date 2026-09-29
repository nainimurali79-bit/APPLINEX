import React, { useState, useEffect } from 'react';
import { supportApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { AlertTriangle, Search, CheckCircle2, ShieldAlert } from 'lucide-react';

const SupportComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [status, setStatus] = useState('investigating');
  const [actionNotes, setActionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useNotification();

  const fetchComplaints = () => {
    setLoading(true);
    supportApi.getComplaints()
      .then((res) => {
        setComplaints(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleOpenAction = (c) => {
    setSelectedComplaint(c);
    setStatus(c.status === 'logged' ? 'investigating' : c.status);
    setActionNotes(c.action_taken || '');
    setModalOpen(true);
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setSubmitting(true);
    try {
      await supportApi.resolveComplaint(selectedComplaint.id, {
        status,
        action_taken: actionNotes,
      });
      setSubmitting(false);
      setModalOpen(false);
      addToast('Complaint resolution updated.', 'success');
      fetchComplaints();
    } catch (err) {
      setSubmitting(false);
      const errMsg = err.response?.data?.error || err.response?.data?.detail || 'Failed to update complaint.';
      addToast(errMsg, 'error');
    }
  };

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          SERVICE ESCALATIONS
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--navy-primary)', marginTop: '2px' }}>
          Customer Complaints Desk
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
          Investigate delivery discrepancies, technician delays, or equipment faults reported by customers.
        </p>
      </div>

      {/* Table Card */}
      <div className="app-card" style={{ padding: '1.5rem' }}>
        {loading ? (
          <SkeletonLoader count={4} height="80px" />
        ) : complaints.length === 0 ? (
          <div style={{ padding: '3.5rem', textAlign: 'center', color: '#94A3B8' }}>
            No complaints logged in the system.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Customer</th>
                  <th>Appliance / Rental</th>
                  <th>Subject</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Date Logged</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c.id}>
                    <td><strong style={{ color: 'var(--navy-primary)' }}>{c.complaint_id}</strong></td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{c.customer_name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{c.customer_email}</div>
                    </td>
                    <td>{c.appliance_name || 'Fleet Service'}</td>
                    <td style={{ fontWeight: 600, color: 'var(--navy-primary)' }}>{c.subject}</td>
                    <td><StatusBadge status={c.severity} /></td>
                    <td><StatusBadge status={c.status} /></td>
                    <td style={{ fontSize: '0.8rem', color: '#64748B' }}>{new Date(c.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => handleOpenAction(c)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                      >
                        Action
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedComplaint && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`Escalation Action: ${selectedComplaint.complaint_id}`}
          subtitle={`Subject: ${selectedComplaint.subject}`}
          maxWidth="600px"
        >
          <div style={{ fontSize: '0.88rem' }}>
            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-light)', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '4px' }}>
                Customer Statement:
              </div>
              <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                {selectedComplaint.description}
              </p>
            </div>

            <form onSubmit={handleResolveSubmit}>
              <div className="form-group">
                <label className="form-label">Escalation Status</label>
                <select
                  className="form-control"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="logged">Logged</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Action Taken / Resolution Summary</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="e.g. Technician dispatched for inspection and refund issued..."
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Saving...' : 'Update Escalation'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default SupportComplaints;
