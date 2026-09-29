import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Calculator, 
  TrendingDown, 
  CheckCircle2, 
  ShieldCheck, 
  Wrench, 
  Truck, 
  Zap, 
  Sparkles 
} from 'lucide-react';

const RentVsBuyCalculator = ({ defaultMonthlyRent = 1499, defaultApplianceName = "Smart Home Appliance" }) => {
  const [tenureMonths, setTenureMonths] = useState(12);
  const [monthlyRent, setMonthlyRent] = useState(defaultMonthlyRent);
  const [retailPrice, setRetailPrice] = useState(defaultMonthlyRent * 24); // e.g., ~₹36,000 for ₹1,500/mo

  // Calculation Breakdown
  const totalRentCost = monthlyRent * tenureMonths;
  const estimatedMaintenanceCost = tenureMonths > 12 ? Math.round((tenureMonths / 12) * 3500) : 1500;
  const estimatedRelocationCost = tenureMonths >= 12 ? 2000 : 0;
  const upfrontPurchaseTotal = retailPrice + estimatedMaintenanceCost + estimatedRelocationCost;
  
  // Resale/depreciation after tenure
  const depreciationRate = Math.min(0.7, 0.25 + (tenureMonths / 36) * 0.45);
  const estimatedResaleValue = Math.round(retailPrice * (1 - depreciationRate));
  const netBuyCost = upfrontPurchaseTotal - (tenureMonths >= 6 ? estimatedResaleValue : 0);

  const immediateCashSavings = retailPrice - totalRentCost;
  const percentSaved = Math.max(10, Math.round(((upfrontPurchaseTotal - totalRentCost) / upfrontPurchaseTotal) * 100));

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.75 }
    });
  };

  return (
    <div className="app-card" style={{
      padding: '2rem',
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
      border: '1px solid var(--blue-border)',
      boxShadow: 'var(--shadow-md)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: 'var(--blue-subtle)',
            color: 'var(--blue-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calculator size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-primary)', margin: 0 }}>
              Rent vs. Buy Financial Calculator
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
              Compare upfront purchase + upkeep vs. renting {defaultApplianceName}
            </p>
          </div>
        </div>

        <div style={{
          backgroundColor: '#ECFDF5',
          border: '1px solid #A7F3D0',
          color: '#047857',
          padding: '0.35rem 0.85rem',
          borderRadius: '9999px',
          fontSize: '0.8rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem'
        }}>
          <Sparkles size={14} /> Save up to {percentSaved}% upfront
        </div>
      </div>

      {/* Interactive Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
        backgroundColor: '#FFFFFF',
        padding: '1.25rem',
        borderRadius: '12px',
        border: '1px solid var(--border-light)'
      }}>
        {/* Tenure Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy-primary)' }}>Rental Duration:</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--blue-primary)' }}>{tenureMonths} Months</span>
          </div>
          <input
            type="range"
            min="3"
            max="36"
            step="1"
            value={tenureMonths}
            onChange={(e) => {
              setTenureMonths(Number(e.target.value));
              if (Number(e.target.value) >= 12) triggerConfetti();
            }}
            style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--blue-primary)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px' }}>
            <span>3 mo</span>
            <span>6 mo</span>
            <span>12 mo</span>
            <span>24 mo</span>
            <span>36 mo</span>
          </div>
        </div>

        {/* Monthly Rate & Retail Price Customizer */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '4px' }}>
              Monthly Rent (₹)
            </label>
            <input
              type="number"
              className="form-control"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(Math.max(100, Number(e.target.value)))}
              style={{ fontSize: '0.9rem', padding: '0.45rem 0.65rem' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '4px' }}>
              Buying Retail Price (₹)
            </label>
            <input
              type="number"
              className="form-control"
              value={retailPrice}
              onChange={(e) => setRetailPrice(Math.max(1000, Number(e.target.value)))}
              style={{ fontSize: '0.9rem', padding: '0.45rem 0.65rem' }}
            />
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        {/* Renting with ApplineX Card */}
        <div style={{
          backgroundColor: '#F0F9FF',
          border: '2px solid var(--blue-primary)',
          borderRadius: '14px',
          padding: '1.5rem',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '-12px',
            left: '1.5rem',
            backgroundColor: 'var(--blue-primary)',
            color: '#FFFFFF',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '2px 10px',
            borderRadius: '9999px',
            letterSpacing: '0.04em'
          }}>
            RECOMMENDED SMART CHOICE
          </div>

          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy-primary)', marginBottom: '0.5rem' }}>
            Renting via ApplineX
          </h4>

          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--blue-primary)', marginBottom: '1rem' }}>
            ₹{totalRentCost.toLocaleString()}
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 400 }}> / total {tenureMonths} mos</span>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.82rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#047857', fontWeight: 600 }}>
              <CheckCircle2 size={16} /> ₹0 Upfront Appliance Cost
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#047857', fontWeight: 600 }}>
              <CheckCircle2 size={16} /> 100% Free Doorstep Maintenance & Gas Refill
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#047857', fontWeight: 600 }}>
              <CheckCircle2 size={16} /> Free Relocation When You Shift Homes
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#047857', fontWeight: 600 }}>
              <CheckCircle2 size={16} /> Easy Mid-Tenure Upgrades to Newer Tech
            </li>
          </ul>
        </div>

        {/* Buying Brand New Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-medium)',
          borderRadius: '14px',
          padding: '1.5rem'
        }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#64748B', marginBottom: '0.5rem' }}>
            Buying Brand New
          </h4>

          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#334155', marginBottom: '1rem' }}>
            ₹{upfrontPurchaseTotal.toLocaleString()}
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 400 }}> / upfront + upkeep</span>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.82rem', color: '#64748B' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              • High ₹{retailPrice.toLocaleString()} locked-in upfront capital
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              • Out-of-pocket repair costs (~₹{estimatedMaintenanceCost.toLocaleString()})
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              • Moving charges & re-installation (~₹{estimatedRelocationCost.toLocaleString()})
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              • ~{Math.round(depreciationRate * 100)}% depreciation when trying to sell
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Summary Bar */}
      <div style={{
        backgroundColor: 'var(--navy-primary)',
        color: '#FFFFFF',
        borderRadius: '12px',
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Immediate Liquidity / Cash Saved Upfront
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#00C4FF' }}>
            ₹{immediateCashSavings > 0 ? immediateCashSavings.toLocaleString() : 0} Available In Your Bank
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Risk-Free Guarantee</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#10B981' }}>100% Refundable Deposit</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentVsBuyCalculator;
