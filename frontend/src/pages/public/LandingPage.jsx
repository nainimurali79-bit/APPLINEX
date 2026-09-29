import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { appliancesApi, aiApi } from '../../services/api';
import ApplianceCard from '../../components/appliances/ApplianceCard';
import RentalBookingModal from '../../components/customer/RentalBookingModal';
import QuickViewModal from '../../components/appliances/QuickViewModal';
import ApplianceComparisonDrawer from '../../components/appliances/ApplianceComparisonDrawer';
import RentVsBuyCalculator from '../../components/appliances/RentVsBuyCalculator';
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
  Sliders,
  Layers,
  Calculator,
  Laptop,
  PackageCheck,
  Volume2,
  Coffee,
  Tv,
  Wind,
  Droplets,
  Flame,
  Activity,
  Fan,
  Thermometer,
  Disc,
  Feather,
  Shirt
} from 'lucide-react';

const LandingPage = () => {
  const [featuredAppliances, setFeaturedAppliances] = useState([]);
  const [categories, setCategories] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [selectedAppliance, setSelectedAppliance] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [quickViewAppliance, setQuickViewAppliance] = useState(null);
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
            maxWidth: '860px',
            margin: '0 auto',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            
            {/* Hero Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(0, 196, 255, 0.12)',
              border: '1px solid rgba(0, 196, 255, 0.3)',
              padding: '0.45rem 1.1rem',
              borderRadius: '9999px',
              color: '#00C4FF',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              marginBottom: '1.5rem',
              boxShadow: '0 0 20px rgba(0, 196, 255, 0.15)'
            }}>
              <Sparkles size={16} /> NEXT-GEN APPLIANCE RENTALS
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5.2vw, 4.2rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.15,
              marginBottom: '1.5rem',
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

            {/* Subheading */}
            <p style={{
              fontSize: '1.18rem',
              color: '#CBD5E1',
              lineHeight: 1.65,
              marginBottom: '2.5rem',
              maxWidth: '680px'
            }}>
              Experience premium smart living without high upfront purchase costs. Flexible tenures, AI-powered matching, zero maintenance fees, and free doorstep installation.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '3rem' }}>
              <Link 
                to="/appliances" 
                className="btn btn-primary btn-lg"
                style={{ 
                  textDecoration: 'none', 
                  boxShadow: '0 4px 25px rgba(30, 96, 213, 0.6)',
                  padding: '0.85rem 2rem',
                  fontSize: '1.05rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                Browse Appliances <ArrowRight size={18} />
              </Link>
              <Link 
                to="/register" 
                className="btn btn-lg"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                  color: '#FFFFFF', 
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  textDecoration: 'none',
                  padding: '0.85rem 2rem',
                  fontSize: '1.05rem',
                  backdropFilter: 'blur(8px)'
                }}
              >
                Get Started Free
              </Link>
            </div>

            {/* Hero Micro Stats Bar */}
            <div style={{
              display: 'flex',
              gap: '2.5rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '1.25rem 2.5rem',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF' }}>15,000+</div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>Active Happy Homes</div>
              </div>
              <div style={{ width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.12)', alignSelf: 'stretch' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#00C4FF' }}>99.4%</div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>On-Time Setup</div>
              </div>
              <div style={{ width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.12)', alignSelf: 'stretch' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10B981' }}>₹0 Fee</div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>Free Maintenance</div>
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            {categories.map((cat) => {
              const getCategoryStyle = (slug) => {
                switch(slug) {
                  case 'refrigerators':
                    return { icon: <Box size={26} />, bg: '#EFF6FF', color: '#1D4ED8' };
                  case 'washing-machines':
                    return { icon: <Shirt size={26} />, bg: '#F0FDF4', color: '#15803D' };
                  case 'air-conditioners':
                    return { icon: <Wind size={26} />, bg: '#E0F2FE', color: '#0284C7' };
                  case 'smart-tvs':
                    return { icon: <Tv size={26} />, bg: '#EEF2FF', color: '#4F46E5' };
                  case 'ro-dispensers':
                    return { icon: <Droplets size={26} />, bg: '#ECFEFF', color: '#0891B2' };
                  case 'microwaves-ovens':
                    return { icon: <Flame size={26} />, bg: '#FFF1F2', color: '#E11D48' };
                  case 'induction-cooktops':
                    return { icon: <Zap size={26} />, bg: '#FEF3C7', color: '#D97706' };
                  case 'air-purifiers':
                    return { icon: <Activity size={26} />, bg: '#DCFCE7', color: '#16A34A' };
                  case 'air-coolers':
                    return { icon: <Fan size={26} />, bg: '#E0F7FA', color: '#00838F' };
                  case 'vacuum-cleaners':
                    return { icon: <Sparkles size={26} />, bg: '#FAF5FF', color: '#7E22CE' };
                  case 'dishwashers':
                    return { icon: <Sparkles size={26} />, bg: '#F1F5F9', color: '#475569' };
                  case 'water-heaters':
                    return { icon: <Thermometer size={26} />, bg: '#FFF7ED', color: '#C2410C' };
                  case 'small-kitchen':
                    return { icon: <Coffee size={26} />, bg: '#FFEDD5', color: '#EA580C' };
                  case 'fans':
                    return { icon: <Disc size={26} />, bg: '#F3F4F6', color: '#374151' };
                  case 'irons-steamers':
                    return { icon: <Feather size={26} />, bg: '#FDF2F8', color: '#BE185D' };
                  case 'soundbars-audio':
                    return { icon: <Volume2 size={26} />, bg: '#F3E8FF', color: '#9333EA' };
                  case 'laptops-wfh':
                    return { icon: <Laptop size={26} />, bg: '#EFF6FF', color: '#2563EB' };
                  case 'appliance-combos':
                    return { icon: <PackageCheck size={26} />, bg: '#FEF3C7', color: '#B45309' };
                  default:
                    return { icon: <Box size={26} />, bg: 'var(--blue-subtle)', color: 'var(--blue-primary)' };
                }
              };

              const style = getCategoryStyle(cat.slug);

              return (
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
                    color: 'inherit',
                    borderRadius: '16px',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    backgroundColor: style.bg,
                    color: style.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {style.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '3px' }}>
                      {cat.name}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span>{cat.appliances_count || 4} Models</span>
                      <span>•</span>
                      <span style={{ color: 'var(--blue-primary)', fontWeight: 600 }}>Explore →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
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
                onQuickView={(app) => setQuickViewAppliance(app)}
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

      {/* 4.5. INTERACTIVE RENT VS BUY SAVINGS CALCULATOR */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--bg-main)' }}>
        <div className="container-custom" style={{ maxWidth: '960px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
              TRANSPARENT FINANCIAL INTELLIGENCE
            </div>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
              Calculate Your Rent vs. Buy Savings
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
              See in real-time how much money and hassle you save renting with ApplineX.
            </p>
          </div>

          <RentVsBuyCalculator defaultMonthlyRent={1499} defaultApplianceName="Samsung Inverter 340L Refrigerator" />
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


      {/* Quick View Modal */}
      {quickViewAppliance && (
        <QuickViewModal
          appliance={quickViewAppliance}
          isOpen={Boolean(quickViewAppliance)}
          onClose={() => setQuickViewAppliance(null)}
          onRentClick={handleRentClick}
        />
      )}

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
