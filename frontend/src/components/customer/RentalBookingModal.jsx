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
  Lock
} from 'lucide-react';

const RentalBookingModal = ({ isOpen, onClose, appliance, onBookingComplete }) => {
  const { user, isAuthenticated } = useAuth();
  const { addToast, addNotification } = useNotification();
  const navigate = useNavigate();

  // Booking Flow Steps: 1: Duration & Dates -> 2: Summary -> 3: Payment -> 4: Confirmed
  const [step, setStep] = useState(1);
  const [durationMonths, setDurationMonths] = useState(3);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  
  // Delivery details
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [deliveryPhone, setDeliveryPhone] = useState(user?.phone || '');
  const [deliveryCity, setDeliveryCity] = useState(user?.city || 'Bangalore');

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

  // Fetch backend calculation when duration/startDate/appliance changes
  useEffect(() => {
    if (appliance && isOpen) {
      setLoadingPricing(true);
      rentalsApi.calculate({
        appliance_id: appliance.id,
        duration_months: durationMonths,
        start_date: startDate,
      })
        .then((res) => {
          setPricing(res.data);
          setLoadingPricing(false);
        })
        .catch(() => {
          setLoadingPricing(false);
        });
    }
  }, [appliance, durationMonths, startDate, isOpen]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setDurationMonths(3);
      setStartDate(new Date().toISOString().split('T')[0]);
      setDeliveryAddress(user?.address || '');
      setDeliveryPhone(user?.phone || '');
      setDeliveryCity(user?.city || 'Bangalore');
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
    setStep(2);
  };

  const handleProceedToPayment = () => {
    if (!deliveryAddress || !deliveryPhone) {
      addToast('Please provide delivery address and contact phone number.', 'error');
      return;
    }
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
        notes: `Selected duration: ${durationMonths} months.`,
      });

      const newRental = rentalRes.data;
      setCreatedRental(newRental);

      // 2. Process Real Payment on Backend
      const paymentRes = await paymentsApi.processPayment({
        rental_id: newRental.id,
        payment_method: paymentMethod,
        gateway_token: `tok_live_${Date.now()}`,
      });

      setCompletedPayment(paymentRes.data);
      setProcessingPayment(false);
      setStep(4);

      // Confetti celebratory burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      addNotification(
        'Rental Confirmed!',
        `Your rental for ${appliance.name} (${newRental.rental_id}) is active.`,
        'success'
      );

      if (onBookingComplete) {
        onBookingComplete(newRental);
      }
    } catch (err) {
      setProcessingPayment(false);
      const errMsg = err.response?.data?.error || 'Payment transaction failed. Please try again.';
      addToast(errMsg, 'error');
    }
  };

  const handleDownloadReceipt = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 4 ? "Rental Confirmed!" : `Rent ${appliance.name}`}
      subtitle={step === 4 ? "Your appliance order has been verified & scheduled." : `Step ${step} of 3 • ${appliance.brand}`}
      maxWidth={step === 4 ? "580px" : "640px"}
    >
      {/* Step Indicator Header */}
      {step < 4 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border-light)'
        }}>
          {[
            { num: 1, label: 'Choose Duration' },
            { num: 2, label: 'Rental Summary' },
            { num: 3, label: 'Payment' },
          ].map((s) => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: step >= s.num ? 'var(--blue-primary)' : '#E2E8F0',
                color: step >= s.num ? '#FFFFFF' : '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 700
              }}>
                {step > s.num ? <CheckCircle2 size={16} /> : s.num}
              </div>
              <span style={{
                fontSize: '0.82rem',
                fontWeight: step === s.num ? 700 : 500,
                color: step === s.num ? 'var(--navy-primary)' : '#64748B'
              }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* STEP 1: CHOOSE DURATION & DATES */}
      {step === 1 && (
        <div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
            <img src={appliance.image_url} alt={appliance.name} style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy-primary)' }}>{appliance.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Code: {appliance.appliance_code} • {appliance.category_name}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--blue-primary)', marginTop: '2px' }}>
                ₹{parseInt(appliance.monthly_price).toLocaleString()} /month
              </div>
            </div>
          </div>

          <label className="form-label" style={{ fontWeight: 700, marginBottom: '0.75rem' }}>
            Select Rental Duration Tier
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {[
              { months: 1, label: '1 Month', discount: 'Base Price', badge: null },
              { months: 3, label: '3 Months', discount: 'Save 5% + Free Delivery', badge: 'Popular' },
              { months: 6, label: '6 Months', discount: 'Save 10% + Free Delivery', badge: 'Best Value' },
              { months: 12, label: '12 Months', discount: 'Save 15% Max Savings', badge: 'Super Saver' },
            ].map((tier) => (
              <div
                key={tier.months}
                onClick={() => setDurationMonths(tier.months)}
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  border: durationMonths === tier.months ? '2px solid var(--blue-primary)' : '1px solid var(--border-medium)',
                  backgroundColor: durationMonths === tier.months ? '#EFF6FF' : '#FFFFFF',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {tier.badge && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '10px',
                    backgroundColor: durationMonths === tier.months ? 'var(--blue-primary)' : '#64748B',
                    color: '#FFFFFF',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    {tier.badge}
                  </span>
                )}
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--navy-primary)' }}>{tier.label}</div>
                <div style={{ fontSize: '0.75rem', color: durationMonths === tier.months ? 'var(--blue-primary)' : '#64748B', marginTop: '2px', fontWeight: 500 }}>
                  {tier.discount}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Rental Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Calculated End Date</label>
              <input
                type="text"
                className="form-control"
                value={pricing?.end_date || 'Calculating...'}
                readOnly
                style={{ backgroundColor: '#F1F5F9' }}
              />
            </div>
          </div>

          <button
            onClick={handleProceedToSummary}
            className="btn btn-primary btn-block btn-lg"
          >
            Review Rental Summary <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* STEP 2: RENTAL SUMMARY & DELIVERY INFO */}
      {step === 2 && pricing && (
        <div>
          <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-light)', marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--navy-primary)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Cost Breakdown
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Base Monthly Rate:</span>
                <span>₹{pricing.base_monthly_price.toLocaleString()}</span>
              </div>
              {pricing.discount_percent > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 600 }}>
                  <span>Tier Duration Discount ({pricing.discount_percent}%):</span>
                  <span>-₹{((pricing.base_monthly_price - pricing.effective_monthly_price) * pricing.duration_months).toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Effective Monthly Rent:</span>
                <span style={{ fontWeight: 600 }}>₹{pricing.effective_monthly_price.toLocaleString()} × {pricing.duration_months} mo</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Rental Subtotal:</span>
                <span style={{ fontWeight: 600 }}>₹{pricing.subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Delivery & Professional Setup:</span>
                <span>{pricing.delivery_fee === 0 ? <strong style={{ color: '#059669' }}>FREE</strong> : `₹${pricing.delivery_fee}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Refundable Security Deposit:</span>
                <span>₹{pricing.security_deposit.toLocaleString()}</span>
              </div>
              <div style={{ height: '1px', backgroundColor: 'var(--border-medium)', margin: '0.35rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
                <span>Total Payable Now:</span>
                <span style={{ color: 'var(--blue-primary)' }}>₹{pricing.total_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--navy-primary)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
            Delivery Information
          </h4>
          <div className="form-group">
            <label className="form-label">Delivery Street Address</label>
            <input
              type="text"
              className="form-control"
              placeholder="Flat No, Building, Street, Landmark"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Contact Phone</label>
              <input
                type="tel"
                className="form-control"
                placeholder="+91 98765 43210"
                value={deliveryPhone}
                onChange={(e) => setDeliveryPhone(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                value={deliveryCity}
                onChange={(e) => setDeliveryCity(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => setStep(1)} className="btn btn-secondary" style={{ flex: 1 }}>
              Back
            </button>
            <button onClick={handleProceedToPayment} className="btn btn-primary btn-lg" style={{ flex: 2 }}>
              Proceed to Payment (₹{pricing.total_amount.toLocaleString()}) <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PAYMENT GATEWAY SELECTION */}
      {step === 3 && pricing && (
        <div>
          <div style={{
            backgroundColor: '#0F223D',
            color: '#FFFFFF',
            padding: '1rem 1.25rem',
            borderRadius: '10px',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Amount to Pay</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#00C4FF' }}>
                ₹{pricing.total_amount.toLocaleString()}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#10B981' }}>
              <Lock size={14} /> 256-Bit SSL Encrypted
            </div>
          </div>

          <label className="form-label" style={{ fontWeight: 700, marginBottom: '0.6rem' }}>
            Choose Payment Method
          </label>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {[
              { id: 'card', label: 'Card Payment', icon: CreditCard },
              { id: 'upi', label: 'UPI / QR', icon: Zap },
              { id: 'razorpay', label: 'Razorpay', icon: ShieldCheck },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setPaymentMethod(m.id)}
                style={{
                  padding: '0.85rem 0.5rem',
                  borderRadius: '8px',
                  border: paymentMethod === m.id ? '2px solid var(--blue-primary)' : '1px solid var(--border-medium)',
                  backgroundColor: paymentMethod === m.id ? '#EFF6FF' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <m.icon size={20} color={paymentMethod === m.id ? 'var(--blue-primary)' : '#64748B'} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--navy-primary)' }}>{m.label}</span>
              </button>
            ))}
          </div>

          {paymentMethod === 'card' && (
            <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-light)', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Card Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Expires (MM/YY)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">CVV</label>
                  <input
                    type="password"
                    className="form-control"
                    maxLength="4"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="•••"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'upi' && (
            <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-light)', marginBottom: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.5rem' }}>
                Enter UPI ID (Google Pay, PhonePe, Paytm, BHIM)
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="user@upi / 9876543210@paytm"
                defaultValue={`${user?.email?.split('@')[0] || 'customer'}@oksbi`}
                style={{ textAlign: 'center', fontWeight: 600 }}
              />
            </div>
          )}

          {paymentMethod === 'razorpay' && (
            <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-light)', marginBottom: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                Razorpay Standard Gateway Checkout will verify instant transaction settlement.
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => setStep(2)} className="btn btn-secondary" style={{ flex: 1 }}>
              Back
            </button>
            <button
              onClick={handleCompletePayment}
              disabled={processingPayment}
              className="btn btn-primary btn-lg"
              style={{ flex: 2 }}
            >
              {processingPayment ? 'Verifying Transaction...' : `Pay ₹${pricing.total_amount.toLocaleString()}`}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: CONFIRMATION & RECEIPT */}
      {step === 4 && (
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#ECFDF5',
            color: '#10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            border: '2px solid #A7F3D0'
          }}>
            <CheckCircle2 size={36} />
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-primary)', marginBottom: '0.35rem' }}>
            Rental Confirmed!
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '1.5rem' }}>
            Your rental agreement is active and the appliance dispatch is scheduled.
          </p>

          <div style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '12px',
            border: '1px solid var(--border-light)',
            padding: '1.25rem',
            textAlign: 'left',
            marginBottom: '1.5rem',
            fontSize: '0.88rem'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase' }}>Rental ID</div>
                <div style={{ fontWeight: 700, color: 'var(--blue-primary)' }}>{createdRental?.rental_id || 'RN-2024-000123'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase' }}>Transaction Ref</div>
                <div style={{ fontWeight: 600 }}>{completedPayment?.transaction_reference || 'TXN-APX-0801'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase' }}>Appliance</div>
                <div style={{ fontWeight: 600 }}>{appliance.name}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase' }}>Duration</div>
                <div style={{ fontWeight: 600 }}>{durationMonths} Month(s)</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase' }}>Start Date</div>
                <div>{startDate}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase' }}>Total Amount Paid</div>
                <div style={{ fontWeight: 800, color: '#059669' }}>₹{pricing?.total_amount?.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              onClick={() => {
                onClose();
                navigate(`/dashboard/rentals/${createdRental?.id || 1}`);
              }}
              className="btn btn-primary"
            >
              Track Rental Live
            </button>
            <button
              onClick={handleDownloadReceipt}
              className="btn btn-secondary"
            >
              <Download size={16} /> Download Receipt
            </button>
          </div>
        </div>
      )}

    </Modal>
  );
};

export default RentalBookingModal;
