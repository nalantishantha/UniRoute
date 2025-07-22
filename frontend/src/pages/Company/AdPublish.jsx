import React, { useState } from 'react';
import CompanySidebar from '../../components/Navigation/CompanySidebar'; // CHANGED: Import CompanySidebar
import CompanyDashboardNavbar from '../../components/Navigation/CompanyDashboardNavbar';
import './AdPublish.css';

const AdPublish = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // CHANGED: Rename from isSidebarExpanded to isSidebarOpen
  const [currentStep, setCurrentStep] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Form Data
  const [adData, setAdData] = useState({
    title: '',
    description: '',
    category: 'Technology',
    targetAudience: 'All Students',
    budget: '',
    duration: '7',
    adType: 'banner',
    imageUrl: '',
    websiteUrl: '',
    company: '',
    contactEmail: '',
    startDate: '',
    endDate: '',
    keywords: '',
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
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const calculateTotal = () => {
    const selectedAdType = adTypes.find(type => type.id === adData.adType);
    const basePrice = selectedAdType ? selectedAdType.price : 0;
    const duration = parseInt(adData.duration) || 1;
    const subtotal = basePrice * duration;
    const tax = subtotal * 0.1; // 10% tax
    return { subtotal, tax, total: subtotal + tax };
  };

  const handlePublish = () => {
    setShowPaymentModal(true);
  };

  const handlePayment = (e) => {
    e.preventDefault();
    // Process payment logic here
    alert('Payment processed successfully! Your ad will be reviewed and published within 24 hours.');
  };
  
  const { subtotal, tax, total } = calculateTotal();

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);
      setAdData(prev => ({ ...prev, videoUrl }));
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview('');
    setAdData(prev => ({ ...prev, videoUrl: '' }));
  };

  return (
    <div className="ad-publish-page">
      {/* SIDEBAR AT THE VERY TOP - OUTSIDE CONTAINER */}
      <CompanySidebar 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* NAVBAR */}
      <CompanyDashboardNavbar
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

                <div className="form-group">
                  <label>Ad Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={adData.title}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter a compelling ad title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Company Name *</label>
                  <input
                    type="text"
                    name="company"
                    value={adData.company}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Your company name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={adData.description}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Describe your product or service"
                    rows="4"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={adData.category}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>📷 Advertisement Media</label>
                  
                  {/* Image Upload Section */}
                  <div className="company-adpublish-media-upload-container">
                    <h4 className="company-adpublish-media-title">📸 Upload Image</h4>
                    <div className="company-adpublish-image-upload-area">
                      {adData.imageUrl ? (
                        <div className="company-adpublish-image-preview">
                          <img src={adData.imageUrl} alt="Advertisement preview" />
                          <button 
                            type="button" 
                            className="company-adpublish-remove-media-btn" 
                            onClick={() => setAdData(prev => ({ ...prev, imageUrl: '' }))}
                            title="Remove Image"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="company-adpublish-default-image">
                          
                        </div>
                      )}
                      
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          // In real implementation, upload file and get URL
                          const file = e.target.files[0];
                          if (file) {
                            const imageUrl = URL.createObjectURL(file);
                            setAdData(prev => ({ ...prev, imageUrl }));
                          }
                        }}
                        className="company-adpublish-file-input"
                        id="imageUpload"
                      />
                      <label htmlFor="imageUpload" className="company-adpublish-upload-btn">
                        Choose Image
                      </label>
                    </div>
                  </div>

                  {/* Video Upload Section */}
                  <div className="company-adpublish-media-upload-container">
                    <h4 className="company-adpublish-media-title">🎥 Upload Video</h4>
                    <div className="company-adpublish-video-upload-area">
                      {videoPreview ? (
                        <div className="company-adpublish-video-preview">
                          <video 
                            src={videoPreview} 
                            controls 
                            className="company-adpublish-preview-video"
                          >
                            Your browser does not support the video tag.
                          </video>
                          <button 
                            type="button" 
                            className="company-adpublish-remove-media-btn" 
                            onClick={removeVideo}
                            title="Remove Video"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="company-adpublish-default-video">
                          <div className="company-adpublish-video-placeholder">
                            <div className="company-adpublish-video-icon">🎥</div>
                            <p>No video selected</p>
                          </div>
                        </div>
                      )}
                      
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="company-adpublish-file-input"
                        id="videoUpload"
                      />
                      <label htmlFor="videoUpload" className="company-adpublish-upload-btn">
                        Choose Video
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Website URL</label>
                  <input
                    type="url"
                    name="websiteUrl"
                    value={adData.websiteUrl}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="https://your-website.com"
                  />
                </div>

                <div className="form-group">
                  <label>Contact Email *</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={adData.contactEmail}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="contact@company.com"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Targeting & Budget */}
            {currentStep === 2 && (
              <div className="form-section">
                <h2>🎯 Targeting & Budget</h2>
                <p className="section-description">Choose your target audience and set your advertising budget</p>

                <div className="form-group">
                  <label>Ad Type *</label>
                  <div className="ad-type-grid">
                    {adTypes.map(type => (
                      <div 
                        key={type.id}
                        className={`ad-type-option ${adData.adType === type.id ? 'selected' : ''}`}
                        onClick={() => setAdData(prev => ({ ...prev, adType: type.id }))}
                      >
                        <div className="ad-type-header">
                          <h4>{type.name}</h4>
                          <span className="price">${type.price}/day</span>
                        </div>
                        <p>{type.description}</p>
                        <input
                          type="radio"
                          name="adType"
                          value={type.id}
                          checked={adData.adType === type.id}
                          onChange={handleInputChange}
                          style={{ display: 'none' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Target Audience *</label>
                  <select
                    name="targetAudience"
                    value={adData.targetAudience}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    {audiences.map(audience => (
                      <option key={audience} value={audience}>{audience}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Campaign Duration (days) *</label>
                  <select
                    name="duration"
                    value={adData.duration}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="1">1 Day</option>
                    <option value="3">3 Days</option>
                    <option value="7">1 Week</option>
                    <option value="14">2 Weeks</option>
                    <option value="30">1 Month</option>
                    <option value="90">3 Months</option>
                  </select>
                </div>

                <div className="date-range-container">
                  <div className="form-group">
                    <label>Start Date *</label>
                    <input
                      type="date"
                      name="startDate"
                      value={adData.startDate}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date *</label>
                    <input
                      type="date"
                      name="endDate"
                      value={adData.endDate}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Keywords (comma-separated)</label>
                  <input
                    type="text"
                    name="keywords"
                    value={adData.keywords}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="programming, technology, internship"
                  />
                </div>

                <div className="budget-summary">
                  <h4>💰 Cost Breakdown</h4>
                  <div className="cost-item">
                    <span>Ad Type: {adTypes.find(t => t.id === adData.adType)?.name}</span>
                    <span>${adTypes.find(t => t.id === adData.adType)?.price}/day</span>
                  </div>
                  <div className="cost-item">
                    <span>Duration: {adData.duration} days</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="cost-item">
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="cost-item total">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
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
                      <strong>Company:</strong> {adData.company}
                    </div>
                    <div className="review-item">
                      <strong>Category:</strong> {adData.category}
                    </div>
                    <div className="review-item">
                      <strong>Description:</strong> {adData.description}
                    </div>
                  </div>

                  <div className="review-group">
                    <h4>🎯 Campaign Details</h4>
                    <div className="review-item">
                      <strong>Ad Type:</strong> {adTypes.find(t => t.id === adData.adType)?.name}
                    </div>
                    <div className="review-item">
                      <strong>Target Audience:</strong> {adData.targetAudience}
                    </div>
                    <div className="review-item">
                      <strong>Duration:</strong> {adData.duration} days
                    </div>
                    <div className="review-item">
                      <strong>Start Date:</strong> {adData.startDate}
                    </div>
                  </div>

                  <div className="review-group">
                    <h4>💰 Payment Summary</h4>
                    <div className="final-cost-breakdown">
                      <div className="cost-item">
                        <span>Subtotal</span>
                        <span>${subtotal}</span>
                      </div>
                      <div className="cost-item">
                        <span>Tax (10%)</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="cost-item total">
                        <span>Total Amount</span>
                        <span>${total.toFixed(2)}</span>
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
              <p>Currently running campaigns</p>
              
              <div className="ad-list">
                <div className="ad-item">
                  <div className="ad-status active">Active</div>
                  <div className="ad-details">
                    <strong>Summer Internship Program</strong>
                    <div className="ad-meta">
                      <span>5 days left</span>
                      <span>1.2K views</span>
                    </div>
                  </div>
                  <button className="view-btn">View</button>
                </div>
                
                <div className="ad-item">
                  <div className="ad-status pending">Pending</div>
                  <div className="ad-details">
                    <strong>Tech Bootcamp 2024</strong>
                    <div className="ad-meta">
                      <span>Under review</span>
                      <span>0 views</span>
                    </div>
                  </div>
                  <button className="view-btn">View</button>
                </div>
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
                  <span>Ad Campaign: {adData.title}</span>
                  <span>${subtotal}</span>
                </div>
                <div className="company-adpublish-admin-summary-item">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="company-adpublish-admin-summary-item company-adpublish-admin-summary-total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
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