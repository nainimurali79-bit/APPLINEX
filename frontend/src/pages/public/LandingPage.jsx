import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { appliancesApi, aiApi } from '../../services/api';
import ApplianceCard from '../../components/appliances/ApplianceCard';
import RentalBookingModal from '../../components/customer/RentalBookingModal';
import StarRating from '../../components/common/StarRating';
import { 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  Truck, 
  Wrench, 
  RefreshCw, 
  CheckCircle2, 
  Star, 
  Zap, 
  Box, 
  Users, 
  TrendingUp, 
  Sliders 
} from 'lucide-react';

const LandingPage = () => {
  const [featuredAppliances, setFeaturedAppliances] = useState([]);
  const [categories, setCategories] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [selectedAppliance, setSelectedAppliance] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch featured appliances
    appliancesApi.getAppliances({ featured: 'true' })
      .then((res) => setFeaturedAppliances(res.data.slice(0, 6)))
      .catch((err) => console.error(err));

    // Fetch categories
    appliancesApi.getCategories()
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));

    // Fetch AI recommendations
    aiApi.getRecommendations()
      .then((res) => setAiRecommendations(res.data.slice(0, 3)))
      .catch((err) => console.error(err));
  }, []);

  const handleRentClick = (appliance) => {
    setSelectedAppliance(appliance);
    setBookingModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      
      {/* 1. HERO SECTION matching reference */}
      <section style={{
        background: 'linear-gradient(180deg, #0B192C 0%, #0F223D 100%)',
        color: '#FFFFFF',
        padding: '4.5rem 0 5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background glow ambient circles */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(30, 96, 213, 0.25) 0%, rgba(11, 25, 44, 0) 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 196, 255, 0.15) 0%, rgba(11, 25, 44, 0) 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center'
          }}>
            
            {/* Left Hero Content */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(0, 196, 255, 0.12)',
                border: '1px solid rgba(0, 196, 255, 0.3)',
                padding: '0.4rem 0.9rem',
                borderRadius: '9999px',
                color: '#00C4FF',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                marginBottom: '1.25rem'
              }}>
                <Sparkles size={15} /> NEXT-GEN APPLIANCE RENTALS
              </div>

              <h1 style={{
                fontSize: 'clamp(2.3rem, 4vw, 3.4rem)',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.15,
                marginBottom: '1.25rem',
                letterSpacing: '-0.02em'
              }}>
                Rent Household Appliances <br />
                <span style={{
                  background: 'linear-gradient(90deg, #00C4FF 0%, #38BDF8 50%, #818CF8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Easily & Smartly
                </span>
              </h1>

              <p style={{
                fontSize: '1.1rem',
                color: '#CBD5E1',
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '540px'
              }}>
                Experience premium smart living without high upfront purchase costs. Flexible tenures, AI-powered matching, zero maintenance fees, and free doorstep installation.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                <Link 
                  to="/appliances" 
                  className="btn btn-primary btn-lg"
                  style={{ textDecoration: 'none', boxShadow: '0 4px 20px rgba(30, 96, 213, 0.5)' }}
                >
                  Browse Appliances <ArrowRight size={18} />
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-lg"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    color: '#FFFFFF', 
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    textDecoration: 'none'
                  }}
                >
                  Get Started Free
                </Link>
              </div>

              {/* Hero Micro Stats */}
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>15,000+</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Active Happy Homes</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#00C4FF' }}>99.4%</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>On-Time Setup</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10B981' }}>₹0 Fee</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Free Maintenance</div>
                </div>
              </div>

            </div>

            {/* Right Hero Showcase Visual matching reference composition */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative'
            }}>
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '480px',
                background: 'linear-gradient(135deg, rgba(20, 44, 78, 0.8) 0%, rgba(11, 25, 44, 0.95) 100%)',
                borderRadius: '24px',
                border: '1px solid rgba(0, 196, 255, 0.3)',
                padding: '2rem',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 0 30px rgba(30, 96, 213, 0.2)'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.8rem', color: '#00C4FF', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                    FEATURED SMART SUITE
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
                    Samsung Double Door Inverter 340L
                  </div>
                </div>

                <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <img
                    src="https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&auto=format&fit=crop&q=80"
                    alt="Premium Smart Refrigerator"
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.6))'
                    }}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase' }}>Monthly Rate</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#00C4FF' }}>₹1,499 <span style={{ fontSize: '0.75rem', color: '#FFFFFF', fontWeight: 400 }}>/mo</span></div>
                  </div>
                  <Link
                    to="/appliances/1"
                    className="btn btn-primary btn-sm"
                    style={{ textDecoration: 'none' }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container-custom">
          
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
              EXPLORE OUR RANGE
            </div>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
              Appliance Categories
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
              Choose from top-tier brands and models tailored for modern, comfortable living.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem'
          }}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/appliances?category=${cat.slug}`}
                className="app-card app-card-hover"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--blue-subtle)',
                  color: 'var(--blue-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Box size={26} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '2px' }}>
                    {cat.name}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    {cat.appliances_count || 4} Models Available
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* 3. FEATURED APPLIANCES SECTION */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--bg-main)' }}>
        <div className="container-custom">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
                TOP RENTALS
              </div>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
                Featured Appliances
              </h2>
            </div>
            <Link to="/appliances" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, fontSize: '0.92rem' }}>
              View All Appliances <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.75rem'
          }}>
            {featuredAppliances.map((appliance) => (
              <ApplianceCard
                key={appliance.id}
                appliance={appliance}
                onRentClick={handleRentClick}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 4. WHY APPLINEX & VALUE PROPOSITION */}
      <section id="why-applinex" style={{ padding: '5rem 0', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container-custom">
          
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
              THE APPLINEX ADVANTAGE
            </div>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
              Why Choose APPLINEX?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
              Renting smart appliances gives you maximum freedom, financial flexibility, and zero depreciation burden.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem'
          }}>
            
            <div className="app-card" style={{ padding: '2rem 1.75rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--blue-subtle)', color: 'var(--blue-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Wrench size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '0.6rem' }}>
                100% Free Maintenance
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6 }}>
                Full warranty coverage with free routine servicing, gas charging, filter replacements, and breakdown fixes.
              </p>
            </div>

            <div className="app-card" style={{ padding: '2rem 1.75rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--cyan-subtle)', color: '#00ACDF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Truck size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '0.6rem' }}>
                Free Doorstep Installation
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6 }}>
                Certified technicians deliver, unpack, install, and test your appliance to perfection at your convenient slot.
              </p>
            </div>

            <div className="app-card" style={{ padding: '2rem 1.75rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--ai-purple-subtle)', color: 'var(--ai-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '0.6rem' }}>
                AI Demand & Smart Upgrades
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6 }}>
                Easily upgrade to newest flagship models whenever your needs change without locking up your capital.
              </p>
            </div>

            <div className="app-card" style={{ padding: '2rem 1.75rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--success-subtle)', color: 'var(--success-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '0.6rem' }}>
                Flexible Tenures & Returns
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6 }}>
                Rent from 1 to 12 months with up to 15% tier discounts. Simple hassle-free returns with full deposit refund.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. SMART RECOMMENDATIONS AI SPOTLIGHT */}
      {aiRecommendations.length > 0 && (
        <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--bg-main)' }}>
          <div className="container-custom">
            
            <div style={{
              background: 'linear-gradient(135deg, #0F223D 0%, #1A1438 100%)',
              borderRadius: '20px',
              padding: '3rem 2.5rem',
              color: '#FFFFFF',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              boxShadow: 'var(--shadow-glow-ai)'
            }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    backgroundColor: 'rgba(124, 58, 237, 0.25)',
                    color: '#C084FC',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    marginBottom: '0.5rem'
                  }}>
                    <Sparkles size={14} /> AI INTELLIGENCE ENGINE
                  </div>
                  <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#FFFFFF' }}>
                    Smart Appliance Recommendations
                  </h2>
                  <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginTop: '4px' }}>
                    Based on top energy ratings, customer satisfaction, and lifestyle matching.
                  </p>
                </div>
                <Link
                  to="/dashboard/recommendations"
                  className="btn btn-ai"
                  style={{ textDecoration: 'none' }}
                >
                  View All AI Insights <ArrowRight size={16} />
                </Link>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem'
              }}>
                {aiRecommendations.map((item, idx) => (
                  <ApplianceCard
                    key={item.appliance.id || idx}
                    appliance={item.appliance}
                    onRentClick={handleRentClick}
                    isAiRecommended={true}
                    matchScore={item.match_percentage}
                  />
                ))}
              </div>

            </div>

          </div>
        </section>
      )}

      {/* 6. HOW APPLINEX WORKS (3 SIMPLE STEPS) */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#FFFFFF' }}>
        <div className="container-custom">
          
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
              SIMPLE 3-STEP PROCESS
            </div>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
              How APPLINEX Works
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            
            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--blue-subtle)',
                color: 'var(--blue-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontSize: '1.5rem',
                fontWeight: 800,
                boxShadow: '0 4px 12px rgba(30, 96, 213, 0.2)'
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '0.5rem' }}>
                Select Your Appliance
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
                Browse our catalog of verified smart refrigerators, washers, ACs, and kitchen tech.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--cyan-subtle)',
                color: '#00ACDF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontSize: '1.5rem',
                fontWeight: 800,
                boxShadow: '0 4px 12px rgba(0, 196, 255, 0.2)'
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '0.5rem' }}>
                Choose Tenure & Dates
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
                Select your rental duration (1 to 12 months) with transparent automatic tier discount calculation.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--success-subtle)',
                color: 'var(--success-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontSize: '1.5rem',
                fontWeight: 800,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '0.5rem' }}>
                Doorstep Delivery & Setup
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
                Our team delivers, sets up, and verifies operation. Track everything live in your dashboard.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS & TESTIMONIALS */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--bg-main)' }}>
        <div className="container-custom">
          
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
              CUSTOMER SATISFACTION
            </div>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
              Trusted by 15,000+ Renters
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.75rem'
          }}>
            
            <div className="app-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                    alt="John Doe"
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--navy-primary)' }}>John Doe</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Indiranagar, Bangalore</div>
                  </div>
                </div>
                <StarRating rating={5} size={15} />
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                "Renting the Samsung 340L Refrigerator was effortless. Technician delivered on time and set it up smoothly. Cooling is superb!"
              </p>
              <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--blue-primary)', fontWeight: 600 }}>
                Rented: Samsung Smart Refrigerator 340L
              </div>
            </div>

            <div className="app-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"
                    alt="Priya Sharma"
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--navy-primary)' }}>Priya Sharma</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Koramangala, Bangalore</div>
                  </div>
                </div>
                <StarRating rating={5} size={15} />
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                "The LG AI Direct Drive washer has saved us so much time and effort. Zero maintenance worries and transparent monthly billing."
              </p>
              <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--blue-primary)', fontWeight: 600 }}>
                Rented: LG Front Load Smart Washer 8kg
              </div>
            </div>

            <div className="app-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                    alt="Rahul Verma"
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--navy-primary)' }}>Rahul Verma</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Whitefield, Bangalore</div>
                  </div>
                </div>
                <StarRating rating={5} size={15} />
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                "Daikin 1.5 Ton AC saved us through peak summer heat. Excellent cooling and customer support answered our ticket in 10 minutes."
              </p>
              <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--blue-primary)', fontWeight: 600 }}>
                Rented: Daikin 1.5 Ton Split Inverter AC
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. CALL TO ACTION STRIP */}
      <section style={{
        background: 'linear-gradient(135deg, #1E60D5 0%, #0F223D 100%)',
        color: '#FFFFFF',
        padding: '3.5rem 0',
        textAlign: 'center'
      }}>
        <div className="container-custom" style={{ maxWidth: '750px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem' }}>
            Ready to Upgrade Your Living Space?
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#CBD5E1', marginBottom: '1.75rem' }}>
            Join thousands of smart renters who enjoy high-end appliances with complete peace of mind.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/appliances" className="btn btn-lg" style={{ backgroundColor: '#00C4FF', color: 'var(--navy-primary)', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 15px rgba(0, 196, 255, 0.4)' }}>
              Explore Catalog Now
            </Link>
            <Link to="/register" className="btn btn-lg" style={{ backgroundColor: '#FFFFFF', color: '#0B192C', fontWeight: 700, border: '2px solid #FFFFFF', textDecoration: 'none', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' }}>
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Booking Modal */}
      {selectedAppliance && (
        <RentalBookingModal
          isOpen={bookingModalOpen}
          onClose={() => {
            setBookingModalOpen(false);
            setSelectedAppliance(null);
          }}
          appliance={selectedAppliance}
          onBookingComplete={() => {
            // refresh data if needed
          }}
        />
      )}

    </div>
  );
};

export default LandingPage;
