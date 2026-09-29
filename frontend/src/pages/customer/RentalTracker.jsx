import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { rentalsApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import StatusBadge from '../../components/common/StatusBadge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import SmartApplianceTelemetry from '../../components/customer/SmartApplianceTelemetry';
import ScheduleMaintenanceModal from '../../components/customer/ScheduleMaintenanceModal';
import InvoiceModal from '../../components/customer/InvoiceModal';
import { 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  Download, 
  RotateCcw, 
  Truck, 
  ShieldCheck, 
  FileText,
  MapPin,
  Phone,
  HelpCircle,
  Wrench,
  Printer,
  CreditCard,
  QrCode,
  Box,
  Compass
} from 'lucide-react';

const RentalTracker = () => {
  const { id } = useParams();
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestingReturn, setRequestingReturn] = useState(false);
  const [relocating, setRelocating] = useState(false);
  const [newRelocationAddress, setNewRelocationAddress] = useState('');
  const [showRelocationModal, setShowRelocationModal] = useState(false);
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [payingInvoiceId, setPayingInvoiceId] = useState(null);
  const { addToast, addNotification } = useNotification();

  const fetchRentalData = () => {
    setLoading(true);
    rentalsApi.getRental(id)
      .then((res) => {
        setRental(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRentalData();
  }, [id]);

  const handleRequestReturn = async () => {
    if (!window.confirm('Are you sure you want to request return and pickup for this appliance?')) {
      return;
    }

    setRequestingReturn(true);
    try {
      const res = await rentalsApi.requestReturn(rental.id);
      setRequestingReturn(false);
      setRental(res.data.rental);
      addToast('Return request submitted. Our technician will coordinate pickup inspection.', 'success');
      addNotification('Return Requested', `Return initiated for ${rental.rental_id}`, 'info');
    } catch (err) {
      setRequestingReturn(false);
      addToast(err.response?.data?.error || 'Failed to submit return request.', 'error');
    }
  };

  const handleRequestRelocation = async (e) => {
    e.preventDefault();
    if (!newRelocationAddress.trim()) {
      addToast('Please enter your new delivery address.', 'error');
      return;
    }

    setRelocating(true);
    try {
      const res = await rentalsApi.requestRelocation(rental.id, { new_address: newRelocationAddress });
      setRelocating(false);
      setShowRelocationModal(false);
      setRental(res.data.rental);
      addToast('Free Relocation request submitted. Logistics team will coordinate uninstallation.', 'success');
    } catch (err) {
      setRelocating(false);
      addToast(err.response?.data?.error || 'Failed to submit relocation request.', 'error');
    }
  };

  const handlePayInvoice = async (invoiceId, monthNumber) => {
    setPayingInvoiceId(invoiceId);
    try {
      const res = await rentalsApi.payInvoice(invoiceId);
      setPayingInvoiceId(null);
      addToast(`Month ${monthNumber} rent paid successfully!`, 'success');
      fetchRentalData();
    } catch (err) {
      setPayingInvoiceId(null);
      addToast(err.response?.data?.error || 'Payment failed.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="container-custom" style={{ padding: '3rem 1.5rem' }}>
        <SkeletonLoader count={2} height="300px" />
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="container-custom" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h2>Rental Record Not Found</h2>
        <Link to="/dashboard/rentals" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to My Rentals
        </Link>
      </div>
    );
  }

  const timeline = rental.timeline_events || [];
  const invoices = rental.invoices || [];

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '80vh', padding: '2rem 0 4rem' }}>
      <div className="container-custom">
        
        {/* Top bar navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <Link to="/dashboard/rentals" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#64748B', marginBottom: '0.5rem' }}>
              <ArrowLeft size={16} /> Back to My Rentals
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--navy-primary)', margin: 0 }}>
                Rental Tracking: {rental.rental_id}
              </h1>
              <StatusBadge status={rental.status} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={() => setShowRelocationModal(true)} className="btn btn-secondary btn-sm" style={{ color: '#0284C7', borderColor: '#BAE6FD' }}>
              <Compass size={16} /> Free Relocation
            </button>
            <button onClick={() => setMaintenanceModalOpen(true)} className="btn btn-secondary btn-sm" style={{ color: 'var(--blue-primary)', borderColor: 'var(--blue-border)' }}>
              <Wrench size={16} /> Schedule Free Service
            </button>
            <button onClick={() => setInvoiceModalOpen(true)} className="btn btn-secondary btn-sm">
              <FileText size={16} /> Tax Invoice
            </button>
            {['active', 'payment_completed', 'dispatched'].includes(rental.status) && (
              <button
                onClick={handleRequestReturn}
                disabled={requestingReturn}
                className="btn btn-danger btn-sm"
              >
                <RotateCcw size={16} /> {requestingReturn ? 'Submitting...' : 'Request Return & Pickup'}
              </button>
            )}
          </div>
        </div>

        {/* Tracker Layout Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr',
          gap: '2rem',
          marginBottom: '2rem'
        }} className="tracker-grid">
          
          {/* Left Column: Visual Step Timeline & Invoices */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Timeline Card */}
            <div className="app-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '1.75rem' }}>
                Rental Status & Lifecycle Timeline
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', position: 'relative' }}>
                {timeline.map((event, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '1.25rem', position: 'relative' }}>
                    
                    {/* Vertical connecting line */}
                    {idx < timeline.length - 1 && (
                      <div style={{
                        position: 'absolute',
                        left: '15px',
                        top: '30px',
                        bottom: '-28px',
                        width: '2px',
                        backgroundColor: '#E2E8F0',
                        zIndex: 0
                      }} />
                    )}

                    {/* Step Icon */}
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: idx === timeline.length - 1 ? 'var(--blue-primary)' : '#DCFCE7',
                      color: idx === timeline.length - 1 ? '#FFFFFF' : '#16A34A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      zIndex: 1
                    }}>
                      {idx === timeline.length - 1 ? <Clock size={16} /> : <CheckCircle2 size={16} />}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <strong style={{ fontSize: '0.98rem', color: 'var(--navy-primary)' }}>
                          {event.status}
                        </strong>
                        <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                          {event.timestamp}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                        {event.description}
                      </p>
                    </div>

                  </div>
                ))}
              </div>

              {/* Maintenance Callout */}
              <div style={{
                marginTop: '2.5rem',
                padding: '1.25rem',
                backgroundColor: '#EFF6FF',
                borderRadius: '10px',
                border: '1px solid var(--blue-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <HelpCircle size={22} color="var(--blue-primary)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--navy-primary)' }}>Need help or maintenance?</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Book a certified ApplineX technician for free routine maintenance.</div>
                  </div>
                </div>
                <button
                  onClick={() => setMaintenanceModalOpen(true)}
                  className="btn btn-primary btn-sm"
                >
                  Book Technician
                </button>
              </div>

            </div>

            {/* Monthly Invoices & Billing Schedule Ledger (Rentomojo Standard) */}
            {invoices.length > 0 && (
              <div className="app-card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-primary)', margin: 0 }}>
                    Monthly Invoicing & Subscription Ledger
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#64748B', backgroundColor: '#F1F5F9', padding: '2px 8px', borderRadius: '6px' }}>
                    Auto-Pay Enabled
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {invoices.map((inv) => (
                    <div 
                      key={inv.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        borderRadius: '10px',
                        border: '1px solid var(--border-light)',
                        backgroundColor: inv.status === 'paid' ? '#F8FAFC' : '#FFFBEB'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <strong style={{ fontSize: '0.92rem', color: 'var(--navy-primary)' }}>
                            Month {inv.billing_month_number} Rent
                          </strong>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '1px 7px',
                            borderRadius: '999px',
                            backgroundColor: inv.status === 'paid' ? '#DCFCE7' : '#FEF3C7',
                            color: inv.status === 'paid' ? '#166534' : '#B45309'
                          }}>
                            {inv.status.toUpperCase()}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '3px' }}>
                          Cycle: {inv.billing_cycle_start} to {inv.billing_cycle_end} • Due: {inv.due_date}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--navy-primary)' }}>
                            ₹{inv.total_due}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                            {inv.status === 'paid' ? 'Paid Online' : 'Pending'}
                          </div>
                        </div>

                        {inv.status !== 'paid' && (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            disabled={payingInvoiceId === inv.id}
                            onClick={() => handlePayInvoice(inv.id, inv.billing_month_number)}
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
                          >
                            {payingInvoiceId === inv.id ? 'Paying...' : 'Pay Now'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Physical Unit Details & Financial Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Physical Inventory Unit Card */}
            <div className="app-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--blue-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy-primary)', marginBottom: '0.75rem' }}>
                <QrCode size={18} color="var(--blue-primary)" /> Physical Unit Assigned
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Serial Number:</span>
                  <strong style={{ fontFamily: 'monospace', color: '#0F172A' }}>
                    {rental.assigned_unit_details?.serial_number || 'SN-APX-89421'}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Unit Condition:</span>
                  <span style={{ color: '#059669', fontWeight: 600 }}>Pristine / Like-New</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Fulfillment Hub:</span>
                  <span>{rental.assigned_unit_details?.warehouse_location || `${rental.delivery_city} Central Hub`}</span>
                </div>
              </div>
            </div>

            {/* Appliance Summary Card */}
            <div className="app-card" style={{ padding: '1.75rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <div style={{
                  height: '140px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px solid var(--border-light)',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <img
                    src={rental.appliance_details?.image_url}
                    alt={rental.appliance_details?.name}
                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                  />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '4px' }}>
                  {rental.appliance_details?.name}
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                  {rental.appliance_details?.brand} • {rental.appliance_details?.category_name}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Rental Tenure:</span>
                  <strong>{rental.duration_months} Month(s)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Start Date:</span>
                  <strong>{rental.start_date}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>End Date:</span>
                  <strong>{rental.end_date}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Monthly Rate:</span>
                  <strong>₹{parseInt(rental.monthly_rate).toLocaleString()}/mo</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Refundable Deposit:</span>
                  <strong style={{ color: '#0F172A' }}>₹{parseInt(rental.security_deposit).toLocaleString()}</strong>
                </div>
                {rental.damage_protection_opt_in && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2563EB' }}>
                    <span>Damage Protection Plan:</span>
                    <strong>Active (₹99/mo)</strong>
                  </div>
                )}
                <div style={{ height: '1px', backgroundColor: 'var(--border-light)', margin: '0.25rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
                  <span>1st Month Upfront Paid:</span>
                  <span style={{ color: '#16A34A' }}>₹{parseFloat(rental.upfront_total_paid || rental.total_amount).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Deposit Settlement Card (If returned) */}
            {rental.deposit_refunded && (
              <div className="app-card" style={{ padding: '1.5rem', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#166534', marginBottom: '0.5rem' }}>
                  <CheckCircle2 size={18} /> Security Deposit Settled
                </div>
                <div style={{ fontSize: '0.82rem', color: '#15803D', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div>Total Deposit: ₹{rental.security_deposit}</div>
                  <div>QC Deductions: ₹{rental.deposit_deduction_amount || '0.00'} ({rental.deposit_deduction_reason || 'Full refund'})</div>
                  <div><strong>Refund Paid Out: ₹{rental.deposit_refund_amount}</strong></div>
                  <div style={{ fontSize: '0.75rem', color: '#166534' }}>Txn Ref: {rental.refund_transaction_ref}</div>
                </div>
              </div>
            )}

            {/* Delivery Address Card */}
            <div className="app-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.92rem', color: 'var(--navy-primary)', marginBottom: '0.85rem' }}>
                <MapPin size={18} color="var(--blue-primary)" /> Delivery Location & Slot
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                {rental.delivery_address}, {rental.delivery_city} - {rental.delivery_pincode || '560038'}
              </p>
              <div style={{ fontSize: '0.82rem', color: '#0284C7', fontWeight: 600, marginBottom: '0.5rem' }}>
                <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} /> Slot: {rental.delivery_date_slot || 'Tomorrow, 9 AM - 1 PM'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#64748B' }}>
                <Phone size={14} /> {rental.delivery_phone}
              </div>
            </div>

          </div>

        </div>

        {/* Live IoT Smart Telemetry & Health Monitoring */}
        <SmartApplianceTelemetry
          appliance={rental.appliance_details}
          rentalId={rental.rental_id}
        />

      </div>

      {/* Free Relocation Request Modal */}
      {showRelocationModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', maxWidth: '500px', width: '100%', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy-primary)', marginBottom: '0.5rem' }}>
              Request Free Annual Relocation
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem' }}>
              Moving to a new house? ApplineX handles complete uninstallation, safe packing, transit, and re-installation at your new home for ₹0 fee.
            </p>
            <form onSubmit={handleRequestRelocation}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">New Full Address & Landmark</label>
                <textarea 
                  className="form-control"
                  rows="3"
                  value={newRelocationAddress}
                  onChange={(e) => setNewRelocationAddress(e.target.value)}
                  placeholder="New flat/house number, building, street, city, pincode"
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowRelocationModal(false)} disabled={relocating}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={relocating}>
                  {relocating ? 'Submitting...' : 'Confirm Relocation Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Free Maintenance Modal */}
      <ScheduleMaintenanceModal
        rental={rental}
        isOpen={maintenanceModalOpen}
        onClose={() => setMaintenanceModalOpen(false)}
      />

      {/* Printable Digital Tax Invoice Modal */}
      <InvoiceModal
        rental={rental}
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
      />

      <style>{`
        @media (max-width: 850px) {
          .tracker-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default RentalTracker;
