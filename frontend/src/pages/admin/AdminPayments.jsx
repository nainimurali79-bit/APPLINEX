import React, { useState, useEffect } from 'react';
import { paymentsApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import StatusBadge from '../../components/common/StatusBadge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { CreditCard, Search, RotateCcw, CheckCircle2 } from 'lucide-react';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { addToast } = useNotification();

  const fetchPayments = () => {
    setLoading(true);
    paymentsApi.getPayments()
      .then((res) => {
        setPayments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleRefund = async (paymentId) => {
    if (!window.confirm('Process refund for this transaction?')) return;
    try {
      await paymentsApi.refundPayment(paymentId);
      addToast('Payment refunded successfully.', 'success');
      fetchPayments();
    } catch (err) {
      addToast('Failed to refund payment.', 'error');
    }
  };

  const filteredPayments = payments.filter((p) =>
    p.payment_id.toLowerCase().includes(search.toLowerCase()) ||
    p.transaction_reference.toLowerCase().includes(search.toLowerCase()) ||
    p.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
    p.rental_code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          FINANCIAL LEDGER
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--navy-primary)', marginTop: '2px' }}>
          Payments & Transactions
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
          Audit real transactions, gateway settlements, and issue refunds.
        </p>
      </div>

      {/* Table Card */}
      <div className="app-card" style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1.5rem', maxWidth: '360px', position: 'relative' }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search payment ID, transaction ref, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.2rem' }}
          />
        </div>

        {loading ? (
          <SkeletonLoader count={4} height="80px" />
        ) : filteredPayments.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
            No payment records found.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Rental Code</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Transaction Reference</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((p) => (
                  <tr key={p.id}>
                    <td><span style={{ fontWeight: 700, color: 'var(--navy-primary)' }}>{p.payment_id}</span></td>
                    <td><span style={{ color: 'var(--blue-primary)', fontWeight: 600 }}>{p.rental_code}</span></td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.customer_name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{p.customer_email}</div>
                    </td>
                    <td><strong style={{ color: 'var(--navy-primary)' }}>₹{parseFloat(p.amount).toLocaleString()}</strong></td>
                    <td><span style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600 }}>{p.payment_method}</span></td>
                    <td><StatusBadge status={p.status} /></td>
                    <td style={{ fontSize: '0.8rem', color: '#64748B' }}>{new Date(p.payment_date).toLocaleString()}</td>
                    <td style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#64748B' }}>{p.transaction_reference}</td>
                    <td>
                      {p.status === 'successful' && (
                        <button
                          onClick={() => handleRefund(p.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', color: 'var(--error-red)' }}
                        >
                          <RotateCcw size={12} /> Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPayments;
