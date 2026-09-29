import React, { useState, useEffect } from 'react';
import { supportApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { Headphones, Search, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);

  // Response Form State
  const [replyStatus, setReplyStatus] = useState('in_progress');
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useNotification();

  const fetchTickets = () => {
    setLoading(true);
    supportApi.getTickets({ status: statusFilter !== 'all' ? statusFilter : undefined })
      .then((res) => {
        setTickets(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const handleOpenReply = (ticket) => {
    setSelectedTicket(ticket);
    setReplyStatus(ticket.status === 'open' ? 'in_progress' : ticket.status);
    setReplyText(ticket.admin_response || '');
    setResponseModalOpen(true);
  };

  const handleSendResponse = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;

    setSubmitting(true);
    try {
      await supportApi.resolveTicket(selectedTicket.id, {
        status: replyStatus,
        admin_response: replyText,
      });

      setSubmitting(false);
      setResponseModalOpen(false);
      addToast('Ticket response submitted & status updated.', 'success');
      fetchTickets();
    } catch (err) {
      setSubmitting(false);
      const errMsg = err.response?.data?.error || err.response?.data?.detail || 'Failed to update ticket.';
      addToast(errMsg, 'error');
    }
  };

  const filteredTickets = tickets.filter((t) =>
    t.ticket_id.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    t.customer_email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          SUPPORT OPERATIONS
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--navy-primary)', marginTop: '2px' }}>
          Customer Support Tickets
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
          Handle customer questions, schedule on-site maintenance visits, and provide swift resolution.
        </p>
      </div>

      {/* Table Card */}
      <div className="app-card" style={{ padding: '1.5rem' }}>
        
        {/* Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search tickets by ID, subject, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.2rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>Filter:</span>
            <select
              className="form-control"
              style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Tickets</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <SkeletonLoader count={4} height="80px" />
        ) : filteredTickets.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
            No support tickets found.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Customer</th>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td><strong style={{ color: 'var(--blue-primary)' }}>{ticket.ticket_id}</strong></td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{ticket.customer_name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{ticket.customer_email}</div>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--navy-primary)' }}>{ticket.subject}</td>
                    <td><span style={{ textTransform: 'capitalize' }}>{ticket.category}</span></td>
                    <td><StatusBadge status={ticket.priority} /></td>
                    <td><StatusBadge status={ticket.status} /></td>
                    <td style={{ fontSize: '0.8rem', color: '#64748B' }}>{new Date(ticket.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => handleOpenReply(ticket)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                      >
                        <MessageSquare size={13} /> Respond
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Response Modal */}
      {selectedTicket && (
        <Modal
          isOpen={responseModalOpen}
          onClose={() => setResponseModalOpen(false)}
          title={`Ticket Triage: ${selectedTicket.ticket_id}`}
          subtitle={`From: ${selectedTicket.customer_name} (${selectedTicket.customer_email})`}
          maxWidth="600px"
        >
          <div style={{ fontSize: '0.88rem' }}>
            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-light)', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '4px' }}>
                Subject: {selectedTicket.subject}
              </div>
              <div style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {selectedTicket.message}
              </div>
            </div>

            <form onSubmit={handleSendResponse}>
              <div className="form-group">
                <label className="form-label">Update Ticket Status</label>
                <select
                  className="form-control"
                  value={replyStatus}
                  onChange={(e) => setReplyStatus(e.target.value)}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Support Response / Solution</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Provide resolution or instructions for the customer..."
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setResponseModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  <Send size={15} /> {submitting ? 'Updating...' : 'Submit Resolution'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default SupportTickets;
