import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { FiUser, FiEdit, FiAward, FiSettings } from 'react-icons/fi';
import './Navigation.css';
import { QRCodeSVG } from 'qrcode.react';

export function Navigation() {
  const { t_nested } = useLanguage();
  const location = useLocation();
  // Update the hideFooter logic:
  const hideFooter =
    /^\/practice\/[^/]+$/.test(location.pathname) ||
    (/^\/mock-exam(\/|$)/.test(location.pathname) && location.pathname !== '/mock-exam');

  const menuItems = [
    { label: t_nested('navigation.dashboard'), path: '/dashboard', icon: <FiUser size={20} /> },
    { label: t_nested('navigation.practice'), path: '/practice', icon: <FiEdit size={20} /> },
    { label: t_nested('practice.mockExam'), path: '/quiz-selection', icon: <FiAward size={20} /> },
    { label: t_nested('navigation.settings'), path: '/settings', icon: <FiSettings size={20} /> },
  ];

  return (
    <>
      <aside className="sidebar">
        <nav className="nav-list">
          {menuItems.map((item, idx) => (
            <>
              <NavLink key={item.path} to={item.path} className={({ isActive }) => isActive ? 'nav-btn active' : 'nav-btn'}>
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
              {item.label === t_nested('navigation.settings') && (
                <div className="sidebar-qr">
                  <div className="qr-label">Mobile Access</div>
                  <QRCodeSVG 
                    value={`http://Kwabenas-MacBook-Air.local:5173${window.location.pathname}${window.location.search}`} 
                    size={80} 
                    fgColor="#1A3E7A" 
                    bgColor="#fff" 
                  />
                  <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.5rem', textAlign: 'center' }}>
                    Scan to open on mobile
                  </div>
                </div>
              )}
            </>
          ))}
        </nav>
      </aside>
      {!hideFooter && (
        <footer className="footer-nav">
          {menuItems.map(item => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => isActive ? 'footer-btn active' : 'footer-btn'}>
              <span className="footer-icon">{item.icon}</span>
              {/* Hide text on mobile/iPad, show only on desktop if needed */}
              <span className="footer-label">{item.label}</span>
            </NavLink>
          ))}
        </footer>
      )}
    </>
  );
} 