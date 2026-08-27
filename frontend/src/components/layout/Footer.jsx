import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Smartphone, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--navy-darkest)',
      color: '#94A3B8',
      borderTop: '1px solid var(--navy-surface)',
      marginTop: 'auto'
    }}>
      {/* Capability Feature Bar matching reference footer strip */}
      <div style={{
        backgroundColor: 'var(--navy-primary)',
        borderBottom: '1px solid var(--navy-border)',
        padding: '1.25rem 0'
      }}>
        <div className="container-custom" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          alignItems: 'center'
        }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(0, 196, 255, 0.1)', color: '#00C4FF' }}>
              <Smartphone size={20} />
            </div>
            <div>
              <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.85rem' }}>RESPONSIVE DESIGN</div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Mobile, Tablet, Desktop</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(124, 58, 237, 0.15)', color: '#A855F7' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.85rem' }}>AI POWERED</div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Smart Recommendations</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.85rem' }}>SECURE & RELIABLE</div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>JWT, Role Based Access</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(30, 96, 213, 0.15)', color: '#38BDF8' }}>
              <Activity size={20} />
            </div>
            <div>
              <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.85rem' }}>REAL TIME UPDATES</div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Live Data & Notifications</div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container-custom" style={{ padding: '3.5rem 1.5rem 2.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #1E60D5 0%, #00C4FF 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3L3 19H8.5L12 11.5L15.5 19H21L12 3Z" fill="white" />
                  <circle cx="12" cy="11.5" r="2" fill="#00C4FF" />
                </svg>
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.04em' }}>
                APPLINEX
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              AI-Enabled Smart Household Appliance Rental Management System. High-efficiency home appliances delivered, installed, and fully maintained.
            </p>
            <div style={{ fontSize: '0.8rem', color: '#00C4FF', fontWeight: 600 }}>
              Smart Living, Simplified.
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem', letterSpacing: '0.02em' }}>
              POPULAR CATEGORIES
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
              <li><Link to="/appliances?category=refrigerators" style={{ color: '#94A3B8' }}>Smart Refrigerators</Link></li>
              <li><Link to="/appliances?category=washing-machines" style={{ color: '#94A3B8' }}>AI Direct Drive Washers</Link></li>
              <li><Link to="/appliances?category=air-conditioners" style={{ color: '#94A3B8' }}>Split Inverter ACs</Link></li>
              <li><Link to="/appliances?category=microwaves-ovens" style={{ color: '#94A3B8' }}>Convection Microwaves</Link></li>
              <li><Link to="/appliances?category=dishwashers" style={{ color: '#94A3B8' }}>Hygienic Dishwashers</Link></li>
              <li><Link to="/appliances?category=air-purifiers" style={{ color: '#94A3B8' }}>HEPA Air Purifiers</Link></li>
            </ul>
          </div>

          {/* Platform & Portals */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem', letterSpacing: '0.02em' }}>
              PORTALS & ACCESS
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
              <li><Link to="/dashboard" style={{ color: '#94A3B8' }}>Customer Dashboard</Link></li>
              <li><Link to="/appliances" style={{ color: '#94A3B8' }}>Appliance Catalog</Link></li>
              <li><Link to="/admin/login" style={{ color: '#94A3B8' }}>Admin Management Portal</Link></li>
              <li><Link to="/support/login" style={{ color: '#94A3B8' }}>Support & Tickets Desk</Link></li>
              <li><Link to="/dashboard/recommendations" style={{ color: '#94A3B8' }}>AI Recommendations</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem', letterSpacing: '0.02em' }}>
              CUSTOMER SUPPORT
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Phone size={16} color="#00C4FF" />
                <span>+91 80000 12345 (24/7 Helpline)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Mail size={16} color="#00C4FF" />
                <span>support@applinex.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <MapPin size={16} color="#00C4FF" style={{ marginTop: '3px', flexShrink: 0 }} />
                <span>APPLINEX Tech Park, 100 Feet Rd, Indiranagar, Bangalore, KA 560038</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem'
        }}>
          <div>
            © {new Date().getFullYear()} APPLINEX Technologies Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ color: '#64748B' }}>Privacy Policy</a>
            <a href="#" style={{ color: '#64748B' }}>Terms of Service</a>
            <a href="#" style={{ color: '#64748B' }}>Rental Agreement</a>
            <a href="#" style={{ color: '#64748B' }}>Security & Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
