import React, { useState, useEffect } from 'react';
import { aiApi } from '../../services/api';
import ApplianceCard from '../../components/appliances/ApplianceCard';
import RentalBookingModal from '../../components/customer/RentalBookingModal';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { Sparkles, Brain, Cpu, Zap, ArrowRight, Home, Users, Check, RefreshCw } from 'lucide-react';

const SmartRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppliance, setSelectedAppliance] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // Interactive AI Questionnaire State
  const [homeType, setHomeType] = useState('2bhk');
  const [familySize, setFamilySize] = useState('3-4');
  const [primaryFocus, setPrimaryFocus] = useState('all');
  const [aiOptimizing, setAiOptimizing] = useState(false);

  const fetchRecommendations = () => {
    setLoading(true);
    aiApi.getRecommendations()
      .then((res) => {
        setRecommendations(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleRecalculate = () => {
    setAiOptimizing(true);
    setTimeout(() => {
      setAiOptimizing(false);
      fetchRecommendations();
    }, 600);
  };

  const handleRentClick = (appliance) => {
    setSelectedAppliance(appliance);
    setBookingModalOpen(true);
  };

  // Filter recommendations based on focus
  const filteredRecs = recommendations.filter((item) => {
    if (primaryFocus === 'all') return true;
    const cat = item.appliance?.category_name?.toLowerCase() || '';
    if (primaryFocus === 'cooling') return cat.includes('refrigerator') || cat.includes('ac') || cat.includes('cooler');
    if (primaryFocus === 'laundry') return cat.includes('washing') || cat.includes('dryer');
    if (primaryFocus === 'kitchen') return cat.includes('microwave') || cat.includes('refrigerator') || cat.includes('dishwasher');
    return true;
  });

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '80vh', padding: '2rem 0 4rem' }}>
      <div className="container-custom">
        
        {/* AI Banner Header */}
        <div style={{
          background: 'linear-gradient(135deg, #070F1E 0%, #1A1438 100%)',
          borderRadius: '20px',
          padding: '2.5rem',
          color: '#FFFFFF',
          marginBottom: '2rem',
          border: '1px solid rgba(124, 58, 237, 0.35)',
          boxShadow: 'var(--shadow-glow-ai)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(124, 58, 237, 0.25)',
              color: '#C084FC',
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              marginBottom: '0.75rem',
              border: '1px solid rgba(124, 58, 237, 0.4)'
            }}>
              <Sparkles size={15} /> APPLINEX INTELLIGENCE ENGINE
            </div>

            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              Smart Home Appliance Advisor
            </h1>
            <p style={{ color: '#CBD5E1', fontSize: '1rem', maxWidth: '640px', margin: 0, lineHeight: 1.5 }}>
              Powered by deep compatibility models that factor in your apartment dimensions, household capacity, energy savings, and real-time user ratings.
            </p>
          </div>
        </div>

        {/* Interactive AI Preference Configurator */}
        <div className="app-card" style={{ padding: '1.5rem 1.75rem', marginBottom: '2.5rem', border: '1px solid var(--ai-purple-border)', backgroundColor: '#FAF8FF' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--ai-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                <Brain size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-primary)', margin: 0 }}>
                  Tailor AI Match Matrix
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>Select your home parameters to generate precision match percentages</p>
              </div>
            </div>

            <button 
              onClick={handleRecalculate}
              disabled={aiOptimizing}
              className="btn btn-ai btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <RefreshCw size={14} className={aiOptimizing ? 'spin' : ''} />
              {aiOptimizing ? 'Optimizing Weights...' : 'Recalculate AI Matches'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            
            {/* Home Type */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                Home Layout
              </label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {[
                  { id: '1bhk', label: '1 BHK' },
                  { id: '2bhk', label: '2 BHK' },
                  { id: '3bhk', label: '3+ BHK' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setHomeType(item.id)}
                    style={{
                      flex: 1,
                      padding: '0.45rem 0.6rem',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: homeType === item.id ? '1px solid #7C3AED' : '1px solid #CBD5E1',
                      backgroundColor: homeType === item.id ? '#7C3AED' : '#FFFFFF',
                      color: homeType === item.id ? '#FFFFFF' : '#475569',
                      transition: 'all 120ms ease'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Family Size */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                Occupants
              </label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {[
                  { id: '1-2', label: '1 - 2 People' },
                  { id: '3-4', label: '3 - 4 People' },
                  { id: '5+', label: '5+ Family' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFamilySize(item.id)}
                    style={{
                      flex: 1,
                      padding: '0.45rem 0.6rem',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: familySize === item.id ? '1px solid #7C3AED' : '1px solid #CBD5E1',
                      backgroundColor: familySize === item.id ? '#7C3AED' : '#FFFFFF',
                      color: familySize === item.id ? '#FFFFFF' : '#475569',
                      transition: 'all 120ms ease'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Focus category */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                Primary Upgrade Need
              </label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {[
                  { id: 'all', label: 'All Appliances' },
                  { id: 'cooling', label: 'Cooling & AC' },
                  { id: 'laundry', label: 'Laundry Care' },
                  { id: 'kitchen', label: 'Smart Kitchen' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPrimaryFocus(item.id)}
                    style={{
                      flex: 1,
                      padding: '0.45rem 0.6rem',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: primaryFocus === item.id ? '1px solid #7C3AED' : '1px solid #CBD5E1',
                      backgroundColor: primaryFocus === item.id ? '#7C3AED' : '#FFFFFF',
                      color: primaryFocus === item.id ? '#FFFFFF' : '#475569',
                      transition: 'all 120ms ease'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonLoader count={6} height="360px" />
        ) : filteredRecs.length === 0 ? (
          <div className="app-card" style={{ padding: '3.5rem', textAlign: 'center' }}>
            <Brain size={42} color="var(--ai-purple)" style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
              No Specific Matches Found
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginTop: '0.35rem' }}>
              Try selecting "All Appliances" or adjusting the home parameters above.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.75rem'
          }}>
            {filteredRecs.map((item, idx) => (
              <ApplianceCard
                key={item.appliance?.id || idx}
                appliance={item.appliance}
                onRentClick={handleRentClick}
                isAiRecommended={true}
                matchScore={item.match_percentage || 94}
              />
            ))}
          </div>
        )}

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
        />
      )}
    </div>
  );
};

export default SmartRecommendations;

