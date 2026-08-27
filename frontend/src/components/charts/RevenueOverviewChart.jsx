import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: '#0F223D',
        color: '#FFFFFF',
        padding: '0.6rem 0.85rem',
        borderRadius: '8px',
        border: '1px solid #1E3A63',
        fontSize: '0.8rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
      }}>
        <div style={{ fontWeight: 700, color: '#00C4FF', marginBottom: '2px' }}>{label}</div>
        <div style={{ color: '#FFFFFF' }}>Revenue: ₹{payload[0]?.value?.toLocaleString()}</div>
      </div>
    );
  }
  return null;
};

const RevenueOverviewChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>No revenue data available.</div>;
  }

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis 
            dataKey="month" 
            tick={{ fill: '#64748B', fontSize: 12 }} 
            axisLine={{ stroke: '#CBD5E1' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#64748B', fontSize: 11 }} 
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="revenue" 
            fill="#00C4FF" 
            radius={[6, 6, 0, 0]}
            maxBarSize={38}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueOverviewChart;
