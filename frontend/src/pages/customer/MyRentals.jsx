import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { rentalsApi } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { Package, Calendar, Clock, ArrowRight, Eye, RotateCcw } from 'lucide-react';

const MyRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    rentalsApi.getRentals({ tab: activeTab !== 'all' ? activeTab : undefined })
      .then((res) => {
        setRentals(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [activeTab]);

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '80vh', padding: '2rem 0 4rem' }}>
      <div className="container-custom">
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              CUSTOMER PORTAL
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--navy-primary)', marginTop: '2px' }}>
              My Rentals
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
              Manage and track all your active, past, and requested household appliance leases.
            </p>
          </div>
          <Link to="/appliances" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            + Rent Another Appliance
          </Link>
        </div>

        {/* Tabs matching reference */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
          {[
            { id: 'all', label: 'All Rentals' },
            { id: 'active', label: 'Active' },
            { id: 'pending', label: 'Pending' },
            { id: 'returned', label: 'Returned' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.55rem 1.15rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? 'var(--blue-primary)' : 'transparent',
                color: activeTab === tab.id ? '#FFFFFF' : '#64748B',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonLoader count={3} height="140px" />
        ) : rentals.length === 0 ? (
          <div className="app-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#F1F5F9', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Package size={28} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '0.35rem' }}>
              No Rentals in this Section
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem' }}>
              You don't have any rental bookings under the selected filter.
            </p>
            <Link to="/appliances" className="btn btn-primary btn-sm">
              Browse Appliances Catalog
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {rentals.map((rental) => (
              <div
                key={rental.id}
                className="app-card"
                style={{
                  padding: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: '90px 1.5fr 1fr 1fr auto',
                  gap: '1.5rem',
                  alignItems: 'center'
                }}
              >
                {/* Appliance Image */}
                <div style={{
                  height: '80px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.35rem'
                }}>
                  <img
                    src={rental.appliance_details?.image_url}
                    alt={rental.appliance_details?.name}
                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                  />
                </div>

                {/* Details */}
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase' }}>
                    {rental.rental_id}
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-primary)', marginTop: '2px', marginBottom: '4px' }}>
                    {rental.appliance_details?.name}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    Category: {rental.appliance_details?.category_name}
                  </div>
                </div>

                {/* Period & Rate */}
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Lease Period</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy-primary)', marginTop: '2px' }}>
                    {rental.start_date} → {rental.end_date}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    {rental.duration_months} Month(s) @ ₹{parseInt(rental.monthly_rate).toLocaleString()}/mo
                  </div>
                </div>

                {/* Status & Amount */}
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Status & Paid</div>
                  <div style={{ marginTop: '3px', marginBottom: '4px' }}>
                    <StatusBadge status={rental.status} />
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
                    Total: ₹{parseFloat(rental.total_amount).toLocaleString()}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <Link
                    to={`/dashboard/rentals/${rental.id}`}
                    className="btn btn-primary btn-sm"
                    style={{ textDecoration: 'none', justifyContent: 'center' }}
                  >
                    <Eye size={14} /> Track Timeline
                  </Link>
                  <Link
                    to={`/appliances/${rental.appliance}`}
                    className="btn btn-secondary btn-sm"
                    style={{ textDecoration: 'none', justifyContent: 'center' }}
                  >
                    View Specs
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyRentals;
