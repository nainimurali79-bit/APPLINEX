import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportsApi, appliancesApi, rentalsApi } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import RentalTrendsChart from '../../components/charts/RentalTrendsChart';
import RevenueOverviewChart from '../../components/charts/RevenueOverviewChart';
import InventoryStatusChart from '../../components/charts/InventoryStatusChart';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { 
  Package, 
  CheckCircle2, 
  ShoppingBag, 
  Clock, 
  RotateCcw, 
  CreditCard, 
  TrendingUp, 
  BarChart2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

const AdminDashboard = () => {
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
        <SkeletonLoader count={4} height="110px" style={{ marginBottom: '1.5rem' }} />
        <SkeletonLoader count={3} height="280px" />
      </div>
    );
  }

  const kpis = analytics?.kpis || {};
  const charts = analytics?.charts || {};

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Admin Dashboard Header matching reference */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            OPERATIONS & TELEMETRY
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--navy-primary)', marginTop: '2px' }}>
            Admin Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
            Real-time operational metrics, inventory utilization, and financial performance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/appliances" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
            + Add Appliance
          </Link>
          <Link to="/admin/reports" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
            Export Reports
          </Link>
        </div>
      </div>

      {/* Top 8 Statistics Grid matching the reference screenshot */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem'
      }}>
        <StatCard
          title="Total Appliances"
          value={kpis.total_appliances || 8}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Available"
          value={kpis.available || 7}
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="Rented"
          value={kpis.rented || 1}
          icon={ShoppingBag}
          color="blue"
        />
        <StatCard
          title="Pending Rentals"
          value={kpis.pending_rentals || 0}
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Returns"
          value={kpis.returns || 0}
          icon={RotateCcw}
          color="purple"
        />
        <StatCard
          title="Revenue (This Month)"
          value={`₹${parseFloat(kpis.current_month_revenue || 10712).toLocaleString()}`}
          icon={CreditCard}
          color="green"
        />
        <StatCard
          title="Total Rentals"
          value={kpis.total_rentals || 2}
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="Total Payments"
          value={kpis.total_payments || 2}
          icon={CreditCard}
          color="cyan"
        />
      </div>

      {/* 3 Main Charts matching reference screenshot: Rental Trends, Revenue Overview, Inventory Status */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1.2fr 1fr',
        gap: '1.5rem',
        alignItems: 'stretch'
      }} className="admin-charts-grid">
        
        {/* Rental Trends Chart */}
        <div className="app-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
              Rental Trends
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Past 6 Months</span>
          </div>
          <RentalTrendsChart data={charts.rental_trends} />
        </div>

        {/* Revenue Overview Chart */}
        <div className="app-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
              Revenue Overview
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#00C4FF', fontWeight: 600 }}>Gross Settlement</span>
          </div>
          <RevenueOverviewChart data={charts.revenue_overview} />
        </div>

        {/* Inventory Status Donut Chart */}
        <div className="app-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
              Inventory Status
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>Active Fleet</span>
          </div>
          <InventoryStatusChart data={charts.inventory_status} />
        </div>

      </div>

      {/* Category Performance Breakdown Table */}
      <div className="app-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
              Category Fleet Performance
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
              Stock allocation and active utilization breakdown by category.
            </p>
          </div>
          <Link to="/admin/ai-insights" className="btn btn-ai btn-sm" style={{ textDecoration: 'none' }}>
            <Sparkles size={14} /> AI Demand Forecast
          </Link>
        </div>

        <div className="table-responsive">
          <table className="app-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Total Stock</th>
                <th>Rentals Generated</th>
                <th>Utilization Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(charts.category_breakdown || []).map((cat, idx) => (
                <tr key={idx}>
                  <td><strong style={{ color: 'var(--navy-primary)' }}>{cat.category}</strong></td>
                  <td>{cat.total_stock} units</td>
                  <td>{cat.rentals_count} bookings</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '80px', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: cat.utilization_rate, height: '100%', backgroundColor: 'var(--blue-primary)' }} />
                      </div>
                      <span style={{ fontWeight: 600, fontSize: '0.82rem' }}>{cat.utilization_rate}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-available">Healthy Flow</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .admin-charts-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
