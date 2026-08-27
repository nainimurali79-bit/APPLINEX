import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { appliancesApi } from '../../services/api';
import ApplianceCard from '../../components/appliances/ApplianceCard';
import FilterPanel from '../../components/appliances/FilterPanel';
import RentalBookingModal from '../../components/customer/RentalBookingModal';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { Search, SlidersHorizontal, ArrowUpDown, Box } from 'lucide-react';

const AppliancesCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [appliances, setAppliances] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [filters, setFilters] = useState({
    category: initialCategory,
    brand: 'all',
    status: 'all',
    maxPrice: 3000,
    rating: 'all',
    search: '',
    sort_by: 'popular',
  });

  const [selectedAppliance, setSelectedAppliance] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // Fetch categories & filter meta
  useEffect(() => {
    appliancesApi.getCategories().then((res) => setCategories(res.data)).catch(console.error);
    appliancesApi.getFilterMeta().then((res) => setBrands(res.data.brands || [])).catch(console.error);
  }, []);

  // Sync category param from URL if present
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      setFilters((prev) => ({ ...prev, category: catParam }));
    }
  }, [searchParams]);

  // Fetch filtered appliances
  useEffect(() => {
    setLoading(true);
    const queryParams = {
      category: filters.category !== 'all' ? filters.category : undefined,
      brand: filters.brand !== 'all' ? filters.brand : undefined,
      status: filters.status !== 'all' ? filters.status : undefined,
      max_price: filters.maxPrice ? filters.maxPrice : undefined,
      rating: filters.rating !== 'all' ? filters.rating : undefined,
      search: filters.search ? filters.search : undefined,
      sort_by: filters.sort_by,
    };

    appliancesApi.getAppliances(queryParams)
      .then((res) => {
        setAppliances(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (key === 'category' && value !== 'all') {
      setSearchParams({ category: value });
    } else if (key === 'category' && value === 'all') {
      setSearchParams({});
    }
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      brand: 'all',
      status: 'all',
      maxPrice: 3000,
      rating: 'all',
      search: '',
      sort_by: 'popular',
    });
    setSearchParams({});
  };

  const handleRentClick = (appliance) => {
    setSelectedAppliance(appliance);
    setBookingModalOpen(true);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '80vh', padding: '2rem 0 4rem' }}>
      <div className="container-custom">
        
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
            APPLINEX CATALOG
          </div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
            Household Appliances
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Explore verified premium appliances available for immediate flexible delivery.
          </p>
        </div>

        {/* Top Filter & Search Bar */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by appliance name, brand, or model..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowUpDown size={14} /> Sort By:
            </span>
            <select
              className="form-control"
              style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 600 }}
              value={filters.sort_by}
              onChange={(e) => handleFilterChange('sort_by', e.target.value)}
            >
              <option value="popular">Most Popular</option>
              <option value="price_low">Monthly Price: Low to High</option>
              <option value="price_high">Monthly Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Additions</option>
            </select>
          </div>

        </div>

        {/* Catalog Main Layout (Left Filter Panel + Right Grid) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '270px 1fr',
          gap: '2rem',
          alignItems: 'start'
        }} className="catalog-grid-layout">
          
          {/* Left Filter Sidebar */}
          <FilterPanel
            categories={categories}
            brands={brands}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />

          {/* Right Product Grid */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.88rem', color: '#64748B', fontWeight: 600 }}>
                Showing <strong style={{ color: 'var(--navy-primary)' }}>{appliances.length}</strong> appliances
              </div>
            </div>

            {loading ? (
              <SkeletonLoader count={6} height="360px" />
            ) : appliances.length === 0 ? (
              <div className="app-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#F1F5F9', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <Box size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '0.5rem' }}>
                  No Appliances Found
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748B', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                  We couldn't find any appliances matching your current filter criteria. Try adjusting your filters.
                </p>
                <button onClick={handleResetFilters} className="btn btn-secondary">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.5rem'
              }}>
                {appliances.map((appliance) => (
                  <ApplianceCard
                    key={appliance.id}
                    appliance={appliance}
                    onRentClick={handleRentClick}
                  />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Booking Modal */}
      {selectedAppliance && (
        <RentalBookingModal
          isOpen={bookingModalOpen}
          onClose={() => {
            setBookingModalOpen(false);
            setSelectedAppliance(null);
          }}
          appliance={selectedAppliance}
          onBookingComplete={() => {
            // refresh list if needed
          }}
        />
      )}

      <style>{`
        @media (max-width: 900px) {
          .catalog-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AppliancesCatalog;
