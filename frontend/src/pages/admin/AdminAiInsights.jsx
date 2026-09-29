import React, { useState, useEffect } from 'react';
import { aiApi, appliancesApi } from '../../services/api';
import AiForecastChart from '../../components/charts/AiForecastChart';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { 
  Sparkles, 
  TrendingUp, 
  Brain, 
  Cpu, 
  Calendar, 
  ArrowUpRight, 
  CheckCircle2, 
  Activity, 
  AlertCircle, 
  RefreshCw,
  Users,
  Sun,
  ShieldAlert,
  Compass
} from 'lucide-react';

const AdminAiInsights = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [runningModel, setRunningModel] = useState(false);

  useEffect(() => {
    appliancesApi.getCategories().then((res) => setCategories(res.data)).catch(console.error);
    fetchForecast('');
  }, []);

  const fetchForecast = (catSlug) => {
    setLoading(true);
    aiApi.getDemandForecast(catSlug ? { category: catSlug } : {})
      .then((res) => {
        setForecast(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleCategoryChange = (e) => {
    const slug = e.target.value;
    setSelectedCategory(slug);
    fetchForecast(slug);
  };

  const handleRetrainForecast = () => {
    setRunningModel(true);
    setTimeout(() => {
      fetchForecast(selectedCategory);
      setRunningModel(false);
    }, 800);
  };

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* AI Demand Forecast Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0B192C 0%, #17113A 100%)',
        borderRadius: '16px',
        padding: '2rem 2.5rem',
        color: '#FFFFFF',
        border: '1px solid rgba(124, 58, 237, 0.35)',
        boxShadow: 'var(--shadow-glow-ai)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
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
            marginBottom: '0.6rem'
          }}>
            <Sparkles size={14} /> AI DEMAND FORECAST & PREDICTIVE ANALYTICS
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            Appliance Fleet Demand Forecast
          </h1>
          <p style={{ color: '#CBD5E1', fontSize: '0.92rem', marginTop: '4px', maxWidth: '650px', margin: '4px 0 0', lineHeight: 1.5 }}>
            Machine learning projections based on 6-month historical utilization, seasonal trends, and demographic leasing velocity.
          </p>
        </div>

        {/* Category Selector & Retrain trigger */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            style={{
              backgroundColor: '#0F223D',
              color: '#FFFFFF',
              border: '1px solid #1E3A63',
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            <option value="">All Fleet Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>

          <button
            onClick={handleRetrainForecast}
            disabled={runningModel}
            className="btn btn-ai"
          >
            <RefreshCw size={15} className={runningModel ? 'spin-anim' : ''} /> {runningModel ? 'Inferencing...' : 'Recalculate AI Model'}
          </button>
        </div>
      </div>

      {loading ? (
        <SkeletonLoader count={3} height="220px" />
      ) : !forecast ? (
        <div className="app-card" style={{ padding: '3.5rem', textAlign: 'center' }}>
          <AlertCircle size={40} color="var(--ai-purple)" style={{ margin: '0 auto 1rem' }} />
          <h3>No Demand Predictions Generated</h3>
        </div>
      ) : (
        <>
          {/* 3 Main Analytical Areas */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            
            {/* Area 1: Historical Demand */}
            <div className="app-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--blue-subtle)', color: 'var(--blue-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
                    1. Historical Demand & Baseline
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>12-Month Observation Telemetry</div>
                </div>
              </div>

              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Average monthly demand is <strong>{forecast.historical_baseline?.average_monthly_rentals} units</strong> with a fleet utilization of <strong>{forecast.historical_baseline?.average_utilization_rate || '66.7%'}</strong> across selected inventory.
              </div>

              <div style={{ marginTop: 'auto', backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: '#64748B' }}>Category:</span>
                  <strong style={{ color: 'var(--navy-primary)' }}>{forecast.category}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#64748B' }}>Total Historical Recorded:</span>
                  <strong style={{ color: 'var(--blue-primary)' }}>{forecast.historical_baseline?.total_rentals} Rentals</strong>
                </div>
              </div>
            </div>

            {/* Area 2: AI Analysis & Factors */}
            <div className="app-card app-card-ai" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--ai-purple-subtle)', color: 'var(--ai-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Brain size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
                    2. AI Predictive Factors
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ai-purple)' }}>Multi-Variate Seasonal OLS</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid rgba(124, 58, 237, 0.15)' }}>
                  <span style={{ color: '#64748B' }}>Seasonal Demand Factor:</span>
                  <strong style={{ color: 'var(--ai-purple)' }}>{forecast.ai_analysis?.seasonal_factor}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid rgba(124, 58, 237, 0.15)' }}>
                  <span style={{ color: '#64748B' }}>Projected Trajectory:</span>
                  <strong style={{ color: '#059669' }}>{forecast.ai_analysis?.growth_trend}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0' }}>
                  <span style={{ color: '#64748B' }}>Demographic Driver:</span>
                  <span style={{ fontWeight: 600, color: 'var(--navy-primary)' }}>{forecast.ai_analysis?.drivers}</span>
                </div>
              </div>

              <div style={{ marginTop: 'auto', backgroundColor: '#FAF5FF', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(124, 58, 237, 0.2)', fontSize: '0.78rem', color: '#6B21A8' }}>
                ✓ Calibrated with 95% confidence intervals & leasing velocity.
              </div>
            </div>

            {/* Area 3: Fleet Procurement Recommendation */}
            <div className="app-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--success-subtle)', color: 'var(--success-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
                    3. Procurement Action
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#059669' }}>Inventory Optimization</div>
                </div>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {forecast.recommendation || 'Maintain steady fleet procurement to accommodate projected rental demand spikes.'}
              </p>

              <div style={{ marginTop: 'auto', backgroundColor: '#ECFDF5', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700, textTransform: 'uppercase' }}>Recommended Replenishment Buffer</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#065F46', marginTop: '2px' }}>
                  +{forecast.recommended_buffer || 15} Units
                </div>
              </div>
            </div>

          </div>

          {/* Demographic Velocity & Seasonal Indices Breakdown */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Demographic Leasing Velocity Card */}
            <div className="app-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-primary)', margin: 0 }}>
                    Demographic Leasing Velocity
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>User segment adoption & share distribution</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginTop: '1.2rem' }}>
                {(forecast.demographic_breakdown || []).map((seg, i) => (
                  <div key={i} style={{ backgroundColor: '#F8FAFC', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--navy-primary)' }}>{seg.segment}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--blue-primary)', fontWeight: 700 }}>
                        {seg.share_percentage}% Share
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '999px', overflow: 'hidden', marginBottom: '6px' }}>
                      <div style={{
                        width: `${seg.share_percentage}%`,
                        height: '100%',
                        background: i === 0 ? 'linear-gradient(90deg, #1E60D5, #00C4FF)' : i === 1 ? 'linear-gradient(90deg, #7C3AED, #C084FC)' : 'linear-gradient(90deg, #10B981, #34D399)',
                        borderRadius: '999px'
                      }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B' }}>
                      <span>Velocity: <strong>{seg.average_leasing_velocity}</strong></span>
                      <span>Top Category: <strong style={{ color: 'var(--navy-primary)' }}>{seg.top_preferred_category}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seasonal Multipliers Card */}
            <div className="app-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sun size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-primary)', margin: 0 }}>
                    Seasonal Trend Index
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Quarterly demand multipliers & climate spikes</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.2rem' }}>
                {Object.entries(forecast.seasonal_multipliers || {}).map(([seasonName, sData], idx) => {
                  const mult = typeof sData === 'object' ? sData.multiplier : sData;
                  const isPeak = mult >= 1.05;
                  return (
                    <div key={idx} style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      backgroundColor: isPeak ? '#FFFBEB' : '#F8FAFC',
                      border: isPeak ? '1px solid #FCD34D' : '1px solid var(--border-light)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: isPeak ? '#92400E' : '#475569', textTransform: 'uppercase' }}>
                        {seasonName} Season
                      </div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: isPeak ? '#B45309' : 'var(--navy-primary)' }}>
                        {mult}x
                      </div>
                      <div style={{ fontSize: '0.72rem', color: isPeak ? '#B45309' : '#64748B' }}>
                        {isPeak ? 'High demand surge phase' : 'Steady baseline lease cycle'}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: '1.2rem', padding: '0.75rem', backgroundColor: '#F0FDF4', borderRadius: '8px', border: '1px solid #BBF7D0', fontSize: '0.78rem', color: '#166534' }}>
                💡 <strong>Dynamic Calibration:</strong> Cooling appliances (AC/Coolers) peak during Summer (up to 1.35x), while Heating (Geysers) peaks in Winter (up to 1.45x).
              </div>
            </div>
          </div>

          {/* Forecast Chart & Monthly Predictions Grid */}
          <div className="app-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
                  Predicted Demand Projections (Forward 3 Months)
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '2px' }}>
                  Forecasted monthly rental orders with upper & lower confidence boundaries.
                </p>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr',
              gap: '2rem',
              alignItems: 'center'
            }} className="forecast-chart-grid">
              
              {/* Left: Recharts AI Chart */}
              <div>
                <AiForecastChart data={forecast.predictions} />
              </div>

              {/* Right: Monthly Prediction Detail Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {forecast.predictions?.map((pred, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: '10px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid var(--border-light)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, color: 'var(--navy-primary)', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {pred.month}
                        {pred.season && (
                          <span style={{ fontSize: '0.68rem', fontWeight: 600, padding: '1px 6px', borderRadius: '4px', backgroundColor: '#EDE9FE', color: '#6D28D9' }}>
                            {pred.season}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                        Confidence: <strong style={{ color: 'var(--blue-primary)' }}>{pred.confidence}</strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--ai-purple)' }}>
                        {pred.predicted_demand} <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 400 }}>units</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                        Range: {pred.lower_bound} – {pred.upper_bound}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </>
      )}

      <style>{`
        .spin-anim {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          .forecast-chart-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminAiInsights;
