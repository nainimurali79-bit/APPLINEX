import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { rentalsApi, paymentsApi } from '../../services/api';
import Modal from '../common/Modal';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  CheckCircle2, 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  Download, 
  ArrowRight, 
  Zap, 
  Sparkles,
  FileText,
  Lock,
  Clock,
  MapPin,
  HelpCircle,
  Wrench,
  Check
} from 'lucide-react';
import { printReceipt } from '../../utils/printReceipt';

const RentalBookingModal = ({ isOpen, onClose, appliance, onBookingComplete }) => {
  const { user, isAuthenticated } = useAuth();
  const { addToast, addNotification } = useNotification();
  const navigate = useNavigate();

  // Booking Flow Steps: 1: Tenure & Slots -> 2: Price Summary -> 3: Payment -> 4: Confirmed
  const [step, setStep] = useState(1);
  const [durationMonths, setDurationMonths] = useState(3);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [damageProtectionOptIn, setDamageProtectionOptIn] = useState(true);
  
  // Delivery & Scheduling details
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [deliveryPhone, setDeliveryPhone] = useState(user?.phone || '');
  const [deliveryCity, setDeliveryCity] = useState(user?.city || 'Bangalore');
  const [deliveryPincode, setDeliveryPincode] = useState(user?.postal_code || '560038');
  const [deliverySlot, setDeliverySlot] = useState('Tomorrow, 9 AM - 1 PM');
  const [installationRequired, setInstallationRequired] = useState(true);

  // Backend calculated pricing
  const [pricing, setPricing] = useState(null);
  const [loadingPricing, setLoadingPricing] = useState(false);

  // Payment details
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [processingPayment, setProcessingPayment] = useState(false);

  // Completed rental result
  const [createdRental, setCreatedRental] = useState(null);
  const [completedPayment, setCompletedPayment] = useState(null);

  const tenureOptions = [
    { months: 3, label: '3 Months', discount: 'Standard Rate', tag: 'Flexible' },
    { months: 6, label: '6 Months', discount: '5% OFF / mo', tag: 'Popular' },
    { months: 12, label: '12 Months', discount: '10% OFF / mo', tag: 'Best Value' },
    { months: 24, label: '24 Months', discount: '15% OFF + Free Move', tag: 'Max Savings' },
  ];

  const slotOptions = [
    'Tomorrow, 9 AM - 1 PM',
    'Tomorrow, 2 PM - 6 PM',
    'Day After Tomorrow, 9 AM - 1 PM',
    'Day After Tomorrow, 2 PM - 6 PM',
  ];

  // Fetch backend calculation when tenure / damage protection / pincode changes
  useEffect(() => {
    if (appliance && isOpen) {
      setLoadingPricing(true);
      rentalsApi.calculate({
        appliance_id: appliance.id,
        duration_months: durationMonths,
        start_date: startDate,
        damage_protection_opt_in: damageProtectionOptIn,
        delivery_pincode: deliveryPincode
      })
        .then((res) => {
          setPricing(res.data);
          setLoadingPricing(false);
        })
        .catch(() => {
          setLoadingPricing(false);
        });
    }
  }, [appliance, durationMonths, startDate, damageProtectionOptIn, deliveryPincode, isOpen]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setDurationMonths(3);
      setStartDate(new Date().toISOString().split('T')[0]);
      setDeliveryAddress(user?.address || '');
      setDeliveryPhone(user?.phone || '');
      setDeliveryCity(user?.city || 'Bangalore');
      setDeliveryPincode(user?.postal_code || '560038');
      setDamageProtectionOptIn(true);
      setCreatedRental(null);
      setCompletedPayment(null);
    }
  }, [isOpen, user]);

  if (!appliance) return null;

  const handleProceedToSummary = () => {
    if (!isAuthenticated) {
      addToast('Please login to proceed with rental booking.', 'info');
      navigate('/login');
      return;
    }
    if (!deliveryAddress || !deliveryPhone || !deliveryPincode) {
      addToast('Please provide your complete delivery address, pincode, and phone number.', 'error');
      return;
    }
    setStep(2);
  };

  const handleProceedToPayment = () => {
    setStep(3);
  };

  const handleCompletePayment = async () => {
    setProcessingPayment(true);
    try {
      // 1. Create Rental Record on Backend
      const rentalRes = await rentalsApi.createRental({
        appliance: appliance.id,
        duration_months: durationMonths,
        start_date: startDate,
        delivery_address: deliveryAddress,
        delivery_phone: deliveryPhone,
        delivery_city: deliveryCity,
        delivery_pincode: deliveryPincode,
        delivery_date_slot: deliverySlot,
        installation_required: installationRequired,
        damage_protection_opt_in: damageProtectionOptIn,
        notes: `Selected tenure: ${durationMonths} months. Scheduled slot: ${deliverySlot}.`,
      });

      const newRental = rentalRes.data;
      setCreatedRental(newRental);

      // 2. Process Initial Upfront Payment (Month 1 + Deposit + Delivery + Damage Waiver)
      const paymentRes = await paymentsApi.processPayment({
        rental_id: newRental.id,
        payment_method: paymentMethod,
        amount: pricing?.upfront_total_due || newRental.upfront_total_paid,
        gateway_token: `tok_live_${Date.now()}`,
      });

      setCompletedPayment(paymentRes.data);
      setProcessingPayment(false);
      setStep(4);

      // Confetti celebratory burst
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      addNotification(
        'Rental Booking Confirmed!',
        `Your ${appliance.name} order (${newRental.rental_id}) is confirmed. Delivery scheduled for ${deliverySlot}.`,
        'success'
      );

      if (onBookingComplete) {
        onBookingComplete(newRental);
      }
    } catch (err) {
      console.error(err);
      setProcessingPayment(false);
      const msg = err.response?.data?.error || 'Payment processing failed. Please try again.';
      addToast(msg, 'error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Rent ${appliance.name}`}
      maxWidth="780px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Step Indicator Progress Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.25rem',
          backgroundColor: '#F8FAFC',
          borderRadius: '12px',
          border: '1px solid var(--border-light)'
        }}>
          {[
            { num: 1, label: 'Tenure & Slots' },
            { num: 2, label: 'Order Summary' },
            { num: 3, label: 'Pay 1st Month' },
            { num: 4, label: 'Confirmed' },
          ].map((s) => (
            <div 
              key={s.num} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: step >= s.num ? 'var(--blue-primary)' : '#94A3B8',
                fontWeight: step === s.num ? 700 : 500,
                fontSize: '0.85rem'
              }}
            >
              <span style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: step >= s.num ? 'var(--blue-primary)' : '#E2E8F0',
                color: step >= s.num ? '#FFFFFF' : '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.78rem',
                fontWeight: 700
              }}>
                {step > s.num ? <Check size={14} /> : s.num}
              </span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* ==================================================== */}
        {/* STEP 1: TENURE SELECTION, DAMAGE PLAN & DELIVERY SLOT */}
        {/* ==================================================== */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Product Summary Header Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              padding: '1rem',
              backgroundColor: '#F1F5F9',
              borderRadius: '12px'
            }}>
              <img 
                src={appliance.image_url} 
                alt={appliance.name} 
                style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }} 
              />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase' }}>
                  {appliance.brand} • {appliance.category_name || 'Appliance'}
                </span>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy-primary)', margin: '2px 0' }}>
                  {appliance.name}
                </h4>
                <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  Deposit: <strong style={{ color: '#0F172A' }}>₹{appliance.security_deposit}</strong> (100% Refundable)
                </div>
              </div>
            </div>

            {/* 1. Tenure Selector (Rentomojo Style) */}
            <div>
              <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '0.6rem', display: 'block' }}>
                1. Select Rental Tenure (Longer commitment = Lower monthly rent)
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.75rem'
              }}>
                {tenureOptions.map((opt) => (
                  <button
                    key={opt.months}
                    type="button"
                    onClick={() => setDurationMonths(opt.months)}
                    style={{
                      padding: '1rem 0.75rem',
                      borderRadius: '12px',
                      border: durationMonths === opt.months ? '2px solid var(--blue-primary)' : '1px solid var(--border-light)',
                      backgroundColor: durationMonths === opt.months ? 'rgba(0, 196, 255, 0.08)' : '#FFFFFF',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      top: '-10px',
                      backgroundColor: durationMonths === opt.months ? 'var(--blue-primary)' : '#64748B',
                      color: '#FFFFFF',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '1px 8px',
                      borderRadius: '999px',
                      textTransform: 'uppercase'
                    }}>
                      {opt.tag}
                    </span>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--navy-primary)' }}>{opt.label}</strong>
                    <span style={{ fontSize: '0.75rem', color: durationMonths === opt.months ? 'var(--blue-primary)' : '#10B981', fontWeight: 600 }}>
                      {opt.discount}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Damage Protection Plan Opt-In */}
            <div style={{
              padding: '1rem 1.25rem',
              backgroundColor: '#EFF6FF',
              borderRadius: '12px',
              border: '1px solid #BFDBFE',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem'
            }}>
              <input 
                type="checkbox" 
                id="damageProtection"
                checked={damageProtectionOptIn}
                onChange={(e) => setDamageProtectionOptIn(e.target.checked)}
                style={{ width: '20px', height: '20px', marginTop: '2px', cursor: 'pointer' }}
              />
              <label htmlFor="damageProtection" style={{ cursor: 'pointer', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.92rem', color: '#1E40AF', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <ShieldCheck size={18} /> Add ApplineX Damage Protection Plan
                  </strong>
                  <span style={{ fontWeight: 700, color: '#1E40AF', fontSize: '0.88rem' }}>+₹99/month</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#3B82F6', marginTop: '0.25rem', lineHeight: 1.4 }}>
                  Covers accidental scratches, spills, electrical surges, and wear & tear up to <strong>₹5,000</strong>. Zero deduction upon return.
                </p>
              </label>
            </div>

            {/* 3. Delivery Details & Pincode Serviceability */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                  Delivery Address <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Flat No, Building, Street, Area"
                  required
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                  Contact Phone Number <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input 
                  type="tel" 
                  className="form-control" 
                  value={deliveryPhone}
                  onChange={(e) => setDeliveryPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                  Delivery City & Pincode <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select 
                    className="form-control" 
                    value={deliveryCity} 
                    onChange={(e) => setDeliveryCity(e.target.value)}
                    style={{ flex: 1 }}
                  >
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi-NCR">Delhi-NCR</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                    <option value="Chennai">Chennai</option>
                  </select>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={deliveryPincode}
                    onChange={(e) => setDeliveryPincode(e.target.value)}
                    placeholder="Pincode"
                    style={{ width: '100px' }}
                  />
                </div>
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                  Preferred Delivery & Setup Slot
                </label>
                <select 
                  className="form-control"
                  value={deliverySlot}
                  onChange={(e) => setDeliverySlot(e.target.value)}
                >
                  {slotOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. Free Installation Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.82rem',
              color: '#059669',
              backgroundColor: '#ECFDF5',
              padding: '0.65rem 1rem',
              borderRadius: '8px'
            }}>
              <Wrench size={16} />
              <span><strong>Free Professional Installation:</strong> Technician will unpack, connect, and test the appliance during delivery.</span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={handleProceedToSummary}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                Continue to Summary <ArrowRight size={16} />
              </button>
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* STEP 2: ORDER SUMMARY (UPFRONT VS MONTHLY RENT BREAKDOWN) */}
        {/* ==================================================== */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid var(--border-light)',
              padding: '1.5rem'
            }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '1.25rem' }}>
                Rental Payment Breakdown (Rentomojo Standard)
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Monthly Base Rent ({durationMonths} Month Tenure):</span>
                  <span>₹{pricing?.base_monthly_price}/mo</span>
                </div>
                {pricing?.discount_percent > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', fontWeight: 600 }}>
                    <span>Tenure Discount ({pricing.discount_percent}% OFF):</span>
                    <span>-₹{Math.round(pricing.base_monthly_price * pricing.discount_percent / 100)}/mo</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--navy-primary)', fontWeight: 600 }}>
                  <span>Effective 1st Month Rent:</span>
                  <span>₹{pricing?.first_month_rent}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Refundable Security Deposit:</span>
                  <span>₹{pricing?.security_deposit}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Delivery & Professional Setup:</span>
                  <span style={{ color: pricing?.delivery_fee === 0 ? '#10B981' : 'inherit', fontWeight: 600 }}>
                    {pricing?.delivery_fee === 0 ? 'FREE (₹0)' : `₹${pricing?.delivery_fee}`}
                  </span>
                </div>
                {damageProtectionOptIn && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2563EB' }}>
                    <span>Damage Protection Plan:</span>
                    <span>₹{pricing?.damage_protection_fee}</span>
                  </div>
                )}
                
                <div style={{ height: '1px', backgroundColor: 'var(--border-light)', margin: '0.5rem 0' }} />
                
                {/* Total Payable Today Highlight */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: 'var(--navy-primary)',
                  backgroundColor: '#FFFFFF',
                  padding: '1rem',
                  borderRadius: '10px',
                  border: '2px solid var(--blue-primary)'
                }}>
                  <div>
                    <div>Total Due Today at Checkout</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 400 }}>
                      Includes 1st Month Rent + 100% Refundable Deposit
                    </div>
                  </div>
                  <div style={{ color: 'var(--blue-primary)', fontSize: '1.4rem' }}>
                    ₹{pricing?.upfront_total_due}
                  </div>
                </div>

                <div style={{
                  fontSize: '0.82rem',
                  color: '#64748B',
                  backgroundColor: '#F1F5F9',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  marginTop: '0.5rem'
                }}>
                  📌 <strong>Subsequent Monthly Payments:</strong> Starting from Month 2, you will be billed <strong>₹{pricing?.monthly_recurring_due}/month</strong> via recurring auto-pay invoice.
                </div>
              </div>
            </div>

            {/* Delivery & KYC Confirmation Note */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: '#F0FDF4',
              padding: '0.85rem 1.25rem',
              borderRadius: '10px',
              border: '1px solid #BBF7D0',
              fontSize: '0.85rem',
              color: '#166534'
            }}>
              <CheckCircle2 size={20} color="#16A34A" />
              <div>
                <strong>Delivery Scheduled:</strong> {deliverySlot} to <strong>{deliveryCity} ({deliveryPincode})</strong>. Digital KYC instant approval active.
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                Back
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={handleProceedToPayment}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                Proceed to Pay ₹{pricing?.upfront_total_due} <ArrowRight size={16} />
              </button>
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* STEP 3: PAYMENT GATEWAY (MOCK / LIVE COMPLIANT) */}
        {/* ==================================================== */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem 1.25rem',
              backgroundColor: '#EFF6FF',
              borderRadius: '10px',
              border: '1px solid #BFDBFE'
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#1E40AF', textTransform: 'uppercase', fontWeight: 700 }}>
                  Amount to Pay Now
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E3A8A' }}>
                  ₹{pricing?.upfront_total_due}
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#3B82F6' }}>
                <Lock size={16} style={{ display: 'inline', marginRight: '4px' }} /> 256-Bit SSL Encrypted
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                Select Payment Mode
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                {[
                  { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard size={18} /> },
                  { id: 'upi', label: 'UPI / GooglePay / PhonePe', icon: <Zap size={18} /> },
                  { id: 'netbanking', label: 'Net Banking', icon: <FileText size={18} /> },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    style={{
                      padding: '0.85rem',
                      borderRadius: '10px',
                      border: paymentMethod === m.id ? '2px solid var(--blue-primary)' : '1px solid var(--border-light)',
                      backgroundColor: paymentMethod === m.id ? 'rgba(0, 196, 255, 0.08)' : '#FFFFFF',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--navy-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    {m.icon} {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Card Inputs */}
            {paymentMethod === 'card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Card Number</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={cardNumber} 
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.82rem' }}>Expiry Date</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={cardExpiry} 
                      onChange={(e) => setCardExpiry(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.82rem' }}>CVV</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      value={cardCvv} 
                      onChange={(e) => setCardCvv(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '10px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.5rem' }}>
                  Enter your UPI ID (VPA) to receive an instant AutoPay authorization request:
                </p>
                <input 
                  type="text" 
                  className="form-control" 
                  defaultValue={`${user?.username || 'customer'}@okhdfcbank`} 
                  style={{ maxWidth: '320px', margin: '0 auto', textAlign: 'center' }}
                />
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setStep(2)} disabled={processingPayment}>
                Back
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={handleCompletePayment}
                disabled={processingPayment}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {processingPayment ? 'Authorizing Payment...' : `Pay ₹${pricing?.upfront_total_due} & Activate`}
              </button>
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* STEP 4: BOOKING CONFIRMED & RECEIPT */}
        {/* ==================================================== */}
        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#DCFCE7',
              color: '#16A34A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
              Rental Confirmed & Activated!
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.35rem', marginBottom: '1.5rem' }}>
              Booking ID: <strong style={{ color: 'var(--blue-primary)' }}>{createdRental?.rental_id}</strong>
            </p>

            <div style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              padding: '1.25rem',
              textAlign: 'left',
              border: '1px solid var(--border-light)',
              marginBottom: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              fontSize: '0.88rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Appliance:</span>
                <strong>{appliance.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Duration:</span>
                <span>{durationMonths} Months</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Delivery Slot:</span>
                <span style={{ color: '#0284C7', fontWeight: 600 }}>{deliverySlot}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Amount Paid (Month 1 + Deposit):</span>
                <span style={{ color: '#16A34A', fontWeight: 700 }}>₹{createdRental?.upfront_total_paid}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => printReceipt(createdRental, completedPayment, appliance)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Download size={16} /> Download Tax Invoice Receipt
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => {
                  onClose();
                  navigate('/customer/dashboard');
                }}
              >
                Go to My Rentals Dashboard
              </button>
            </div>

          </div>
        )}

      </div>
    </Modal>
  );
};

export default RentalBookingModal;
