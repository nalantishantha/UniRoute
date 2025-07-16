import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import companyLogo from '../assets/Companylogo.png';
import Logouticon from '../assets/Logouticon.png';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ activePage = 'internship', onExpandChange }) => {
  const [isExpanded, setIsExpanded] = useState(false); // Start collapsed

  const menuItems = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard', path: '/company/dashboard' },
    { id: 'internship', icon: '💼', label: 'Internship Opportunity', path: '/company/internship' },
    { id: 'ad-publish', icon: '📢', label: 'Publish Ads', path: '/company/ad-publish' },
    { id: 'courses', icon: '📚', label: 'Course Offered', path: '/company/course' },
    { id: 'announcement', icon: '💬', label: 'Announcement', path: '/company/announcement', hasNotification: true }
  ];

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  // Communicate state changes to parent component
  useEffect(() => {
    if (onExpandChange) {
      onExpandChange(isExpanded);
    }
  }, [isExpanded, onExpandChange]);

  return (
    <aside 
      className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >

      {/* Navigation Menu */}
      <nav className="nav-menu">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <NavLink 
                to={item.path} 
                className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                title={!isExpanded ? item.label : ''}
                activeClassName="active"
              >
                <div className="nav-icon">
                  <span className="icon">{item.icon}</span>
                </div>
                {isExpanded && (
                  <>
                    <span className="nav-label">{item.label}</span>
                    {item.hasNotification && (
                      <span className="notification-badge">1</span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="sidebar-bottom">
        {/* Settings */}
        <div className="nav-item">
          <div className="nav-icon">
            <span className="icon">⚙️</span>
          </div>
          {isExpanded && <span className="nav-label">Settings</span>}
        </div>

        {/* Logout */}
        <div className="nav-item logout">
          <div className="nav-icon">
            <span className="icon"><img src={Logouticon} alt="Logouticon" className="logout-image" /></span>
          </div>
          {isExpanded && <span className="nav-label">Logout</span>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;