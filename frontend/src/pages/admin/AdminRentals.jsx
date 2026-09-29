import React, { useState, useEffect } from 'react';
import { rentalsApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { ShoppingBag, CheckCircle2, XCircle, Play, Eye, RotateCcw, Search, Clock } from 'lucide-react';

const AdminRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRental, setSelectedRental] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const { addToast } = useNotification();

  const fetchRentals = () => {
    setLoading(true);
    rentalsApi.getRentals({ status: statusFilter !== 'all' ? statusFilter : undefined })
      .then((res) => {
        setRentals(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRentals();
  }, [statusFilter]);

  const handleUpdateStatus = async (rentalId, newStatus, desc) => {
    try {
      await rentalsApi.updateStatus(rentalId, {
        status: newStatus,
        description: desc || `Status changed to ${newStatus} by Administrator.`
      });
      addToast(`Rental status updated to ${newStatus}.`, 'success');
      fetchRentals();
      if (selectedRental && selectedRental.id === rentalId) {
        setDetailsModalOpen(false);
      }
    } catch (err) {
      addToast('Failed to update status.', 'error');
    }
  };

  const handleViewDetails = (rental) => {
    setSelectedRental(rental);
    setDetailsModalOpen(true);
  };

  const filteredRentals = rentals.filter((r) =>
    r.rental_id.toLowerCase().includes(search.toLowerCase()) ||
    r.customer_details?.email?.toLowerCase().includes(search.toLowerCase()) ||
    r.appliance_details?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            RENTAL MANAGEMENT
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--navy-primary)', marginTop: '2px' }}>
            Rental Bookings & Operations
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
            Review pending bookings, verify dispatch, and manage active customer agreements.
          </p>
        </div>
      </div>

      {/* Table Card */}
      <div className="app-card" style={{ padding: '1.5rem' }}>
        
        {/* Filters bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by rental ID, customer, appliance..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.2rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>Filter Status:</span>
            <select
              className="form-control"
              style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="payment_completed">Payment Completed</option>
              <option value="active">Active & Delivered</option>
              <option value="return_requested">Return Requested</option>
              <option value="returned">Returned</option>
            </select>
          </div>
        </div>

        {loading ? (
          <SkeletonLoader count={4} height="80px" />
        ) : filteredRentals.length === 0 ? (
          <div style={{ padding: '3.5rem', textAlign: 'center', color: '#94A3B8' }}>
            No rentals found matching criteria.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Rental ID</th>
                  <th>Customer</th>
                  <th>Appliance</th>
                  <th>Dates</th>
                  <th>Duration</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRentals.map((rental) => (
                  <tr key={rental.id}>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--blue-primary)' }}>
                        {rental.rental_id}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        {rental.customer_details?.profile_image ? (
                          <img
                            src={rental.customer_details.profile_image}
                            alt=""
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #E2E8F0', flexShrink: 0 }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          style={{
                            display: rental.customer_details?.profile_image ? 'none' : 'flex',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--blue-subtle)',
                            color: 'var(--blue-primary)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            flexShrink: 0
                          }}
                        >
                          {(rental.customer_details?.first_name?.[0] || 'C').toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--navy-primary)' }}>
                            {rental.customer_details?.first_name} {rental.customer_details?.last_name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                            {rental.customer_details?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        {rental.appliance_details?.image_url ? (
                          <img
                            src={rental.appliance_details.image_url}
                            alt=""
                            style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #E2E8F0', flexShrink: 0 }}
                          />
                        ) : null}
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                            {rental.appliance_details?.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                            {rental.appliance_details?.appliance_code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#475569' }}>
                      {rental.start_date} → {rental.end_date}
                    </td>
                    <td>{rental.duration_months} mo</td>
                    <td>
                      <strong style={{ color: 'var(--navy-primary)' }}>
                        ₹{parseFloat(rental.total_amount).toLocaleString()}
                      </strong>
                    </td>
                    <td>
                      <StatusBadge status={rental.status} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                        <button
                          onClick={() => handleViewDetails(rental)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                        >
                          <Eye size={13} /> View
                        </button>
                        {rental.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(rental.id, 'approved', 'Booking approved by operations.')}
                              className="btn btn-primary btn-sm"
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', backgroundColor: '#10B981' }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(rental.id, 'rejected', 'Booking rejected.')}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: 'var(--error-red)' }}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {rental.status === 'approved' && (
                          <button
                            onClick={() => handleUpdateStatus(rental.id, 'active', 'Appliance dispatched and lease active.')}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                          >
                            Dispatch
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Details & Status Update Modal */}
      {selectedRental && (
        <Modal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          title={`Rental Details: ${selectedRental.rental_id}`}
          subtitle={`Customer: ${selectedRental.customer_details?.email}`}
          maxWidth="640px"
        >
          <div style={{ fontSize: '0.88rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.25rem', backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '10px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase' }}>Appliance</div>
                <div style={{ fontWeight: 700, color: 'var(--navy-primary)' }}>{selectedRental.appliance_details?.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Code: {selectedRental.appliance_details?.appliance_code}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase' }}>Status</div>
                <div style={{ marginTop: '3px' }}><StatusBadge status={selectedRental.status} /></div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase' }}>Delivery Location</div>
                <div>{selectedRental.delivery_address}, {selectedRental.delivery_city}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Phone: {selectedRental.delivery_phone}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase' }}>Financials</div>
                <div style={{ fontWeight: 800, color: 'var(--blue-primary)' }}>Total: ₹{parseFloat(selectedRental.total_amount).toLocaleString()}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Deposit: ₹{selectedRental.security_deposit}</div>
              </div>
            </div>

            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '0.6rem' }}>
              Timeline Audit Events
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {(selectedRental.timeline_events || []).map((e, idx) => (
                <div key={idx} style={{ padding: '0.5rem 0.75rem', backgroundColor: '#FFFFFF', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                    <span>{e.status}</span>
                    <span style={{ color: '#94A3B8', fontSize: '0.72rem' }}>{e.timestamp}</span>
                  </div>
                  <div style={{ color: '#64748B', marginTop: '2px' }}>{e.description}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setDetailsModalOpen(false)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default AdminRentals;
