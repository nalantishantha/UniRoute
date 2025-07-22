import React, { useState, useEffect } from 'react';
import UniversitySidebar from '../../components/Navigation/UniversitySidebar'; // CHANGED: Import UniversitySidebar
import UniversityNavbar from '../../components/Navigation/UniversityNavbar';
import Footer from '../../components/Footer';
import './AdPublish.css';

const AdPublish = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // CHANGED: Rename from isSidebarExpanded to isSidebarOpen
  const [currentStep, setCurrentStep] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [adSpaces, setAdSpaces] = useState([]);
  const [universityBookings, setUniversityBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [availabilityCheck, setAvailabilityCheck] = useState(null);
  
  // Form Data
  const [adData, setAdData] = useState({
    title: '',
    description: '',
    image_url: '',
    target_url: '',
    space_id: '',
    start_date: '',
    end_date: '',
    agreeTerms: false
  });

  // Payment Data
  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'credit-card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    email: '',
    billingAddress: ''
  });

  // Video upload state
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');

  const categories = ['Technology', 'Education', 'Healthcare', 'Finance', 'Marketing', 'Business', 'Other'];
  const audiences = ['All Students', 'Undergraduate', 'Graduate', 'Faculty', 'Alumni'];
  const adTypes = [
    { id: 'banner', name: 'Banner Ad', price: 50, description: 'Display banner on homepage' },
    { id: 'featured', name: 'Featured Listing', price: 100, description: 'Highlighted in search results' },
    { id: 'sponsored', name: 'Sponsored Content', price: 150, description: 'Native advertising content' },
    { id: 'premium', name: 'Premium Placement', price: 200, description: 'Top placement across site' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAdData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const calculateTotalDays = () => {
    if (!adData.start_date || !adData.end_date) return 0;
    const start = new Date(adData.start_date);
    const end = new Date(adData.end_date);
    return Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
  };

  const calculateTotalPrice = () => {
    if (!availabilityCheck || !availabilityCheck.space) return 0;
    const days = calculateTotalDays();
    const pricePerDay = parseFloat(availabilityCheck.space.price_per_day || 0);
    return days * pricePerDay;
  };

  // Helper function to calculate remaining days for an ad
  const calculateRemainingDays = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Helper function to format status display
  const getStatusDisplay = (status) => {
    const statusMap = {
      'Pending': { text: 'Pending', class: 'pending' },
      'Confirmed': { text: 'Active', class: 'active' },
      'Rejected': { text: 'Rejected', class: 'rejected' },
      'Completed': { text: 'Completed', class: 'completed' }
    };
    return statusMap[status] || { text: status, class: 'unknown' };
  };

  // Helper function to get ad meta information
  const getAdMeta = (booking) => {
    const statusDisplay = getStatusDisplay(booking.status);
    if (booking.status === 'Confirmed') {
      const remainingDays = calculateRemainingDays(booking.end_date);
      return remainingDays > 0 ? `${remainingDays} days left` : 'Completed';
    } else if (booking.status === 'Pending') {
      return 'Under review';
    } else if (booking.status === 'Rejected') {
      return 'Rejected by admin';
    } else {
      return 'Completed';
    }
  };

  const calculateTotal = () => {
    const totalPrice = calculateTotalPrice();
    const tax = totalPrice * 0.1; // 10% tax
    return { subtotal: totalPrice, tax, total: totalPrice + tax };
  };

  const handlePublish = () => {
    // Check if we have availability data and required fields
    if (!availabilityCheck || !availabilityCheck.available) {
      setMessage({ type: 'error', text: 'Please check availability first' });
      return;
    }
    
    if (!adData.title || !adData.space_id || !adData.image_url || !adData.start_date || !adData.end_date) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }
    
    submitAdvertisementBooking();
  };

  const handlePayment = (e) => {
    e.preventDefault();
    // Process payment logic here
    alert('Payment processed successfully! Your ad will be reviewed and published within 24 hours.');
    setShowPaymentModal(false);
    // Reset form or redirect
  };

  return (
    <div className="ad-publish-page">
      {/* SIDEBAR AT THE VERY TOP - OUTSIDE CONTAINER */}
      <UniversitySidebar 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* NAVBAR */}
      <UniversityNavbar 
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        sidebarExpanded={isSidebarOpen}
      />

      {/* MAIN CONTENT */}
      <main className={`ad-publish-main ${isSidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        {/* Content Layout */}
        <div className="ad-publish-content">
          {/* Main Form */}
          <div className="form-container">
            {/* Progress Steps */}
            <div className="progress-steps">
              <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-label">Ad Details</div>
              </div>
              <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-label">Targeting & Budget</div>
              </div>
              <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <div className="step-label">Review & Publish</div>
              </div>
            </div>

            {/* Step 1: Ad Details */}
            {currentStep === 1 && (
              <div className="form-section">
                <h2>📝 Create Your Advertisement</h2>
                <p className="section-description">Provide the basic information about your advertisement</p>

                {message.text && (
                  <div className={`message ${message.type}`}>
                    {message.text}
                  </div>
                )}

                <div className="form-group">
                  <label>Advertisement Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={adData.title}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter a compelling advertisement title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Advertisement Space *</label>
                  <select
                    name="space_id"
                    value={adData.space_id}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Advertisement Space</option>
                    {adSpaces.map(space => (
                      <option key={space.space_id} value={space.space_id}>
                        {space.name} - ${space.price_per_day}/day ({space.recommended_size})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label style={{ fontWeight: 700, marginBottom: 8, display: 'block' }}>
                    <span role="img" aria-label="media">🖼️</span> Advertisement Media
                  </label>
                  <div className="company-adpublish-media-upload-container" style={{ display: 'flex', gap: 24 }}>
                    {/* Image Upload */}
                    <div className="company-adpublish-image-upload-area" style={{ flex: 1 }}>
                      <h4 className="company-adpublish-media-title" style={{ marginBottom: 16 }}>
                        <span role="img" aria-label="upload-image">📸</span> Upload Image
                      </h4>
                      {adData.imageUrl ? (
                        <div className="company-adpublish-image-preview">
                          <img src={adData.imageUrl} alt="Ad preview" />
                          <button
                            type="button"
                            className="company-adpublish-remove-media-btn"
                            onClick={() => setAdData(prev => ({ ...prev, imageUrl: '' }))}
                          >×</button>
                        </div>
                      ) : (
                        <div className="company-adpublish-default-image">
                          <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80" alt="Default ad" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="company-adpublish-file-input"
                        id="university-image-upload"
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setAdData(prev => ({ ...prev, imageUrl: reader.result }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label htmlFor="university-image-upload" className="company-adpublish-upload-btn">
                        Choose Image
                      </label>
                    </div>
                    {/* Video Upload */}
                    <div className="company-adpublish-video-upload-area" style={{ flex: 1 }}>
                      <h4 className="company-adpublish-media-title" style={{ marginBottom: 16 }}>
                        <span role="img" aria-label="upload-video">🎥</span> Upload Video
                      </h4>
                      {videoPreview ? (
                        <div className="company-adpublish-video-preview">
                          <video src={videoPreview} controls className="company-adpublish-preview-video" style={{ width: '100%', maxHeight: 220, borderRadius: 8 }} />
                          <button
                            type="button"
                            className="company-adpublish-remove-media-btn"
                            onClick={() => {
                              setVideoPreview('');
                              setVideoFile(null);
                            }}
                          >×</button>
                        </div>
                      ) : (
                        <div className="company-adpublish-default-video company-adpublish-video-placeholder" style={{ padding: '32px 0', textAlign: 'center', color: '#6b7280', background: '#e0e7ff', borderRadius: 8, marginBottom: 16 }}>
                          <span className="company-adpublish-video-icon" style={{ fontSize: 48, display: 'block', marginBottom: 8 }}>🎥</span>
                          <p style={{ margin: 0 }}>No video selected</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="video/*"
                        className="company-adpublish-file-input"
                        id="university-video-upload"
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file) {
                            setVideoFile(file);
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setVideoPreview(reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label htmlFor="university-video-upload" className="company-adpublish-upload-btn">
                        Choose Video
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Website URL</label>
                  <input
                    type="url"
                    name="image_url"
                    value={adData.image_url}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="https://example.com/your-ad-image.jpg"
                    required
                  />
                  {adData.image_url && (
                    <div className="image-preview">
                      <img src={adData.image_url} alt="Ad preview" style={{maxWidth: '300px', marginTop: '10px'}} 
                           onError={(e) => e.target.style.display = 'none'} />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Target URL (optional)</label>
                  <input
                    type="url"
                    name="target_url"
                    value={adData.target_url}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="https://your-website.com (where users will go when they click)"
                  />
                </div>

                <div className="navigation-buttons">
                  <button 
                    type="button" 
                    onClick={nextStep} 
                    className="btn btn-primary"
                    disabled={!adData.title || !adData.space_id || !adData.image_url}
                  >
                    Next: Schedule & Budget →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Schedule & Budget */}
            {currentStep === 2 && (
              <div className="form-section">
                <h2>📅 Schedule & Budget</h2>
                <p className="section-description">Choose your advertisement dates and review the pricing</p>

                {message.text && (
                  <div className={`message ${message.type}`}>
                    {message.text}
                  </div>
                )}

                <div className="date-range-container">
                  <div className="form-group">
                    <label>Start Date *</label>
                    <input
                      type="date"
                      name="start_date"
                      value={adData.start_date}
                      onChange={handleInputChange}
                      className="form-input"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date *</label>
                    <input
                      type="date"
                      name="end_date"
                      value={adData.end_date}
                      onChange={handleInputChange}
                      className="form-input"
                      min={adData.start_date || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <button 
                    type="button" 
                    onClick={checkAvailability}
                    className="btn btn-secondary"
                    disabled={!adData.space_id || !adData.start_date || !adData.end_date || loading}
                  >
                    {loading ? 'Checking...' : 'Check Availability & Get Price'}
                  </button>
                </div>

                {availabilityCheck && (
                  <div className={`availability-result ${availabilityCheck.available ? 'available' : 'unavailable'}`}>
                    <h4>
                      {availabilityCheck.available ? '✅ Available' : '❌ Not Available'}
                    </h4>
                    <p>{availabilityCheck.message}</p>
                    
                    {availabilityCheck.available && (
                      <div className="budget-summary">
                        <h4>💰 Cost Breakdown</h4>
                        <div className="cost-item">
                          <span>Space: {availabilityCheck.space?.name}</span>
                          <span>${availabilityCheck.space?.price_per_day}/day</span>
                        </div>
                        <div className="cost-item">
                          <span>Duration: {calculateTotalDays()} days</span>
                          <span>${calculateTotalPrice()}</span>
                        </div>
                        <div className="cost-item">
                          <span>Tax (10%)</span>
                          <span>${(calculateTotalPrice() * 0.1).toFixed(2)}</span>
                        </div>
                        <div className="cost-item total">
                          <span>Total</span>
                          <span>${(calculateTotalPrice() * 1.1).toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="navigation-buttons">
                  <button type="button" className="btn btn-secondary" onClick={prevStep}>
                    ← Back
                  </button>
                  <button 
                    type="button" 
                    onClick={nextStep} 
                    className="btn btn-primary"
                    disabled={!availabilityCheck || !availabilityCheck.available}
                  >
                    Next: Review & Publish →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review & Publish */}
            {currentStep === 3 && (
              <div className="form-section">
                <h2>✅ Review Your Advertisement</h2>
                <p className="section-description">Review your ad details before publishing</p>

                <div className="review-section">
                  <div className="review-group">
                    <h4>📋 Ad Information</h4>
                    <div className="review-item">
                      <strong>Title:</strong> {adData.title}
                    </div>
                    <div className="review-item">
                      <strong>Advertisement Space:</strong> {availabilityCheck?.space?.name}
                    </div>
                    <div className="review-item">
                      <strong>Image URL:</strong> {adData.image_url}
                    </div>
                    <div className="review-item">
                      <strong>Target URL:</strong> {adData.target_url || 'None'}
                    </div>
                  </div>

                  <div className="review-group">
                    <h4>📅 Campaign Schedule</h4>
                    <div className="review-item">
                      <strong>Start Date:</strong> {adData.start_date}
                    </div>
                    <div className="review-item">
                      <strong>End Date:</strong> {adData.end_date}
                    </div>
                    <div className="review-item">
                      <strong>Duration:</strong> {calculateTotalDays()} days
                    </div>
                    <div className="review-item">
                      <strong>Price per Day:</strong> ${availabilityCheck?.space?.price_per_day}
                    </div>
                  </div>

                  <div className="review-group">
                    <h4>💰 Payment Summary</h4>
                    <div className="final-cost-breakdown">
                      <div className="cost-item">
                        <span>Subtotal ({calculateTotalDays()} days)</span>
                        <span>${calculateTotalPrice()}</span>
                      </div>
                      <div className="cost-item">
                        <span>Tax (10%)</span>
                        <span>${(calculateTotalPrice() * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="cost-item total">
                        <span>Total Amount</span>
                        <span>${(calculateTotalPrice() * 1.1).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={adData.agreeTerms}
                    onChange={handleInputChange}
                    className="form-checkbox"
                    id="agree-terms"
                  />
                  <label htmlFor="agree-terms" className="checkbox-label">
                    I agree to the Terms of Service and Privacy Policy
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="form-navigation">
              {currentStep > 1 && (
                <button type="button" className="btn-back" onClick={prevStep}>
                  ← Back
                </button>
              )}
              
              {currentStep < 3 ? (
                <button type="button" className="btn-next" onClick={nextStep}>
                  Next →
                </button>
              ) : (
                <button 
                  type="button" 
                  className="btn-publish" 
                  onClick={handlePublish}
                  disabled={!adData.agreeTerms}
                >
                  Proceed to Payment
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="ad-preview-section">
            {/* Ad Preview */}
            <div className="preview-card">
              <h3>👀 Live Preview</h3>
              <p>See how your ad will appear to students</p>
              
              <div className="ad-preview">
                <div className="preview-container">
                  {adData.imageUrl && (
                    <div className="preview-image">
                      <img src={adData.imageUrl} alt="Ad preview" />
                    </div>
                  )}
                  <div className="preview-content">
                    <h5>{adData.title || 'Your Ad Title Here'}</h5>
                    <p>{adData.description || 'Your ad description will appear here...'}</p>
                    <div className="preview-company">{adData.company || 'Company Name'}</div>
                    <button className="preview-btn">Learn More</button>
                  </div>
                </div>
                <p className="preview-note">*Preview may vary from actual placement</p>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="performance-card">
              <h3>📊 Expected Performance</h3>
              <p>Estimated metrics for your campaign</p>
              
              <div className="metrics-grid">
                <div className="metric-item">
                  <div className="metric-icon">👁️</div>
                  <div className="metric-value">2,500+</div>
                  <div className="metric-label">Daily Views</div>
                </div>
                <div className="metric-item">
                  <div className="metric-icon">👆</div>
                  <div className="metric-value">3.2%</div>
                  <div className="metric-label">Click Rate</div>
                </div>
                <div className="metric-item">
                  <div className="metric-icon">🎯</div>
                  <div className="metric-value">85%</div>
                  <div className="metric-label">Target Match</div>
                </div>
                <div className="metric-item">
                  <div className="metric-icon">📈</div>
                  <div className="metric-value">92%</div>
                  <div className="metric-label">Completion</div>
                </div>
              </div>
            </div>

            {/* Active Ads */}
            <div className="active-ads-card">
              <h3>📢 Your Active Ads</h3>
              <p>Recently requested campaigns</p>
              
              <div className="ad-list">
                {universityBookings.length === 0 ? (
                  <div className="no-ads">
                    <p>No advertisement requests yet.</p>
                    <p>Create your first ad campaign!</p>
                  </div>
                ) : (
                  universityBookings.slice(0, 5).map((booking) => {
                    const statusDisplay = getStatusDisplay(booking.status);
                    return (
                      <div key={booking.booking_id} className="ad-item">
                        <div className={`ad-status ${statusDisplay.class}`}>
                          {statusDisplay.text}
                        </div>
                        <div className="ad-details">
                          <strong>{booking.title}</strong>
                          <div className="ad-meta">
                            <span>{getAdMeta(booking)}</span>
                            <span>${booking.total_price}</span>
                          </div>
                          <div className="ad-space-info">
                            <small>{booking.space_name} • {booking.start_date} to {booking.end_date}</small>
                          </div>
                        </div>
                        <button 
                          className="view-btn"
                          onClick={() => {
                            // Could implement view details functionality
                            alert(`Booking ID: ${booking.booking_id}\nStatus: ${booking.status}\nTotal: $${booking.total_price}`);
                          }}
                        >
                          View
                        </button>
                      </div>
                    );
                  })
                )}
                
                {universityBookings.length > 5 && (
                  <div className="see-more">
                    <button className="btn-link" onClick={() => {
                      // Could implement view all functionality
                      alert(`You have ${universityBookings.length} total advertisement requests`);
                    }}>
                      See all {universityBookings.length} requests →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="ad-publish-footer">
          <div className="footer-content">
            <h3>Stay Connected</h3>
            <div className="newsletter">
              <input type="email" placeholder="Your email" />
              <button>Subscribe</button>
            </div>
          </div>
        </footer>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="company-adpublish-admin-modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="company-adpublish-admin-modal-content" onClick={e => e.stopPropagation()}>
            <div className="company-adpublish-admin-modal-header">
              <h2>💳 Complete Payment</h2>
              <button className="company-adpublish-admin-modal-close" onClick={() => setShowPaymentModal(false)}>✕</button>
            </div>
            <div className="company-adpublish-admin-modal-body">
              <div className="company-adpublish-admin-payment-summary">
                <h3>Order Summary</h3>
                <div className="company-adpublish-admin-summary-item">
                  <span>Ad Campaign: ${subtotal}</span>
                </div>
                <div className="company-adpublish-admin-summary-item">
                  <span>Tax (10%)</span>
                  <span>${(calculateTotalPrice() * 0.1).toFixed(2)}</span>
                </div>
                <div className="company-adpublish-admin-summary-total">
                  <span>Total</span>
                  <span>${(calculateTotalPrice() * 1.1).toFixed(2)}</span>
                </div>
              </div>

              <form onSubmit={handlePayment} className="company-adpublish-admin-payment-form">
                <h3>Payment Information</h3>
                
                <div className="company-adpublish-admin-payment-methods">
                  <div className="company-adpublish-admin-payment-option">
                    <label className="company-adpublish-admin-payment-label">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit-card"
                        checked={paymentData.paymentMethod === 'credit-card'}
                        onChange={handlePaymentChange}
                        className="company-adpublish-admin-form-radio"
                      />
                      💳 Credit/Debit Card
                      <div className="company-adpublish-admin-card-icons">
                        <span className="company-adpublish-admin-card-icon">💳</span>
                        <span className="company-adpublish-admin-card-icon">💳</span>
                      </div>
                    </label>
                  </div>
                  
                  <div className="company-adpublish-admin-payment-option">
                    <label className="company-adpublish-admin-payment-label">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentData.paymentMethod === 'paypal'}
                        onChange={handlePaymentChange}
                        className="company-adpublish-admin-form-radio"
                      />
                      🅿️ PayPal
                      <span className="company-adpublish-admin-paypal-icon">🅿️</span>
                    </label>
                  </div>
                </div>

                {paymentData.paymentMethod === 'credit-card' && (
                  <div className="company-adpublish-admin-credit-card-form">
                    <div className="company-adpublish-admin-form-group">
                      <label>Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentData.cardNumber}
                        onChange={handlePaymentChange}
                        className="company-adpublish-admin-form-input"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    
                    <div className="company-adpublish-admin-card-details-row">
                      <div className="company-adpublish-admin-form-group">
                        <label>Expiry Date</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={paymentData.expiryDate}
                          onChange={handlePaymentChange}
                          className="company-adpublish-admin-form-input"
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div className="company-adpublish-admin-form-group">
                        <label>CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          value={paymentData.cvv}
                          onChange={handlePaymentChange}
                          className="company-adpublish-admin-form-input"
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="company-adpublish-admin-form-group">
                      <label>Cardholder Name</label>
                      <input
                        type="text"
                        name="cardName"
                        value={paymentData.cardName}
                        onChange={handlePaymentChange}
                        className="company-adpublish-admin-form-input"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="company-adpublish-admin-form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={paymentData.email}
                    onChange={handlePaymentChange}
                    className="company-adpublish-admin-form-input"
                    placeholder="john@company.com"
                    required
                  />
                </div>

                <div className="company-adpublish-admin-form-actions">
                  <button type="button" className="company-adpublish-admin-btn-cancel" onClick={() => setShowPaymentModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="company-adpublish-admin-btn-pay-now">
                    Pay ${total.toFixed(2)}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdPublish;