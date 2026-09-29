import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { rentalsApi, paymentsApi, appliancesApi, aiApi } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import ApplianceCard from '../../components/appliances/ApplianceCard';
import RentalBookingModal from '../../components/customer/RentalBookingModal';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { 
  Package, 
  ShoppingBag, 
  CreditCard, 
  Box, 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  RotateCcw,
  FileText,
  Camera,
  User
} from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [rentals, setRentals] = useState([]);
  const [payments, setPayments] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [availableCount, setAvailableCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selectedAppliance, setSelectedAppliance] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      rentalsApi.getRentals(),
      paymentsApi.getPayments(),
      aiApi.getRecommendations(),
      appliancesApi.getAppliances({ status: 'available' })
    ])
      .then(([rentalsRes, paymentsRes, recsRes, availableRes]) => {
        setRentals(rentalsRes.data);
        setPayments(paymentsRes.data);
        setRecommendations(recsRes.data.slice(0, 3));
        setAvailableCount(availableRes.data.length);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const activeRental = rentals.find((r) => r.status === 'active' || r.status === 'payment_completed' || r.status === 'approved');
  const totalSpent = payments.filter((p) => p.status === 'successful').reduce((acc, p) => acc + parseFloat(p.amount), 0);

  const handleRentClick = (appliance) => {
    setSelectedAppliance(appliance);
    setBookingModalOpen(true);
  };

  if (loading) {
    return (
      <div className="container-custom" style={{ padding: '2.5rem 1.5rem' }}>
        <SkeletonLoader count={4} height="120px" style={{ marginBottom: '2rem' }} />
        <SkeletonLoader count={2} height="280px" />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '80vh', padding: '2rem 0 4rem' }}>
      <div className="container-custom">
        
        {/* Dashboard Header with Customer Avatar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link
              to="/dashboard/profile"
              title="Click to change your profile picture"
              style={{ position: 'relative', display: 'inline-block', textDecoration: 'none', flexShrink: 0 }}
            >
              {user?.profile_image ? (
                <img
                  src={user.profile_image}
                  alt={user.first_name || user.username}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #fff',
                    boxShadow: '0 4px 14px rgba(37,99,235,0.22)',
                    display: 'block'
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                style={{
                  display: user?.profile_image ? 'none' : 'flex',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '1.4rem',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.22)'
                }}
              >
                {(user?.first_name?.[0] || user?.username?.[0] || 'C').toUpperCase()}
              </div>
              <span
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  background: '#2563EB',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #fff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }}
                title="Change Photo"
              >
                <Camera size={13} />
              </span>
            </Link>

            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                CUSTOMER PORTAL
              </div>
              <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--navy-primary)', marginTop: '2px' }}>
                Welcome, {user?.first_name || user?.username || 'Customer'}!
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
                Track your active rentals, payment ledger, and AI recommended upgrades.
              </p>
            </div>
          </div>
          <Link to="/appliances" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            + Rent New Appliance
          </Link>
        </div>

        {/* Top 4 Stat Cards matching reference */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          <StatCard
            title="Active Rentals"
            value={rentals.filter((r) => ['active', 'approved', 'payment_completed'].includes(r.status)).length}
            icon={Package}
            color="blue"
            subtext="Currently deployed"
          />
          <StatCard
            title="Total Rentals"
            value={rentals.length}
            icon={ShoppingBag}
            color="green"
            subtext="Lifetime rentals"
          />
          <StatCard
            title="Payments"
            value={`₹${totalSpent.toLocaleString()}`}
            icon={CreditCard}
            color="purple"
            subtext="Total transaction volume"
          />
          <StatCard
            title="Available Appliances"
            value={availableCount}
            icon={Box}
            color="cyan"
            subtext="Ready for quick setup"
          />
        </div>

        {/* Current Active Rental Card matching reference */}
        {activeRental && (
          <div className="app-card" style={{ padding: '1.75rem', marginBottom: '2.5rem', borderLeft: '4px solid var(--blue-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  CURRENT ACTIVE RENTAL
                </span>
                <span style={{ color: '#94A3B8' }}>•</span>
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--navy-primary)' }}>
                  {activeRental.rental_id}
                </span>
              </div>
              <StatusBadge status={activeRental.status} />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr auto',
              gap: '1.5rem',
              alignItems: 'center'
            }} className="current-rental-grid">
              
              <div style={{
                height: '110px',
                backgroundColor: '#F8FAFC',
                borderRadius: '10px',
                border: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem'
              }}>
                <img
                  src={activeRental.appliance_details?.image_url}
                  alt={activeRental.appliance_details?.name}
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                />
              </div>

              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '0.35rem' }}>
                  {activeRental.appliance_details?.name}
                </h3>
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#64748B', flexWrap: 'wrap' }}>
                  <div>Tenure: <strong style={{ color: 'var(--text-primary)' }}>{activeRental.duration_months} Month(s)</strong></div>
                  <div>Monthly: <strong style={{ color: 'var(--blue-primary)' }}>₹{parseInt(activeRental.monthly_rate).toLocaleString()}</strong></div>
                  <div>Period: <strong style={{ color: 'var(--text-primary)' }}>{activeRental.start_date} to {activeRental.end_date}</strong></div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link
                  to={`/dashboard/rentals/${activeRental.id}`}
                  className="btn btn-primary btn-sm"
                  style={{ textDecoration: 'none' }}
                >
                  Track Live Timeline
                </Link>
                <Link
                  to={`/dashboard/rentals/${activeRental.id}`}
                  className="btn btn-secondary btn-sm"
                  style={{ textDecoration: 'none' }}
                >
                  View Details
                </Link>
              </div>

            </div>
          </div>
        )}

        {/* Main 2-Column Section: Rental History & AI Recommendations */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: '2rem',
          marginBottom: '2.5rem'
        }} className="dashboard-split-layout">
          
          {/* Left: Rental History */}
          <div className="app-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
                Rental History
              </h3>
              <Link to="/dashboard/rentals" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--blue-primary)' }}>
                View All Rentals →
              </Link>
            </div>

            {rentals.length === 0 ? (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.88rem' }}>
                No rental bookings recorded yet.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="app-table">
                  <thead>
                    <tr>
                      <th>Rental ID</th>
                      <th>Appliance</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rentals.slice(0, 4).map((r) => (
                      <tr key={r.id}>
                        <td>
                          <span style={{ fontWeight: 700, color: 'var(--blue-primary)' }}>{r.rental_id}</span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--navy-primary)', fontSize: '0.85rem' }}>
                            {r.appliance_details?.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{r.start_date}</div>
                        </td>
                        <td>{r.duration_months} mo</td>
                        <td><StatusBadge status={r.status} /></td>
                        <td>
                          <Link to={`/dashboard/rentals/${r.id}`} className="btn btn-secondary btn-sm" style={{ textDecoration: 'none', padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right: AI Smart Recommendations */}
          <div className="app-card app-card-ai" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="var(--ai-purple)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
                  Smart Recommendations
                </h3>
              </div>
              <Link to="/dashboard/recommendations" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ai-purple)' }}>
                View All
              </Link>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '1rem' }}>
              Based on your previous rentals, ratings, and lifestyle match.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
              {recommendations.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    border: '1px solid var(--border-light)',
                    padding: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    transition: 'border-color var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={item.appliance.image_url}
                      alt={item.appliance.name}
                      style={{ width: '42px', height: '42px', objectFit: 'contain' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--navy-primary)', lineHeight: 1.2 }}>
                        {item.appliance.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--blue-primary)', fontWeight: 600, marginTop: '2px' }}>
                        ₹{parseInt(item.appliance.monthly_price).toLocaleString()} /mo
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRentClick(item.appliance)}
                    className="btn btn-ai btn-sm"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', flexShrink: 0 }}
                  >
                    Rent Now
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Recent Payments Table */}
        <div className="app-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
              Recent Transactions
            </h3>
            <Link to="/dashboard/payments" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--blue-primary)' }}>
              View All Transactions →
            </Link>
          </div>

          {payments.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
              No payments recorded yet.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Payment ID</th>
                    <th>Rental ID</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                    <th>Date & Time</th>
                    <th>Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.slice(0, 5).map((p) => (
                    <tr key={p.id}>
                      <td><span style={{ fontWeight: 700, color: 'var(--navy-primary)' }}>{p.payment_id}</span></td>
                      <td><span style={{ color: 'var(--blue-primary)', fontWeight: 600 }}>{p.rental_code}</span></td>
                      <td><strong style={{ color: 'var(--navy-primary)' }}>₹{parseFloat(p.amount).toLocaleString()}</strong></td>
                      <td><span style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>{p.payment_method}</span></td>
                      <td><StatusBadge status={p.status} /></td>
                      <td style={{ fontSize: '0.8rem', color: '#64748B' }}>{new Date(p.payment_date).toLocaleString()}</td>
                      <td style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#64748B' }}>{p.transaction_reference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Booking Modal */}
      {selectedAppliance && (
        <RentalBookingModal
          isOpen={bookingModalOpen}
          onClose={() => {
            setBookingModalOpen(false);
            setSelectedAppliance(null);
          }}
          appliance={selectedAppliance}
          onBookingComplete={() => {
            rentalsApi.getRentals().then((res) => setRentals(res.data));
            paymentsApi.getPayments().then((res) => setPayments(res.data));
          }}
        />
      )}

      <style>{`
        @media (max-width: 900px) {
          .current-rental-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .dashboard-split-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CustomerDashboard;
