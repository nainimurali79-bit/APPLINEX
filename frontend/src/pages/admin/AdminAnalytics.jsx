import React, { useState, useEffect } from 'react';
import { reportsApi } from '../../services/api';
import RentalTrendsChart from '../../components/charts/RentalTrendsChart';
import RevenueOverviewChart from '../../components/charts/RevenueOverviewChart';
import InventoryStatusChart from '../../components/charts/InventoryStatusChart';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { BarChart3, TrendingUp, DollarSign, Users, Award, Percent } from 'lucide-react';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    reportsApi.getAnalytics()
      .then((res) => {
        setAnalytics(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem' }}>
        <SkeletonLoader count={3} height="200px" />
      </div>
    );
  }

  const kpis = analytics?.kpis || {};
  const charts = analytics?.charts || {};

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          DEEP TELEMETRY
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--navy-primary)', marginTop: '2px' }}>
          Platform Analytics & Insights
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
          Multi-dimensional breakdown of rental lifecycle durations, category churn, and yield optimization.
        </p>
      </div>

      {/* Advanced KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="app-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--blue-primary)', marginBottom: '0.5rem' }}>
            <TrendingUp size={20} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Fleet Utilization</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
            {((kpis.rented / Math.max(1, kpis.total_appliances)) * 100).toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>Target: 85.0%</div>
        </div>

        <div className="app-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#059669', marginBottom: '0.5rem' }}>
            <Award size={20} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Customer Satisfaction</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
            4.9 / 5.0
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>99.2% positive sentiment</div>
        </div>

        <div className="app-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--ai-purple)', marginBottom: '0.5rem' }}>
            <Percent size={20} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Avg. Rental Tenure</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
            4.8 Months
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>Top tier: 6 Month plans</div>
        </div>

        <div className="app-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#00C4FF', marginBottom: '0.5rem' }}>
            <DollarSign size={20} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Avg Revenue Per Asset</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
            ₹1,339 / mo
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>Gross annual yield: 34.2%</div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
        <div className="app-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '1rem' }}>
            Rental Trajectory Over Time
          </h3>
          <RentalTrendsChart data={charts.rental_trends} />
        </div>

        <div className="app-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '1rem' }}>
            Revenue Capture by Month
          </h3>
          <RevenueOverviewChart data={charts.revenue_overview} />
        </div>
      </div>

    </div>
  );
};

export default AdminAnalytics;
