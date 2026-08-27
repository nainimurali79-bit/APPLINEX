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
  RefreshCw 
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
      
      {/* AI Demand Forecast Header matching reference */}
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
          <p style={{ color: '#CBD5E1', fontSize: '0.92rem', marginTop: '4px', maxWidth: '600px', margin: '4px 0 0' }}>
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
          {/* 3 Main Analytical Areas matching reference description */}
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
                    1. Historical Demand
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Past 6 Months Activity</div>
                </div>
              </div>

              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Average monthly demand has been observed at <strong>{forecast.historical_baseline?.average_monthly_rentals} units</strong> across selected inventory with steady month-over-month expansion.
              </div>

              <div style={{ marginTop: 'auto', backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
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
                  <div style={{ fontSize: '0.75rem', color: 'var(--ai-purple)' }}>Multi-Variate Analysis</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid rgba(124, 58, 237, 0.15)' }}>
                  <span style={{ color: '#64748B' }}>Seasonal Demand Multiplier:</span>
                  <strong style={{ color: 'var(--ai-purple)' }}>{forecast.ai_analysis?.seasonal_factor}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid rgba(124, 58, 237, 0.15)' }}>
                  <span style={{ color: '#64748B' }}>Projected Growth Rate:</span>
                  <strong style={{ color: '#059669' }}>{forecast.ai_analysis?.growth_trend}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0' }}>
                  <span style={{ color: '#64748B' }}>Key Growth Drivers:</span>
                  <span style={{ fontWeight: 600, color: 'var(--navy-primary)' }}>{forecast.ai_analysis?.drivers}</span>
                </div>
              </div>

              <div style={{ marginTop: 'auto', backgroundColor: '#FAF5FF', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(124, 58, 237, 0.2)', fontSize: '0.78rem', color: '#6B21A8' }}>
                ✓ Model tuned with 95% Bayesian confidence intervals.
              </div>
            </div>

            {/* Area 3: Fleet Recommendation */}
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
                {forecast.recommendation || 'Maintain steady fleet procurement to accommodate projected 3-month rental demand spikes.'}
              </p>

              <div style={{ marginTop: 'auto', backgroundColor: '#ECFDF5', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700, textTransform: 'uppercase' }}>Recommended Buffer</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#065F46', marginTop: '2px' }}>+12 Units</div>
              </div>
            </div>

          </div>

          {/* Forecast Chart & Monthly Predictions Grid matching reference */}
          <div className="app-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
                  Predicted Demand (Next 3 Months)
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '2px' }}>
                  Forecasted monthly rental orders with confidence boundaries.
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
                      <div style={{ fontWeight: 800, color: 'var(--navy-primary)', fontSize: '1rem' }}>
                        {pred.month}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        Confidence: <strong style={{ color: 'var(--blue-primary)' }}>{pred.confidence}</strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--ai-purple)' }}>
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
