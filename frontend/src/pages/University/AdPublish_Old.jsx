import React, { useState, useEffect } from 'react';
import UniversitySidebar from '../../components/Navigation/UniversitySidebar';
import UniversityNavbar from '../../components/Navigation/UniversityNavbar';
import Footer from '../../components/Footer';
import './AdPublish.css';

const AdPublish = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [adSpaces, setAdSpaces] = useState([]);
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

  // Get university ID from localStorage
  const getUniversityId = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.university_id || 1;
  };

  // Fetch advertisement spaces
  const fetchAdSpaces = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/advertisements/spaces/');
      const result = await response.json();
      
      if (result.success) {
        setAdSpaces(result.spaces);
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to fetch ad spaces' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
      console.error('Error fetching ad spaces:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check availability for selected dates and space
  const checkAvailability = async () => {
    if (!adData.space_id || !adData.start_date || !adData.end_date) {
      setMessage({ type: 'error', text: 'Please select ad space and date range' });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/advertisements/check-availability/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          space_id: adData.space_id,
          start_date: adData.start_date,
          end_date: adData.end_date
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setAvailabilityCheck(result);
        if (result.available) {
          setMessage({ type: 'success', text: `Available! Total cost: $${result.total_price} for ${result.days} days` });
        } else {
          setMessage({ type: 'error', text: 'Selected dates are not available for this ad space' });
        }
      } else {
        setMessage({ type: 'error', text: result.message || 'Error checking availability' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
      console.error('Error checking availability:', error);
    } finally {
      setLoading(false);
    }
  };

  // Submit advertisement booking
  const submitAdvertisementBooking = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/advertisements/bookings/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          university_id: getUniversityId(),
          space_id: adData.space_id,
          title: adData.title,
          image_url: adData.image_url,
          target_url: adData.target_url,
          start_date: adData.start_date,
          end_date: adData.end_date
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Advertisement booking submitted successfully! Pending admin approval.' });
        setCurrentStep(3); // Move to confirmation step
        // Reset form
        setAdData({
          title: '',
          description: '',
          image_url: '',
          target_url: '',
          space_id: '',
          start_date: '',
          end_date: '',
          agreeTerms: false
        });
        setAvailabilityCheck(null);
      } else {
        setMessage({ type: 'error', text: result.message || 'Error submitting advertisement booking' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
      console.error('Error submitting advertisement booking:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdSpaces();
  }, []);

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
    setShowPaymentModal(false);
    // Reset form or redirect
  };

  const { subtotal, tax, total } = calculateTotal();

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
                  {adSpaces.length > 0 && adData.space_id && (
                    <div className="space-description">
                      {adSpaces.find(s => s.space_id == adData.space_id)?.description}
                    </div>
                  )}
                </div>

                <div className="form-row">
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

                {adData.space_id && adData.start_date && adData.end_date && (
                  <div className="availability-check">
                    <button 
                      type="button" 
                      onClick={checkAvailability}
                      className="check-btn"
                      disabled={loading}
                    >
                      {loading ? 'Checking...' : 'Check Availability & Price'}
                    </button>
                  </div>
                )}

                {availabilityCheck && availabilityCheck.available && (
                  <div className="pricing-info">
                    <h3>Pricing Details</h3>
                    <div className="pricing-row">
                      <span>Duration:</span>
                      <span>{availabilityCheck.days} days</span>
                    </div>
                    <div className="pricing-row">
                      <span>Price per day:</span>
                      <span>${availabilityCheck.price_per_day}</span>
                    </div>
                    <div className="pricing-row total">
                      <span>Total Cost:</span>
                      <span>${availabilityCheck.total_price}</span>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>Advertisement Image URL *</label>
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
                      <img src={adData.image_url} alt="Ad preview" style={{maxWidth: '200px', marginTop: '10px'}} />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Target URL (Where users go when they click)</label>
                  <input
                    type="url"
                    name="target_url"
                    value={adData.target_url}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="https://your-university-website.com"
                  />
                </div>
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

            {/* Step 2: Review & Submit */}
            {currentStep === 2 && (
              <div className="form-section">
                <h2>📋 Review Your Advertisement</h2>
                <p className="section-description">Review your advertisement details before submitting for approval</p>

                {message.text && (
                  <div className={`message ${message.type}`}>
                    {message.text}
                  </div>
                )}

                <div className="review-section">
                  <div className="review-item">
                    <strong>Title:</strong> {adData.title}
                  </div>
                  <div className="review-item">
                    <strong>Advertisement Space:</strong> {adSpaces.find(s => s.space_id == adData.space_id)?.name}
                  </div>
                  <div className="review-item">
                    <strong>Duration:</strong> {adData.start_date} to {adData.end_date}
                  </div>
                  {availabilityCheck && (
                    <div className="review-item">
                      <strong>Total Cost:</strong> ${availabilityCheck.total_price}
                    </div>
                  )}
                  <div className="review-item">
                    <strong>Image URL:</strong> {adData.image_url}
                  </div>
                  {adData.target_url && (
                    <div className="review-item">
                      <strong>Target URL:</strong> {adData.target_url}
                    </div>
                  )}
                </div>

                {adData.image_url && (
                  <div className="preview-section">
                    <h3>Advertisement Preview</h3>
                    <div className="ad-preview">
                      <img src={adData.image_url} alt="Advertisement preview" />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={adData.agreeTerms}
                      onChange={handleInputChange}
                      required
                    />
                    I agree to the terms and conditions for advertisement publishing
                  </label>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <div className="form-section">
                <h2>✅ Advertisement Submitted Successfully!</h2>
                <p className="section-description">Your advertisement has been submitted for admin approval.</p>
                
                <div className="success-message">
                  <div className="success-icon">🎉</div>
                  <h3>Thank you for your submission!</h3>
                  <p>Your advertisement request is now pending approval from our administrators. You will be notified once your advertisement has been reviewed.</p>
                  
                  <div className="next-steps">
                    <h4>What happens next?</h4>
                    <ul>
                      <li>Our team will review your advertisement within 24-48 hours</li>
                      <li>You will receive an email notification about the approval status</li>
                      <li>Once approved, your advertisement will be live on the specified dates</li>
                      <li>You can track your advertisement status in your dashboard</li>
                    </ul>
                  </div>
                  
                  <button 
                    className="btn-primary"
                    onClick={() => {
                      setCurrentStep(1);
                      setMessage({ type: '', text: '' });
                    }}
                  >
                    Submit Another Advertisement
                  </button>
                </div>
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
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content payment-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>💳 Complete Payment</h2>
              <button className="modal-close" onClick={() => setShowPaymentModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="payment-summary">
                <h3>Order Summary</h3>
                <div className="summary-item">
                  <span>Ad Campaign: {adData.title}</span>
                  <span>${subtotal}</span>
                </div>
                <div className="summary-item">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="summary-item total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <form onSubmit={handlePayment} className="payment-form">
                <h3>Payment Information</h3>
                
                <div className="payment-methods">
                  <div className="payment-option">
                    <label className="payment-label">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit-card"
                        checked={paymentData.paymentMethod === 'credit-card'}
                        onChange={handlePaymentChange}
                        className="form-radio"
                      />
                      💳 Credit/Debit Card
                      <div className="card-icons">
                        <span className="card-icon">💳</span>
                        <span className="card-icon">💳</span>
                      </div>
                    </label>
                  </div>
                  
                  <div className="payment-option">
                    <label className="payment-label">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentData.paymentMethod === 'paypal'}
                        onChange={handlePaymentChange}
                        className="form-radio"
                      />
                      🅿️ PayPal
                      <span className="paypal-icon">🅿️</span>
                    </label>
                  </div>
                </div>

                {paymentData.paymentMethod === 'credit-card' && (
                  <div className="credit-card-form">
                    <div className="form-group">
                      <label>Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentData.cardNumber}
                        onChange={handlePaymentChange}
                        className="form-input"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    
                    <div className="card-details-row">
                      <div className="form-group">
                        <label>Expiry Date</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={paymentData.expiryDate}
                          onChange={handlePaymentChange}
                          className="form-input"
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          value={paymentData.cvv}
                          onChange={handlePaymentChange}
                          className="form-input"
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Cardholder Name</label>
                      <input
                        type="text"
                        name="cardName"
                        value={paymentData.cardName}
                        onChange={handlePaymentChange}
                        className="form-input"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={paymentData.email}
                    onChange={handlePaymentChange}
                    className="form-input"
                    placeholder="john@company.com"
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowPaymentModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-pay-now">
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