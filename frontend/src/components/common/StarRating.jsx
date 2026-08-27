import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 5, maxStars = 5, size = 16, interactive = false, onChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= Math.round(displayRating);

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange && onChange(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '1px',
              cursor: interactive ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              color: isFilled ? '#F59E0B' : '#E2E8F0',
              transition: 'transform var(--transition-fast)'
            }}
          >
            <Star 
              size={size} 
              fill={isFilled ? '#F59E0B' : 'transparent'} 
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
