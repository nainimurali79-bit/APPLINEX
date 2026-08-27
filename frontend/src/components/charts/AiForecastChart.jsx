import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Cell 
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div style={{
        backgroundColor: '#0F223D',
        color: '#FFFFFF',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        border: '1px solid #7C3AED',
        fontSize: '0.82rem',
        boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)'
      }}>
        <div style={{ fontWeight: 700, color: '#C084FC', marginBottom: '4px' }}>{label} Forecast</div>
        <div>Predicted Demand: <strong>{item.predicted_demand} units</strong></div>
        <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Bounds: {item.lower_bound} - {item.upper_bound} units</div>
        <div style={{ color: '#00C4FF', fontSize: '0.75rem', marginTop: '2px' }}>Confidence: {item.confidence}</div>
      </div>
    );
  }
  return null;
};

const AiForecastChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>No forecast predictions generated.</div>;
  }

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="aiBarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00C4FF" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis 
            dataKey="month" 
            tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }} 
            axisLine={{ stroke: '#CBD5E1' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#64748B', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="predicted_demand" 
            fill="url(#aiBarGrad)" 
            radius={[8, 8, 0, 0]}
            maxBarSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AiForecastChart;
