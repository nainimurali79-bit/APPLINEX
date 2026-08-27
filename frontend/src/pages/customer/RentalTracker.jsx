import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { rentalsApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import StatusBadge from '../../components/common/StatusBadge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
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
  HelpCircle
} from 'lucide-react';

const RentalTracker = () => {
  const { id } = useParams();
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestingReturn, setRequestingReturn] = useState(false);
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
      addToast('Return request submitted. Our team will contact you for pickup scheduling.', 'success');
      addNotification('Return Requested', `Return initiated for ${rental.rental_id}`, 'info');
    } catch (err) {
      setRequestingReturn(false);
      addToast(err.response?.data?.error || 'Failed to submit return request.', 'error');
    }
  };

  const handleDownloadInvoice = () => {
    window.print();
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

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleDownloadInvoice} className="btn btn-secondary btn-sm">
              <Download size={16} /> Download Invoice
            </button>
            {['active', 'payment_completed'].includes(rental.status) && (
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
          gap: '2rem'
        }} className="tracker-grid">
          
          {/* Left Column: Visual Step Timeline */}
          <div className="app-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '1.75rem' }}>
              Rental Status & Lifecycle Timeline
            </h3>

            <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
              {/* Vertical line */}
              <div style={{
                position: 'absolute',
                top: '12px',
                bottom: '12px',
                left: '27px',
                width: '2px',
                backgroundColor: 'var(--border-medium)',
                zIndex: 0
              }} />

              {timeline.map((event, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.25rem',
                  marginBottom: idx === timeline.length - 1 ? 0 : '2rem',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {/* Step Circle */}
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: '#ECFDF5',
                    border: '2px solid #10B981',
                    color: '#10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 0 10px rgba(16, 185, 129, 0.2)'
                  }}>
                    <CheckCircle2 size={16} />
                  </div>

                  {/* Event Details */}
                  <div style={{ flex: 1, backgroundColor: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy-primary)' }}>
                        {event.status}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>
                        {event.timestamp}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Help desk notice */}
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
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--navy-primary)' }}>Need help with this rental?</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Raise a support request or report an issue with the technician.</div>
                </div>
              </div>
              <Link to="/#support-section" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                Contact Support
              </Link>
            </div>

          </div>

          {/* Right Column: Appliance Details & Financial Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
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
                  <span style={{ color: '#64748B' }}>Duration:</span>
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
                  <strong>₹{parseInt(rental.monthly_rate).toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Security Deposit:</span>
                  <strong>₹{parseInt(rental.security_deposit).toLocaleString()}</strong>
                </div>
                <div style={{ height: '1px', backgroundColor: 'var(--border-light)', margin: '0.25rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
                  <span>Total Amount:</span>
                  <span style={{ color: 'var(--blue-primary)' }}>₹{parseFloat(rental.total_amount).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address Card */}
            <div className="app-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.92rem', color: 'var(--navy-primary)', marginBottom: '0.85rem' }}>
                <MapPin size={18} color="var(--blue-primary)" /> Delivery Location
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                {rental.delivery_address}, {rental.delivery_city}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#64748B' }}>
                <Phone size={14} /> {rental.delivery_phone}
              </div>
            </div>

          </div>

        </div>

      </div>

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
