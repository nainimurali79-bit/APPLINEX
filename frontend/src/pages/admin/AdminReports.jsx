import React, { useState, useEffect } from 'react';
import { reportsApi } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { FileText, Download, Filter, Calendar, TrendingUp, Package, DollarSign } from 'lucide-react';

const AdminReports = () => {
  const [activeReport, setActiveReport] = useState('rentals');
  const [reportData, setReportData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchReport = () => {
    setLoading(true);
    const params = {
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    };

    let apiCall;
    if (activeReport === 'rentals') apiCall = reportsApi.getRentalReport(params);
    else if (activeReport === 'stock') apiCall = reportsApi.getStockReport();
    else if (activeReport === 'revenue') apiCall = reportsApi.getRevenueReport(params);

    apiCall
      .then((res) => {
        setReportData(res.data.records || res.data.monthly_records || []);
        setSummary(res.data.summary || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReport();
  }, [activeReport]);

  const handleExportCSV = () => {
    if (reportData.length === 0) return;
    const headers = Object.keys(reportData[0]);
    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const row of reportData) {
      const values = headers.map((header) => {
        const escaped = ('' + (row[header] || '')).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `APPLINEX_${activeReport}_report_${new Date().toISOString().slice(0, 10)}.csv`);
    a.click();
  };

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            EXECUTIVE REPORTING
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--navy-primary)', marginTop: '2px' }}>
            System Reports & Exports
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
            Generate structured transactional audits, inventory fleet status, and revenue reconciliations.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={reportData.length === 0 || loading}
          className="btn btn-primary"
        >
          <Download size={16} /> Export to CSV
        </button>
      </div>

      {/* Report Switcher Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
        <button
          onClick={() => setActiveReport('rentals')}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeReport === 'rentals' ? 'var(--blue-primary)' : 'transparent',
            color: activeReport === 'rentals' ? '#FFFFFF' : '#64748B',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <TrendingUp size={16} /> Rental Performance Report
        </button>

        <button
          onClick={() => setActiveReport('stock')}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeReport === 'stock' ? 'var(--blue-primary)' : 'transparent',
            color: activeReport === 'stock' ? '#FFFFFF' : '#64748B',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Package size={16} /> Inventory Stock Status
        </button>

        <button
          onClick={() => setActiveReport('revenue')}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeReport === 'revenue' ? 'var(--blue-primary)' : 'transparent',
            color: activeReport === 'revenue' ? '#FFFFFF' : '#64748B',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <DollarSign size={16} /> Revenue & Settlement Ledger
        </button>
      </div>

      {/* Summary KPI Highlights if available */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {Object.entries(summary).map(([key, val]) => (
            <div key={key} className="app-card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>
                {key.replace(/_/g, ' ')}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-primary)', marginTop: '4px' }}>
                {typeof val === 'number' && key.includes('amount') || key.includes('revenue') ? `₹${val.toLocaleString()}` : val}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report Data Table */}
      <div className="app-card" style={{ padding: '1.5rem' }}>
        
        {loading ? (
          <SkeletonLoader count={5} height="60px" />
        ) : reportData.length === 0 ? (
          <div style={{ padding: '3.5rem', textAlign: 'center', color: '#94A3B8' }}>
            No records found for the selected report criteria.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="app-table">
              <thead>
                <tr>
                  {Object.keys(reportData[0]).map((header) => (
                    <th key={header} style={{ textTransform: 'capitalize' }}>
                      {header.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, idx) => (
                  <tr key={idx}>
                    {Object.entries(row).map(([key, val], i) => (
                      <td key={i}>
                        {key === 'status' ? (
                          <StatusBadge status={val} />
                        ) : typeof val === 'number' && (key.includes('amount') || key.includes('price') || key.includes('revenue')) ? (
                          `₹${val.toLocaleString()}`
                        ) : (
                          String(val ?? '-')
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminReports;
