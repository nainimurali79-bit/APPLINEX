import React from 'react';
import { Filter, X, RefreshCw, Star } from 'lucide-react';

const FilterPanel = ({
  categories = [],
  brands = [],
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  return (
    <div className="app-card" style={{ padding: '1.25rem', height: 'fit-content' }}>
      
      {/* Filter Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '0.85rem',
        borderBottom: '1px solid var(--border-light)',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy-primary)' }}>
          <Filter size={18} color="var(--blue-primary)" />
          <span>Filters</span>
        </div>
        <button
          onClick={onResetFilters}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--blue-primary)',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <RefreshCw size={12} /> Reset
        </button>
      </div>

      {/* Category Filter */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label className="form-label" style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748B' }}>
          Categories
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '180px', overflowY: 'auto' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="category"
              checked={filters.category === 'all' || !filters.category}
              onChange={() => onFilterChange('category', 'all')}
            />
            <span style={{ fontWeight: (!filters.category || filters.category === 'all') ? 600 : 400 }}>All Categories</span>
          </label>
          {categories.map((cat) => (
            <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="category"
                checked={filters.category === cat.slug}
                onChange={() => onFilterChange('category', cat.slug)}
              />
              <span style={{ fontWeight: filters.category === cat.slug ? 600 : 400 }}>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label className="form-label" style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748B' }}>
          Availability
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {[
            { id: 'all', label: 'All Items' },
            { id: 'available', label: 'Available Now' },
            { id: 'rented', label: 'Currently Rented' },
          ].map((statusOption) => (
            <label key={statusOption.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="status"
                checked={filters.status === statusOption.id}
                onChange={() => onFilterChange('status', statusOption.id)}
              />
              <span>{statusOption.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Monthly Price Slider */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <label className="form-label" style={{ margin: 0, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748B' }}>
            Max Monthly Rent
          </label>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--blue-primary)' }}>
            ₹{parseInt(filters.maxPrice || 3000).toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min="500"
          max="3000"
          step="100"
          value={filters.maxPrice || 3000}
          onChange={(e) => onFilterChange('maxPrice', e.target.value)}
          style={{ width: '100%', accentColor: 'var(--blue-primary)' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94A3B8', marginTop: '2px' }}>
          <span>₹500</span>
          <span>₹3,000</span>
        </div>
      </div>

      {/* Brands Filter */}
      {brands.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label" style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748B' }}>
            Brand
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '140px', overflowY: 'auto' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="brand"
                checked={filters.brand === 'all' || !filters.brand}
                onChange={() => onFilterChange('brand', 'all')}
              />
              <span>All Brands</span>
            </label>
            {brands.map((brandName) => (
              <label key={brandName} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="brand"
                  checked={filters.brand === brandName}
                  onChange={() => onFilterChange('brand', brandName)}
                />
                <span>{brandName}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Customer Rating Filter */}
      <div>
        <label className="form-label" style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748B' }}>
          Minimum Rating
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {[
            { value: 'all', label: 'All Ratings' },
            { value: '4.8', label: '4.8★ and above' },
            { value: '4.5', label: '4.5★ and above' },
            { value: '4.0', label: '4.0★ and above' },
          ].map((r) => (
            <label key={r.value} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="rating"
                checked={filters.rating === r.value}
                onChange={() => onFilterChange('rating', r.value)}
              />
              <span>{r.label}</span>
            </label>
          ))}
        </div>
      </div>

    </div>
  );
};

export default FilterPanel;
