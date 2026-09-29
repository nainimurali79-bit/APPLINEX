import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  FileText 
} from 'lucide-react';
import { printReceipt } from '../../utils/printReceipt';

const InvoiceModal = ({ rental, isOpen, onClose }) => {
  if (!isOpen || !rental) return null;

  const invoiceNumber = `INV-${rental.rental_id || 'APLX-8891'}`;
  const invoiceDate = rental.start_date || new Date().toISOString().split('T')[0];
  const monthlyRate = parseFloat(rental.monthly_rate || 1499);
  const duration = parseInt(rental.duration_months || 12);
  const subtotal = monthlyRate * duration;
  const gst = Math.round(subtotal * 0.18);
  const deposit = parseFloat(rental.security_deposit || 3000);
  const total = subtotal + deposit;

  const handlePrint = () => {
    printReceipt({
      receipt_number: invoiceNumber,
      transaction_reference: rental.rental_id ? `TXN-${rental.rental_id}` : 'TXN-APX-8891',
      date: invoiceDate,
      status: 'completed',
      customer: {
        name: rental.customer_name || 'Subscriber Account',
        address: rental.delivery_address || 'Delivery Address on Record',
        city: rental.delivery_city || 'City',
        phone: rental.delivery_phone || '+91 98765 43210',
      },
      rental: {
        rental_id: rental.rental_id,
        appliance_name: rental.appliance_details?.name || 'Smart Household Appliance',
        brand: rental.appliance_details?.brand || 'Verified OEM',
        duration_months: duration,
        start_date: rental.start_date,
        end_date: rental.end_date,
      },
      financial_breakdown: {
        monthly_rate: monthlyRate,
        duration_months: duration,
        subtotal: subtotal,
        delivery_fee: 0,
        security_deposit: deposit,
        total_amount: total,
      }
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 11, 20, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          maxWidth: '700px',
          width: '100%',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          padding: '2.5rem',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
        id="printable-invoice"
      >
        {/* Close button (hidden during print) */}
        <button
          onClick={onClose}
          className="no-print"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748B'
          }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Invoice Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--border-light)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '4px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #1E60D5 0%, #00C4FF 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}>
                <FileText size={18} />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-primary)', letterSpacing: '0.04em' }}>
                APPLINEX
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
              Smart Living Ecosystem & Appliance Lease Management
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>
              GSTIN: 36AAACA0000A1Z5 • CIN: U74999TG2026PTC123456
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
              TAX INVOICE
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--blue-primary)', marginTop: '2px' }}>
              {invoiceNumber}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
              Date: {invoiceDate}
            </div>
            <span style={{
              display: 'inline-block',
              backgroundColor: '#ECFDF5',
              color: '#047857',
              border: '1px solid #A7F3D0',
              padding: '2px 8px',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              marginTop: '4px'
            }}>
              PAID IN FULL
            </span>
          </div>
        </div>

        {/* Billed To & Lease Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
              BILLED TO CUSTOMER:
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
              {rental.customer_name || 'Subscriber Account'}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.4 }}>
              {rental.delivery_address || 'Delivery Address on Record'}, {rental.delivery_city || 'City'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
              Phone: {rental.delivery_phone || '+91 98765 43210'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
              RENTAL TENURE DETAILS:
            </div>
            <div style={{ fontSize: '0.85rem', color: '#334155' }}>
              <strong>Tenure Duration:</strong> {duration} Month(s)
            </div>
            <div style={{ fontSize: '0.85rem', color: '#334155' }}>
              <strong>Active Period:</strong> {rental.start_date || invoiceDate} to {rental.end_date || 'Ongoing'}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#334155' }}>
              <strong>Maintenance Cover:</strong> ₹0 Zero Cost (Active)
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#64748B' }}>Description</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#64748B' }}>Duration</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#64748B' }}>Rate / Mo</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#64748B' }}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--navy-primary)' }}>
                {rental.appliance_details?.name || 'Smart Household Appliance'}
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 400 }}>
                  Brand: {rental.appliance_details?.brand || 'Verified OEM'} • Model ID: {rental.appliance_details?.id || 1}
                </div>
              </td>
              <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>{duration} Mos</td>
              <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>₹{monthlyRate.toLocaleString()}</td>
              <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700 }}>₹{subtotal.toLocaleString()}</td>
            </tr>

            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <td style={{ padding: '0.85rem 1rem', color: 'var(--navy-primary)' }}>
                Refundable Security Deposit
                <div style={{ fontSize: '0.75rem', color: '#10B981' }}>100% refundable upon lease completion</div>
              </td>
              <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>1 Item</td>
              <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>₹{deposit.toLocaleString()}</td>
              <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700 }}>₹{deposit.toLocaleString()}</td>
            </tr>

            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <td style={{ padding: '0.85rem 1rem', color: '#047857' }}>
                Doorstep Delivery, Unboxing & Installation
              </td>
              <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Complimentary</td>
              <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>₹0</td>
              <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700, color: '#047857' }}>₹0</td>
            </tr>
          </tbody>
        </table>

        {/* Totals Breakdown */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
              <span>Lease Subtotal:</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
              <span>GST (18% Included):</span>
              <span>₹{gst.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
              <span>Security Deposit:</span>
              <span>₹{deposit.toLocaleString()}</span>
            </div>
            <div style={{ height: '1px', backgroundColor: 'var(--border-light)', margin: '4px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
              <span>Total Paid:</span>
              <span style={{ color: 'var(--blue-primary)' }}>₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer & Print Controls */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
            This is a computer-generated tax invoice verified under the Indian IT Act. No physical signature required.
          </div>

          <div className="no-print" style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={onClose} className="btn btn-secondary btn-sm">
              Close
            </button>
            <button onClick={handlePrint} className="btn btn-primary btn-sm">
              <Printer size={16} /> Print / Save PDF
            </button>
          </div>
        </div>

      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoiceModal;
