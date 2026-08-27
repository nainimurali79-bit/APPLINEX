import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supportApi } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { Headphones, AlertTriangle, CheckCircle2, Clock, MessageSquare, ArrowRight } from 'lucide-react';

const SupportDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supportApi.getDashboardMetrics()
      .then((res) => {
        setMetrics(res.data);
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
        <SkeletonLoader count={2} height="260px" />
      </div>
    );
  }

  const kpis = metrics?.kpis || {};
  const recentTickets = metrics?.recent_tickets || [];
  const recentComplaints = metrics?.recent_complaints || [];

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          CUSTOMER SUPPORT & TRIAGE
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--navy-primary)', marginTop: '2px' }}>
          Support Operations Desk
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
          Triage customer support tickets, escalate service complaints, and moderate appliance ratings.
        </p>
      </div>

      {/* Top 4 Support KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <StatCard
          title="Open Tickets"
          value={kpis.open_tickets || 1}
          icon={Headphones}
          color="amber"
          subtext="Awaiting response"
        />
        <StatCard
          title="In Progress"
          value={kpis.in_progress_tickets || 1}
          icon={Clock}
          color="blue"
          subtext="Under technical triage"
        />
        <StatCard
          title="Resolved"
          value={kpis.resolved_tickets || 1}
          icon={CheckCircle2}
          color="green"
          subtext="Successfully closed"
        />
        <StatCard
          title="Active Complaints"
          value={kpis.pending_complaints || 1}
          icon={AlertTriangle}
          color="purple"
          subtext="Customer escalations"
        />
      </div>

      {/* Split Grid: Recent Tickets & Active Complaints */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }} className="support-split-grid">
        
        {/* Recent Tickets Table */}
        <div className="app-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
              Recent Support Tickets
            </h3>
            <Link to="/support/tickets" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--blue-primary)' }}>
              View All Tickets →
            </Link>
          </div>

          <div className="table-responsive">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Customer</th>
                  <th>Subject</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTickets.map((t) => (
                  <tr key={t.id}>
                    <td><strong style={{ color: 'var(--blue-primary)' }}>{t.ticket_id}</strong></td>
                    <td>{t.customer_name || t.customer_email}</td>
                    <td style={{ fontWeight: 600, color: 'var(--navy-primary)', fontSize: '0.85rem' }}>{t.subject}</td>
                    <td><StatusBadge status={t.priority} /></td>
                    <td><StatusBadge status={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Complaints Desk */}
        <div className="app-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
              Customer Complaints
            </h3>
            <Link to="/support/complaints" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--blue-primary)' }}>
              View All Complaints →
            </Link>
          </div>

          <div className="table-responsive">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Subject</th>
                  <th>Severity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.map((c) => (
                  <tr key={c.id}>
                    <td><strong style={{ color: 'var(--navy-primary)' }}>{c.complaint_id}</strong></td>
                    <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>{c.subject}</td>
                    <td><StatusBadge status={c.severity} /></td>
                    <td><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 950px) {
          .support-split-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SupportDashboard;
