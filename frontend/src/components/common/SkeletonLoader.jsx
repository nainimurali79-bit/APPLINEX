import React from 'react';

const SkeletonLoader = ({ count = 3, height = '200px', width = '100%', style = {} }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', width: '100%', ...style }}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          style={{
            height,
            width,
            backgroundColor: '#E2E8F0',
            borderRadius: '12px',
            animation: 'pulseGlow 1.5s infinite ease-in-out',
            opacity: 0.6
          }}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
