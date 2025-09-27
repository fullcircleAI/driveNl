// React import removed - not needed in newer versions
import { NavLink, useLocation } from 'react-router-dom';
import { FiUser, FiEdit, FiAward, FiSettings } from 'react-icons/fi';
import './Navigation.css';

export function Navigation() {
  const location = useLocation();
  // Update the hideFooter logic:
  const hideFooter =
    /^\/practice\/[^/]+$/.test(location.pathname) ||
    (/^\/mock-exam(\/|$)/.test(location.pathname) && location.pathname !== '/mock-exam');
  

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <FiUser size={20} /> },
    { label: 'Practice', path: '/practice', icon: <FiEdit size={20} /> },
    { label: 'Mock Exam', path: '/quiz-selection', icon: <FiAward size={20} /> },
    { label: 'Settings', path: '/settings', icon: <FiSettings size={20} /> },
  ];

  return (
    <>
      <aside className="sidebar">
        <nav className="nav-list">
          {menuItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => isActive ? 'nav-btn active' : 'nav-btn'}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
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