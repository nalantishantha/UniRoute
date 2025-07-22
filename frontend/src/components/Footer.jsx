import React from 'react';
import './Footer.css';

const Footer = ({ 
  title = "Stay Connected", 
  subtitle = "Subscribe to our newsletter for updates",
  theme = "dark", // "dark" or "light"
  sidebarExpanded = false
}) => {
  return (
    <footer className={`app-footer ${theme} ${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <div className="footer-content">
        <h3>{title}</h3>
        {subtitle && <p className="footer-subtitle">{subtitle}</p>}
        <div className="newsletter">
          <input 
            type="email" 
            placeholder="Your email" 
            className="newsletter-input"
          />
          <button className="newsletter-btn">Subscribe</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;