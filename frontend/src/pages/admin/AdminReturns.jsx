import React, { useState, useEffect } from 'react';
import { maintenanceApi, rentalsApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { RotateCcw, CheckCircle2, AlertTriangle, Search, Check } from 'lucide-react';

const AdminReturns = () => {
  const [returns, setReturns] = useState([]);
  const [returnRequestedRentals, setReturnRequestedRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRental, setSelectedRental] = useState(null);
  const [processModalOpen, setProcessModalOpen] = useState(false);

  // Return Processing Form
  const [condition, setCondition] = useState('good');
  const [deductions, setDeductions] = useState('0');
  const [inspectionNotes, setInspectionNotes] = useState('Appliance thoroughly checked. All functions operational.');
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useNotification();

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      maintenanceApi.getReturns(),
      rentalsApi.getRentals({ tab: 'returned' })
    ])
      .then(([retRes, rentalsRes]) => {
        setReturns(retRes.data);
        setReturnRequestedRentals(rentalsRes.data.filter((r) => r.status === 'return_requested'));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenProcess = (rental) => {
    setSelectedRental(rental);
    setCondition('good');
    setDeductions('0');
    setInspectionNotes('Appliance returned in good condition. Security deposit cleared for refund.');
    setProcessModalOpen(true);
  };

  const handleProcessSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRental) return;

    setSubmitting(true);
    try {
      await maintenanceApi.processReturn(selectedRental.id, {
        condition,
        deductions: parseFloat(deductions || 0),
        inspection_notes: inspectionNotes,
      });

      setSubmitting(false);
      setProcessModalOpen(false);
      addToast('Return inspection completed & security deposit settled.', 'success');
      fetchData();
    } catch (err) {
      setSubmitting(false);
      addToast('Failed to process return.', 'error');
    }
  };

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          RETURNS & RECOVERY
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--navy-primary)', marginTop: '2px' }}>
          Returns & Inspection Desk
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
          Assess returned appliance condition, process security deposit refunds, and schedule maintenance if needed.
        </p>
      </div>

      {/* Pending Return Requests (if any) */}
      {returnRequestedRentals.length > 0 && (
        <div className="app-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--warning-amber)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '1rem' }}>
            Action Required: Active Customer Return Requests ({returnRequestedRentals.length})
          </h3>
          <div className="table-responsive">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Rental ID</th>
                  <th>Customer</th>
                  <th>Appliance</th>
                  <th>Deposit Held</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {returnRequestedRentals.map((r) => (
                  <tr key={r.id}>
                    <td><strong style={{ color: 'var(--blue-primary)' }}>{r.rental_id}</strong></td>
                    <td>{r.customer_details?.first_name} {r.customer_details?.last_name} ({r.customer_details?.email})</td>
                    <td>{r.appliance_details?.name}</td>
                    <td>₹{parseInt(r.security_deposit).toLocaleString()}</td>
                    <td>
                      <button
                        onClick={() => handleOpenProcess(r)}
                        className="btn btn-primary btn-sm"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                      >
                        Process Return Inspection
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Processed Returns Ledger */}
      <div className="app-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '1.25rem' }}>
          Processed Returns History
        </h3>

        {loading ? (
          <SkeletonLoader count={3} height="80px" />
        ) : returns.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
            No returns processed yet.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Rental ID</th>
                  <th>Customer</th>
                  <th>Appliance</th>
                  <th>Return Date</th>
                  <th>Condition</th>
                  <th>Deductions</th>
                  <th>Refunded Deposit</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {returns.map((ret) => (
                  <tr key={ret.id}>
                    <td><strong style={{ color: 'var(--blue-primary)' }}>{ret.rental_details?.rental_id}</strong></td>
                    <td>{ret.rental_details?.customer_details?.email}</td>
                    <td>{ret.rental_details?.appliance_details?.name}</td>
                    <td>{ret.return_date}</td>
                    <td><StatusBadge status={ret.condition} /></td>
                    <td>₹{parseFloat(ret.deductions).toLocaleString()}</td>
                    <td><strong style={{ color: '#059669' }}>₹{parseFloat(ret.refund_amount).toLocaleString()}</strong></td>
                    <td><StatusBadge status={ret.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Process Return Modal */}
      {selectedRental && (
        <Modal
          isOpen={processModalOpen}
          onClose={() => setProcessModalOpen(false)}
          title={`Process Return: ${selectedRental.rental_id}`}
          subtitle={`Appliance: ${selectedRental.appliance_details?.name}`}
          maxWidth="560px"
        >
          <form onSubmit={handleProcessSubmit}>
            <div className="form-group">
              <label className="form-label">Inspected Appliance Condition</label>
              <select
                className="form-control"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <option value="excellent">Excellent - No Wear</option>
                <option value="good">Good / Normal Operation</option>
                <option value="minor_wear">Minor Cosmetic Wear</option>
                <option value="needs_repair">Needs Repair (Move to Maintenance)</option>
                <option value="damaged">Damaged (Deduct from Security Deposit)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Deduction Amount from Security Deposit (₹)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={deductions}
                onChange={(e) => setDeductions(e.target.value)}
                placeholder="0.00"
              />
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
                Total deposit held: ₹{selectedRental.security_deposit} • Refund: ₹{Math.max(0, parseFloat(selectedRental.security_deposit) - parseFloat(deductions || 0)).toFixed(2)}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Inspection & Technician Notes</label>
              <textarea
                className="form-control"
                rows="3"
                value={inspectionNotes}
                onChange={(e) => setInspectionNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button type="button" onClick={() => setProcessModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn btn-primary">
                <Check size={16} /> {submitting ? 'Processing...' : 'Complete Return & Settle'}
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};

export default AdminReturns;
