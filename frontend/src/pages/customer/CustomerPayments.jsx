import React, { useState, useEffect } from 'react';
import { paymentsApi } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { CreditCard, Download, FileText, CheckCircle2, Printer } from 'lucide-react';

const CustomerPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [loadingReceipt, setLoadingReceipt] = useState(false);

  useEffect(() => {
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
  }, []);

  const handleViewReceipt = async (paymentId) => {
    setLoadingReceipt(true);
    setReceiptModalOpen(true);
    try {
      const res = await paymentsApi.getReceipt(paymentId);
      setSelectedReceipt(res.data);
      setLoadingReceipt(false);
    } catch (err) {
      console.error(err);
      setLoadingReceipt(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '80vh', padding: '2rem 0 4rem' }}>
      <div className="container-custom">
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            CUSTOMER PORTAL
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--navy-primary)', marginTop: '2px' }}>
            Payment History & Invoices
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
            Access your complete transaction ledger, official GST receipts, and payment statements.
          </p>
        </div>

        {/* Payments Table Card */}
        <div className="app-card" style={{ padding: '1.5rem' }}>
          {loading ? (
            <SkeletonLoader count={4} height="80px" />
          ) : payments.length === 0 ? (
            <div style={{ padding: '3.5rem', textAlign: 'center', color: '#94A3B8' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#F1F5F9', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <CreditCard size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '0.25rem' }}>
                No Payments Recorded
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                When you rent appliances, your transaction receipts and references will appear here.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Payment ID</th>
                    <th>Rental ID</th>
                    <th>Appliance</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Date & Time</th>
                    <th>Reference</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--navy-primary)' }}>
                          {payment.payment_id}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: 'var(--blue-primary)', fontWeight: 600 }}>
                          {payment.rental_code}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {payment.appliance_name}
                      </td>
                      <td>
                        <span style={{ fontWeight: 800, color: 'var(--navy-primary)' }}>
                          ₹{parseFloat(payment.amount).toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>
                          {payment.payment_method}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={payment.status} />
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#64748B' }}>
                        {new Date(payment.payment_date).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#64748B' }}>
                        {payment.transaction_reference}
                      </td>
                      <td>
                        <button
                          onClick={() => handleViewReceipt(payment.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem' }}
                        >
                          <FileText size={13} /> Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Official Tax Invoice & Receipt Modal */}
      <Modal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        title="Official Payment Receipt"
        subtitle="APPLINEX Technologies Inc. Tax Invoice"
        maxWidth="600px"
      >
        {loadingReceipt || !selectedReceipt ? (
          <SkeletonLoader count={3} height="100px" />
        ) : (
          <div style={{ fontSize: '0.88rem' }}>
            
            {/* Receipt Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--border-medium)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--navy-primary)' }}>
                  APPLINEX
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Smart Living, Simplified.</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>GSTIN: {selectedReceipt.organization.gstin}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: 'var(--blue-primary)' }}>{selectedReceipt.receipt_number}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{selectedReceipt.date}</div>
                <div style={{ marginTop: '4px' }}><StatusBadge status={selectedReceipt.status} /></div>
              </div>
            </div>

            {/* Bill To & Appliance info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.25rem', backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Billed To</div>
                <div style={{ fontWeight: 700, color: 'var(--navy-primary)' }}>{selectedReceipt.customer.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{selectedReceipt.customer.email}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{selectedReceipt.customer.address}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Rental Item</div>
                <div style={{ fontWeight: 700, color: 'var(--navy-primary)' }}>{selectedReceipt.rental.appliance_name}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>ID: {selectedReceipt.rental.rental_id}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Duration: {selectedReceipt.rental.duration_months} Month(s)</div>
              </div>
            </div>

            {/* Financial Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Monthly Rent (₹{selectedReceipt.financial_breakdown.monthly_rate} × {selectedReceipt.financial_breakdown.duration_months} mo):</span>
                <span>₹{selectedReceipt.financial_breakdown.subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Doorstep Delivery & Professional Setup:</span>
                <span>{selectedReceipt.financial_breakdown.delivery_fee === 0 ? 'FREE' : `₹${selectedReceipt.financial_breakdown.delivery_fee}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Refundable Security Deposit:</span>
                <span>₹{selectedReceipt.financial_breakdown.security_deposit.toLocaleString()}</span>
              </div>
              <div style={{ height: '1px', backgroundColor: 'var(--border-medium)', margin: '0.25rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
                <span>Total Paid:</span>
                <span style={{ color: '#059669' }}>₹{selectedReceipt.financial_breakdown.total_amount.toLocaleString()}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={handlePrint} className="btn btn-primary btn-sm">
                <Printer size={15} /> Print / Save PDF
              </button>
            </div>

          </div>
        )}
      </Modal>

    </div>
  );
};

export default CustomerPayments;
