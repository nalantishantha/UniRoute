import React from 'react';
import './uniheader.css';
import unilogo from '../assets/unilogo.png';

const UniHeader = ({ sidebarExpanded = false }) => {
  return (
    <header className={`uni-header ${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <div className="uni-header-content">
        {/* Left Section - University Logo and Name */}
        <div className="uni-header-left">
          <div className="university-logo">
            <img 
              src={unilogo} 
              alt="University Logo" 
              className="logo-icon"
            />
            <span className="university-name">University of Colombo</span>
          </div>
        </div>

        {/* Right Section - Search, Notifications, Profile */}
        <div className="uni-header-right">
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search..." 
              className="search-input"
            />
          </div>
          
          <button className="notification-btn">
            <span className="notification-icon">🔔</span>
          </button>
          
          <button className="settings-btn">
            <span className="settings-icon">⭐</span>
          </button>
          
          <div className="profile-avatar">
            <img 
              src="https://randomuser.me/api/portraits/men/15.jpg" 
              alt="Profile" 
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default UniHeader;