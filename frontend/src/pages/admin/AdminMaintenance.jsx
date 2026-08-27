import React, { useState, useEffect } from 'react';
import { maintenanceApi, appliancesApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { Wrench, Plus, CheckCircle2, AlertTriangle, Calendar, User } from 'lucide-react';

const AdminMaintenance = () => {
  const [logs, setLogs] = useState([]);
  const [appliances, setAppliances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Maintenance log form
  const [formData, setFormData] = useState({
    appliance: '',
    service_date: new Date().toISOString().split('T')[0],
    condition: 'good',
    status: 'scheduled',
    technician_name: 'APPLINEX Senior Field Technician',
    cost: '0.00',
    description: '',
    resolution_notes: '',
  });

  const { addToast } = useNotification();

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      maintenanceApi.getLogs(),
      appliancesApi.getAppliances()
    ])
      .then(([logsRes, appRes]) => {
        setLogs(logsRes.data);
        setAppliances(appRes.data);
        if (appRes.data.length > 0 && !formData.appliance) {
          setFormData((prev) => ({ ...prev, appliance: appRes.data[0].id }));
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
    setFormData({
      appliance: appliances[0]?.id || 1,
      service_date: new Date().toISOString().split('T')[0],
      condition: 'good',
      status: 'scheduled',
      technician_name: 'APPLINEX Senior Field Technician',
      cost: '350.00',
      description: 'Routine maintenance and filter inspection.',
      resolution_notes: '',
    });
    setModalOpen(true);
  };

  const handleCompleteMaintenance = async (logId) => {
    try {
      await maintenanceApi.updateLog(logId, {
        status: 'completed',
        resolution_notes: 'Service completed. All diagnostics nominal. Appliance marked available.'
      });
      addToast('Maintenance marked completed & appliance status restored.', 'success');
      fetchData();
    } catch (err) {
      addToast('Failed to update maintenance record.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await maintenanceApi.createLog(formData);
      addToast('Maintenance log created and appliance placed in maintenance.', 'success');
      setModalOpen(false);
      fetchData();
    } catch (err) {
      addToast('Failed to create maintenance ticket.', 'error');
    }
  };

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            FLEET RELIABILITY
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--navy-primary)', marginTop: '2px' }}>
            Maintenance & Service Logs
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
            Schedule technician visits, record part repairs, and verify equipment health.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} /> Log New Service Ticket
        </button>
      </div>

      {/* Table Card */}
      <div className="app-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '1.25rem' }}>
          Service & Diagnostics Log Book
        </h3>

        {loading ? (
          <SkeletonLoader count={4} height="80px" />
        ) : logs.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
            No maintenance records logged.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Log ID</th>
                  <th>Appliance</th>
                  <th>Service Date</th>
                  <th>Technician</th>
                  <th>Condition</th>
                  <th>Service Cost</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td><strong style={{ color: 'var(--blue-primary)' }}>{log.log_id}</strong></td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{log.appliance_name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{log.appliance_code}</div>
                    </td>
                    <td>{log.service_date}</td>
                    <td>{log.technician_name}</td>
                    <td><StatusBadge status={log.condition} /></td>
                    <td>₹{parseFloat(log.cost).toLocaleString()}</td>
                    <td><StatusBadge status={log.status} /></td>
                    <td>
                      {log.status !== 'completed' && (
                        <button
                          onClick={() => handleCompleteMaintenance(log.id)}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', backgroundColor: '#10B981' }}
                        >
                          Mark Completed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Maintenance Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Schedule Maintenance Ticket"
        maxWidth="600px"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Select Appliance</label>
            <select
              className="form-control"
              value={formData.appliance}
              onChange={(e) => setFormData({ ...formData, appliance: parseInt(e.target.value) })}
              required
            >
              {appliances.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.appliance_code}) - Currently {a.status}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Service Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.service_date}
                onChange={(e) => setFormData({ ...formData, service_date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Appliance Condition</label>
              <select
                className="form-control"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good / Working</option>
                <option value="minor_wear">Minor Wear</option>
                <option value="needs_repair">Needs Repair</option>
                <option value="damaged">Damaged</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Assigned Technician</label>
              <input
                type="text"
                className="form-control"
                value={formData.technician_name}
                onChange={(e) => setFormData({ ...formData, technician_name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Estimated Service Cost (₹)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Service Description / Issue</label>
            <textarea
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Deep foam cleaning, thermostat calibration..."
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Maintenance Log
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default AdminMaintenance;
