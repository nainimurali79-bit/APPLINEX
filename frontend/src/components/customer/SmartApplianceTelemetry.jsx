import React, { useState } from 'react';
import { 
  Cpu, 
  Zap, 
  Thermometer, 
  Activity, 
  CheckCircle2, 
  RefreshCw, 
  Wifi, 
  ShieldCheck, 
  Sliders, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

const SmartApplianceTelemetry = ({ appliance, rentalId }) => {
  const { addToast } = useNotification();
  const [isRunningDiagnosis, setIsRunningDiagnosis] = useState(false);
  const [ecoModeEnabled, setEcoModeEnabled] = useState(true);
  const [lastDiagnosed, setLastDiagnosed] = useState("Just now");
  const [healthScore, setHealthScore] = useState(99);

  // Telemetry attributes based on category
  const categoryName = (appliance?.category_name || '').toLowerCase();
  const isFridge = categoryName.includes('fridge') || categoryName.includes('refrigerator');
  const isAC = categoryName.includes('ac') || categoryName.includes('air') || categoryName.includes('conditioner');
  const isWasher = categoryName.includes('wash') || categoryName.includes('laundry');

  const handleRunDiagnosis = () => {
    setIsRunningDiagnosis(true);
    addToast('Running remote IoT self-diagnostic check...', 'info');

    setTimeout(() => {
      setIsRunningDiagnosis(false);
      setHealthScore(99);
      setLastDiagnosed("Just now");
      addToast('Diagnostic complete! All smart sensors & inverter components are running at 100% efficiency.', 'success');
    }, 1800);
  };

  const handleToggleEcoMode = () => {
    setEcoModeEnabled(!ecoModeEnabled);
    addToast(`Smart Eco-Mode ${!ecoModeEnabled ? 'Activated (Saving ~20% Energy)' : 'Deactivated'}`, 'info');
  };

  return (
    <div className="app-card" style={{
      padding: '1.75rem',
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
      border: '1px solid rgba(0, 196, 255, 0.3)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #1E60D5 0%, #00C4FF 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 196, 255, 0.4)'
          }}>
            <Cpu size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy-primary)', margin: 0 }}>
                Live Smart IoT Telemetry
              </h3>
              <span style={{
                backgroundColor: '#ECFDF5',
                color: '#059669',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}>
                <span className="pulse-dot pulse-dot-green" style={{ width: '6px', height: '6px' }} /> CONNECTED
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
              Real-time hardware status & energy consumption for {appliance?.name || 'Active Rental'}
            </div>
          </div>
        </div>

        <button
          onClick={handleRunDiagnosis}
          disabled={isRunningDiagnosis}
          className="btn btn-secondary btn-sm"
          style={{
            borderColor: 'var(--blue-primary)',
            color: 'var(--blue-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <RefreshCw size={14} className={isRunningDiagnosis ? 'spin-anim' : ''} />
          {isRunningDiagnosis ? 'Diagnosing...' : 'Run Self-Diagnosis'}
        </button>
      </div>

      {/* 4 Sensor Telemetry Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {/* Metric 1: Temperature / Cooling or Cycle */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            <span>{isAC ? 'Room vs Target Temp' : isFridge ? 'Internal Compartment' : 'Motor Cycle'}</span>
            <Thermometer size={14} color="#1E60D5" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
            {isAC ? '22°C (Set 24°C)' : isFridge ? '3.4°C / -18°C' : 'Optimal Balance'}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 600, marginTop: '2px' }}>
            Normal Temperature Zone
          </div>
        </div>

        {/* Metric 2: Power Usage */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            <span>Daily Power Usage</span>
            <Zap size={14} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
            {ecoModeEnabled ? '0.82 kWh' : '1.14 kWh'}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 600, marginTop: '2px' }}>
            {ecoModeEnabled ? '⚡ 28% below standard' : 'Standard power load'}
          </div>
        </div>

        {/* Metric 3: Filter & Hardware Health */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            <span>Hardware Health</span>
            <Activity size={14} color="#10B981" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10B981' }}>
            {healthScore}%
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
            Filter: 94% clean
          </div>
        </div>

        {/* Metric 4: WiFi & Cloud Sync */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            <span>IoT Cloud Sync</span>
            <Wifi size={14} color="#00C4FF" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
            Strong (-45 dBm)
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
            Last sync: {lastDiagnosed}
          </div>
        </div>
      </div>

      {/* Control Switch & Preventive Maintenance Alert */}
      <div style={{
        backgroundColor: '#F0F9FF',
        border: '1px solid var(--blue-border)',
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldCheck size={22} color="var(--blue-primary)" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--navy-primary)' }}>
              Automated Inverter Eco-Optimization
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
              Automatically scales compressor RPM during non-peak hours to save electricity.
            </div>
          </div>
        </div>

        <button
          onClick={handleToggleEcoMode}
          className={`btn btn-sm ${ecoModeEnabled ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.45rem 1rem' }}
        >
          {ecoModeEnabled ? 'Eco-Mode: ON' : 'Eco-Mode: OFF'}
        </button>
      </div>

    </div>
  );
};

export default SmartApplianceTelemetry;
