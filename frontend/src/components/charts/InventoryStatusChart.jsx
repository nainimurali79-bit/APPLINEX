import React from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from 'recharts';

const COLORS = ['#10B981', '#1E60D5', '#F59E0B'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div style={{
        backgroundColor: '#0F223D',
        color: '#FFFFFF',
        padding: '0.5rem 0.75rem',
        borderRadius: '6px',
        fontSize: '0.8rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
      }}>
        <div style={{ fontWeight: 600 }}>{data.name}: {data.value} Units</div>
      </div>
    );
  }
  return null;
};

const InventoryStatusChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>No inventory data.</div>;
  }

  return (
    <div style={{ width: '100%', height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span style={{ color: '#475569', fontSize: '0.8rem', fontWeight: 500 }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InventoryStatusChart;
