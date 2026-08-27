import React, { useState, useEffect } from 'react';
import { appliancesApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { Package, Plus, Search, Edit2, Trash2, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';

const AdminAppliances = () => {
  const [appliances, setAppliances] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    appliance_code: '',
    name: '',
    category: '',
    subcategory: '',
    appliance_type: '',
    brand: '',
    model_number: '',
    monthly_price: '',
    security_deposit: '1000',
    status: 'available',
    image_url: '',
    capacity: '',
    energy_rating: '5 Star',
    description: '',
    featured: false,
  });

  const { addToast } = useNotification();

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      appliancesApi.getAppliances(),
      appliancesApi.getCategories()
    ])
      .then(([appRes, catRes]) => {
        setAppliances(appRes.data);
        setCategories(catRes.data);
        if (catRes.data.length > 0 && !formData.category) {
          setFormData((prev) => ({ ...prev, category: catRes.data[0].id }));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingAppliance(null);
    setFormData({
      appliance_code: `AP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      category: categories[0]?.id || 1,
      subcategory: '',
      appliance_type: 'Inverter Smart',
      brand: '',
      model_number: '',
      monthly_price: '',
      security_deposit: '1000',
      status: 'available',
      image_url: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&auto=format&fit=crop&q=80',
      capacity: '',
      energy_rating: '5 Star',
      description: '',
      featured: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (appliance) => {
    setEditingAppliance(appliance);
    setFormData({
      appliance_code: appliance.appliance_code,
      name: appliance.name,
      category: appliance.category,
      subcategory: appliance.subcategory || '',
      appliance_type: appliance.appliance_type || '',
      brand: appliance.brand,
      model_number: appliance.model_number || '',
      monthly_price: appliance.monthly_price,
      security_deposit: appliance.security_deposit,
      status: appliance.status,
      image_url: appliance.image_url,
      capacity: appliance.capacity || '',
      energy_rating: appliance.energy_rating || '5 Star',
      description: appliance.description || '',
      featured: appliance.featured || false,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appliance?')) return;
    try {
      await appliancesApi.deleteAppliance(id);
      addToast('Appliance deleted successfully.', 'success');
      fetchData();
    } catch (err) {
      addToast('Failed to delete appliance.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAppliance) {
        await appliancesApi.updateAppliance(editingAppliance.id, formData);
        addToast('Appliance updated successfully.', 'success');
      } else {
        await appliancesApi.createAppliance(formData);
        addToast('New appliance added to catalog.', 'success');
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      addToast('Failed to save appliance. Please check all fields.', 'error');
    }
  };

  const filteredAppliances = appliances.filter((a) => 
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.appliance_code.toLowerCase().includes(search.toLowerCase()) ||
    a.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            INVENTORY MANAGEMENT
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--navy-primary)', marginTop: '2px' }}>
            Appliance Fleet
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
            Add, edit, manage rental tariffs, and control live status of appliances.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} /> Add New Appliance
        </button>
      </div>

      {/* Table Card */}
      <div className="app-card" style={{ padding: '1.5rem' }}>
        
        {/* Search */}
        <div style={{ marginBottom: '1.5rem', maxWidth: '360px', position: 'relative' }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search appliance code, brand, model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.2rem' }}
          />
        </div>

        {loading ? (
          <SkeletonLoader count={4} height="80px" />
        ) : (
          <div className="table-responsive">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Appliance Name</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Monthly Rent</th>
                  <th>Deposit</th>
                  <th>Status</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppliances.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--blue-primary)' }}>
                        {app.appliance_code}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--navy-primary)' }}>
                        {app.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{app.model_number}</div>
                    </td>
                    <td>{app.category_name}</td>
                    <td><strong style={{ color: '#475569' }}>{app.brand}</strong></td>
                    <td><strong style={{ color: 'var(--navy-primary)' }}>₹{parseInt(app.monthly_price).toLocaleString()}</strong></td>
                    <td>₹{parseInt(app.security_deposit).toLocaleString()}</td>
                    <td><StatusBadge status={app.status} /></td>
                    <td>{parseFloat(app.rating).toFixed(1)} ★</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => handleOpenEdit(app)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.3rem 0.55rem' }}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.3rem 0.55rem', color: 'var(--error-red)' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingAppliance ? `Edit ${editingAppliance.name}` : 'Add New Appliance to Fleet'}
        maxWidth="680px"
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Appliance Code</label>
              <input
                type="text"
                className="form-control"
                value={formData.appliance_code}
                onChange={(e) => setFormData({ ...formData, appliance_code: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: parseInt(e.target.value) })}
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Appliance Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Premium Smart Double Door Refrigerator 340L"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Brand</label>
              <input
                type="text"
                className="form-control"
                placeholder="Samsung, LG, Daikin, Bosch..."
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Model Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="RT34T4513S8"
                value={formData.model_number}
                onChange={(e) => setFormData({ ...formData, model_number: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Monthly Price (₹)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={formData.monthly_price}
                onChange={(e) => setFormData({ ...formData, monthly_price: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Security Deposit (₹)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={formData.security_deposit}
                onChange={(e) => setFormData({ ...formData, security_deposit: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Stock Status</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Product Image URL (High-Res WebP/JPEG)</label>
            <input
              type="url"
              className="form-control"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Capacity / Size</label>
              <input
                type="text"
                className="form-control"
                placeholder="340 Litres / 8 Kg / 1.5 Ton"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Energy Rating</label>
              <input
                type="text"
                className="form-control"
                placeholder="5 Star / Inverter Pro"
                value={formData.energy_rating}
                onChange={(e) => setFormData({ ...formData, energy_rating: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingAppliance ? 'Save Changes' : 'Create Appliance'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default AdminAppliances;
