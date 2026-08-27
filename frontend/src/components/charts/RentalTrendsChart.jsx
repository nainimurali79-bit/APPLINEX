import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
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
        <div style={{ color: '#93C5FD' }}>Rentals: {payload[0]?.value}</div>
        {payload[1] && <div style={{ color: '#34D399' }}>Active: {payload[1]?.value}</div>}
      </div>
    );
  }
  return null;
};

const RentalTrendsChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>No trend data available.</div>;
  }

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis 
            dataKey="month" 
            tick={{ fill: '#64748B', fontSize: 12 }} 
            axisLine={{ stroke: '#CBD5E1' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#64748B', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="rentals" 
            stroke="#1E60D5" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#1E60D5', strokeWidth: 2, stroke: '#FFFFFF' }}
            activeDot={{ r: 6, fill: '#00C4FF' }}
          />
          <Line 
            type="monotone" 
            dataKey="active" 
            stroke="#10B981" 
            strokeWidth={2} 
            strokeDasharray="4 4"
            dot={{ r: 3, fill: '#10B981' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RentalTrendsChart;
