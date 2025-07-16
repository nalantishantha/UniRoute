import React, { useState, useEffect } from 'react';
import './UniSidebar.css';
import Logouticon from '../assets/Logouticon.png';
import universityLogo from '../assets/Companylogo.png';
import { NavLink } from 'react-router-dom';

const UniSidebar = ({ activePage = 'dashboard', onExpandChange }) => {
  const [isExpanded, setIsExpanded] = useState(false); // Start collapsed

  const menuItems = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard', path: '/university/dashboard' },
    { id: 'portfolio', icon: '📊', label: 'Manage Portfolio', path: '/university/portfolio' },
    { id: 'announcement', icon: '📢', label: 'Announcement', path: '/university/announcement' },
    { id: 'academic-content', icon: '📚', label: 'Academic Content', path: '/university/academic-content' },
    { id: 'publish-ads', icon: '📝', label: 'Publish Ads', path: '/university/publish-ads' }
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
      className={`uni-sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >

      {/* Navigation Menu */}
      <nav className="uni-nav-menu">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <NavLink 
                to={item.path} 
                className={`uni-nav-item ${activePage === item.id ? 'active' : ''}`}
                title={!isExpanded ? item.label : ''}
                activeClassName="active"
              >
                <div className="uni-nav-icon">
                  <span className="uni-icon">{item.icon}</span>
                </div>
                {isExpanded && (
                  <>
                    <span className="uni-nav-label">{item.label}</span>
                    {item.hasNotification && (
                      <span className="uni-notification-badge">1</span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="uni-sidebar-bottom">
        {/* Settings */}
        <div className="uni-nav-item">
          <div className="uni-nav-icon">
            <span className="uni-icon">⚙️</span>
          </div>
          {isExpanded && <span className="uni-nav-label">Settings</span>}
        </div>

        {/* Logout */}
        <div className="uni-nav-item uni-logout">
          <div className="uni-nav-icon">
            <span className="uni-icon"><img src={Logouticon} alt="Logouticon" className="uni-logout-image" /></span>
          </div>
          {isExpanded && <span className="uni-nav-label">Logout</span>}
        </div>
      </div>
    </aside>
  );
};

export default UniSidebar;