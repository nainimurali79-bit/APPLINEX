import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, 
  Trash2, 
  Star, 
  Check, 
  X, 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  Truck, 
  Wrench,
  Sparkles
} from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import RentalBookingModal from '../../components/customer/RentalBookingModal';
import StatusBadge from '../../components/common/StatusBadge';

const ApplianceComparisonPage = () => {
  const { compareList, removeFromCompare, clearCompare } = useWishlist();
  const [selectedAppliance, setSelectedAppliance] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const handleRentClick = (appliance) => {
    setSelectedAppliance(appliance);
    setBookingModalOpen(true);
  };

  if (compareList.length === 0) {
    return (
      <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '80vh', padding: '4rem 1.5rem' }}>
        <div className="container-custom" style={{ maxWidth: '650px', textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            backgroundColor: 'var(--blue-subtle)',
            color: 'var(--blue-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 8px 25px rgba(30, 96, 213, 0.2)'
          }}>
            <Layers size={36} />
          </div>

          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--navy-primary)', marginBottom: '0.75rem' }}>
            No Appliances Selected for Comparison
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Select up to 4 appliances from our catalog to compare specifications, monthly rental costs, energy ratings, and smart IoT features side-by-side.
          </p>

          <Link to="/appliances" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
            Explore Appliances Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', padding: '2.5rem 0 5rem' }}>
      <div className="container-custom">
        
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <Link to="/appliances" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#64748B', marginBottom: '0.5rem' }}>
              <ArrowLeft size={16} /> Back to Catalog
            </Link>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--navy-primary)', margin: 0 }}>
              Side-by-Side Appliance Comparison
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '4px' }}>
              Comparing {compareList.length} appliances with live rental pricing & smart specs
            </p>
          </div>

          <button
            onClick={clearCompare}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Trash2 size={15} /> Clear All ({compareList.length})
          </button>
        </div>

        {/* Comparison Matrix Table */}
        <div className="app-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', textAlign: 'left' }}>
            
            {/* Header row with appliance cards */}
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-light)' }}>
                <th style={{ width: '220px', padding: '1rem', color: '#64748B', fontSize: '0.88rem', fontWeight: 700 }}>
                  Appliance Details
                </th>
                {compareList.map((appliance) => (
                  <th key={appliance.id} style={{ width: `${100 / (compareList.length + 1)}%`, padding: '1rem', verticalAlign: 'top' }}>
                    <div style={{ position: 'relative', textAlign: 'center' }}>
                      <button
                        onClick={() => removeFromCompare(appliance.id)}
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          backgroundColor: '#F1F5F9',
                          border: 'none',
                          borderRadius: '50%',
                          width: '26px',
                          height: '26px',
                          cursor: 'pointer',
                          color: '#64748B'
                        }}
                        title="Remove from comparison"
                      >
                        <X size={14} />
                      </button>

                      <div style={{
                        height: '140px',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '12px',
                        padding: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.75rem'
                      }}>
                        <img
                          src={appliance.image_url}
                          alt={appliance.name}
                          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                        />
                      </div>

                      <div style={{ fontSize: '0.75rem', color: 'var(--blue-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                        {appliance.brand}
                      </div>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--navy-primary)', margin: '4px 0 8px' }}>
                        {appliance.name}
                      </h4>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--blue-primary)', marginBottom: '0.75rem' }}>
                        ₹{parseInt(appliance.monthly_price).toLocaleString()} <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 400 }}>/mo</span>
                      </div>

                      <button
                        onClick={() => handleRentClick(appliance)}
                        disabled={appliance.status !== 'available'}
                        className="btn btn-primary btn-sm btn-block"
                      >
                        {appliance.status === 'available' ? 'Rent Now' : 'Unavailable'}
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Spec rows */}
            <tbody>
              {/* Category */}
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--navy-primary)', fontSize: '0.85rem' }}>
                  Category
                </td>
                {compareList.map((app) => (
                  <td key={app.id} style={{ padding: '0.85rem 1rem', fontSize: '0.88rem', color: '#334155' }}>
                    {app.category_name}
                  </td>
                ))}
              </tr>

              {/* Status & Availability */}
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--navy-primary)', fontSize: '0.85rem' }}>
                  Availability Status
                </td>
                {compareList.map((app) => (
                  <td key={app.id} style={{ padding: '0.85rem 1rem' }}>
                    <StatusBadge status={app.status} />
                  </td>
                ))}
              </tr>

              {/* Customer Rating */}
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--navy-primary)', fontSize: '0.85rem' }}>
                  Customer Rating
                </td>
                {compareList.map((app) => (
                  <td key={app.id} style={{ padding: '0.85rem 1rem', fontSize: '0.88rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontWeight: 700 }}>
                      <Star size={15} fill="#F59E0B" />
                      <span>{parseFloat(app.rating).toFixed(1)} / 5.0</span>
                      <span style={{ color: '#94A3B8', fontWeight: 400, fontSize: '0.75rem' }}>({app.reviews_count || 12})</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Capacity */}
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--navy-primary)', fontSize: '0.85rem' }}>
                  Capacity / Size
                </td>
                {compareList.map((app) => (
                  <td key={app.id} style={{ padding: '0.85rem 1rem', fontSize: '0.88rem', fontWeight: 600, color: '#0F172A' }}>
                    {app.capacity || "Standard Household"}
                  </td>
                ))}
              </tr>

              {/* Energy Rating */}
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--navy-primary)', fontSize: '0.85rem' }}>
                  BEE Energy Star Rating
                </td>
                {compareList.map((app) => (
                  <td key={app.id} style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ backgroundColor: '#ECFDF5', color: '#059669', padding: '3px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 700 }}>
                      {app.energy_rating || "4-Star Inverter"}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Security Deposit */}
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--navy-primary)', fontSize: '0.85rem' }}>
                  Refundable Security Deposit
                </td>
                {compareList.map((app) => (
                  <td key={app.id} style={{ padding: '0.85rem 1rem', fontSize: '0.88rem', fontWeight: 700, color: '#047857' }}>
                    ₹{parseInt(app.security_deposit || app.monthly_price * 2).toLocaleString()} (100% Refundable)
                  </td>
                ))}
              </tr>

              {/* Doorstep Free Maintenance */}
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--navy-primary)', fontSize: '0.85rem' }}>
                  Maintenance & Gas Refill
                </td>
                {compareList.map((app) => (
                  <td key={app.id} style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: '#047857', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={16} color="#10B981" /> ₹0 Free Doorstep Visits
                    </div>
                  </td>
                ))}
              </tr>

              {/* Free Relocation Guarantee */}
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--navy-primary)', fontSize: '0.85rem' }}>
                  Home Relocation Assistance
                </td>
                {compareList.map((app) => (
                  <td key={app.id} style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: '#047857', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={16} color="#10B981" /> Free Doorstep Shifting
                    </div>
                  </td>
                ))}
              </tr>

              {/* Action Bottom */}
              <tr>
                <td style={{ padding: '1.25rem 1rem' }}></td>
                {compareList.map((app) => (
                  <td key={app.id} style={{ padding: '1.25rem 1rem' }}>
                    <Link
                      to={`/appliances/${app.id}`}
                      className="btn btn-secondary btn-sm btn-block"
                      style={{ textDecoration: 'none' }}
                    >
                      View Full Details
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>

          </table>
        </div>

      </div>

      {/* Booking Modal */}
      {selectedAppliance && (
        <RentalBookingModal
          appliance={selectedAppliance}
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ApplianceComparisonPage;
