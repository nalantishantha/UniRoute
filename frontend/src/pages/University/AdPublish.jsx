import React, { useState, useEffect } from "react";
import UniversitySidebar from "../../components/Navigation/UniversitySidebar"; // CHANGED: Import UniversitySidebar
import UniversityNavbar from "../../components/Navigation/UniversityNavbar";
import Footer from "../../components/Footer";
import "./AdPublish.css";
import {
  uploadUniversityAdMedia,
  payForUniversityAd,
  listUniversityAds,
} from "../../services/universityAdService";

const AdPublish = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // CHANGED: Rename from isSidebarExpanded to isSidebarOpen
  const [currentStep, setCurrentStep] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [universityAds, setUniversityAds] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Form Data
  const [adData, setAdData] = useState({
    title: "",
    description: "",
    category: "Technology",
    targetAudience: "All Students",
    budget: "",
    duration: "7",
    adType: "banner",
    imageUrl: "",
    websiteUrl: "",
    contactEmail: "",
    startDate: "",
    endDate: "",
    keywords: "",
    agreeTerms: false,
  });

  // Payment Data
  const [paymentData, setPaymentData] = useState({
    paymentMethod: "credit-card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    email: "",
    billingAddress: "",
  });

  // Video upload state
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");

  const categories = [
    "Technology",
    "Education",
    "Healthcare",
    "Finance",
    "Marketing",
    "Business",
    "Other",
  ];
  const audiences = [
    "All Students",
    "Undergraduate",
    "Graduate",
    "Faculty",
    "Alumni",
  ];
  const adTypes = [
    {
      id: "banner",
      name: "Banner Ad",
      price: 50,
      description: "Display banner on homepage",
    },
    {
      id: "featured",
      name: "Featured Listing",
      price: 100,
      description: "Highlighted in search results",
    },
    {
      id: "sponsored",
      name: "Sponsored Content",
      price: 150,
      description: "Native advertising content",
    },
    {
      id: "premium",
      name: "Premium Placement",
      price: 200,
      description: "Top placement across site",
    },
  ];

  const yourUniversityId = 1;

  useEffect(() => {
    async function fetchAds() {
      const result = await listUniversityAds(yourUniversityId);
      if (result.success) setUniversityAds(result.ads);
    }
    fetchAds();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAdData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const calculateTotal = () => {
    const selectedAdType = adTypes.find((t) => t.id === adData.adType);
    const basePrice = selectedAdType ? selectedAdType.price : 0;
    const duration = parseInt(adData.duration) || 1;
    const subtotal = basePrice * duration;
    const tax = subtotal * 0.1;
    return { subtotal, tax, total: subtotal + tax };
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
    const s = (status || "").toString().toLowerCase();
    const statusMap = {
      pending: { text: "Pending", class: "pending" },
      confirmed: { text: "Active", class: "active" },
      active: { text: "Active", class: "active" },
      rejected: { text: "Rejected", class: "rejected" },
      completed: { text: "Completed", class: "completed" },
    };
    return statusMap[s] || { text: status, class: "unknown" };
  };

  // Helper function to get ad meta information
  const getAdMeta = (ad) => {
    const statusDisplay = getStatusDisplay(ad.status);
    const s = (ad.status || "").toString().toLowerCase();
    if (s === "confirmed" || s === "active") {
      const remainingDays = calculateRemainingDays(ad.end_date);
      return remainingDays > 0 ? `${remainingDays} days left` : "Completed";
    } else if (s === "pending") {
      return "Under review";
    } else if (s === "rejected") {
      return "Rejected by admin";
    } else {
      return "Completed";
    }
  };

  const handlePublish = () => {
    setShowPaymentModal(true);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    const { total } = calculateTotal();
    const adPayload = {
      university_id: yourUniversityId,
      title: adData.title,
      description: adData.description,
      category: adData.category,
      target_audience: adData.targetAudience,
      budget: total,
      duration: parseInt(adData.duration),
      ad_type: adData.adType,
      image_url: adData.imageUrl,
      video_url: videoPreview,
      website_url: adData.websiteUrl,
      contact_email: adData.contactEmail,
      start_date: adData.startDate,
      end_date: adData.endDate,
      keywords: adData.keywords,
    };
    const paymentPayload = {
      payment_method: paymentData.paymentMethod,
      email: paymentData.email,
      amount: total,
    };
    const res = await payForUniversityAd(adPayload, paymentPayload);
    if (res.success) {
      setShowPaymentModal(false);
      setAdData((prev) => ({
        ...prev,
        title: "",
        description: "",
        imageUrl: "",
        websiteUrl: "",
        contactEmail: "",
        startDate: "",
        endDate: "",
        keywords: "",
        agreeTerms: false,
      }));
      setVideoFile(null);
      setVideoPreview("");
      const latest = await listUniversityAds(yourUniversityId);
      if (latest.success) setUniversityAds(latest.ads);
      alert("Payment processed and ad created successfully.");
    } else {
      alert(res.message || "Payment failed.");
    }
  };

  return (
    <div className="ad-publish-page">
      {/* SIDEBAR AT THE VERY TOP - OUTSIDE CONTAINER */}
      <UniversitySidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* NAVBAR */}
      <UniversityNavbar
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        sidebarExpanded={isSidebarOpen}
      />

      {/* MAIN CONTENT */}
      <main
        className={`ad-publish-main ${
          isSidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"
        }`}
      >
        {/* Content Layout */}
        <div className="ad-publish-content">
          {/* Main Form */}
          <div className="form-container">
            {/* Progress Steps */}
            <div className="progress-steps">
              <div
                className={`step ${currentStep >= 1 ? "active" : ""} ${
                  currentStep > 1 ? "completed" : ""
                }`}
              >
                <div className="step-number">1</div>
                <div className="step-label">Ad Details</div>
              </div>
              <div
                className={`step ${currentStep >= 2 ? "active" : ""} ${
                  currentStep > 2 ? "completed" : ""
                }`}
              >
                <div className="step-number">2</div>
                <div className="step-label">Targeting & Budget</div>
              </div>
              <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
                <div className="step-number">3</div>
                <div className="step-label">Review & Publish</div>
              </div>
            </div>

            {/* Step 1: Ad Details */}
            {currentStep === 1 && (
              <div className="form-section">
                <h2>📝 Create Your Advertisement</h2>
                <p className="section-description">
                  Provide the basic information about your advertisement
                </p>

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
                  <label>Category *</label>
                  <select
                    name="category"
                    value={adData.category}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label
                    style={{
                      fontWeight: 700,
                      marginBottom: 8,
                      display: "block",
                    }}
                  >
                    <span role="img" aria-label="media">
                      🖼️
                    </span>{" "}
                    Advertisement Media
                  </label>
                  <div
                    className="company-adpublish-media-upload-container"
                    style={{ display: "flex", gap: 24 }}
                  >
                    {/* Image Upload */}
                    <div
                      className="company-adpublish-image-upload-area"
                      style={{ flex: 1 }}
                    >
                      <h4
                        className="company-adpublish-media-title"
                        style={{ marginBottom: 16 }}
                      >
                        <span role="img" aria-label="upload-image">
                          📸
                        </span>{" "}
                        Upload Image
                      </h4>
                      {adData.imageUrl ? (
                        <div className="company-adpublish-image-preview">
                          <img src={adData.imageUrl} alt="Ad preview" />
                          <button
                            type="button"
                            className="company-adpublish-remove-media-btn"
                            onClick={() =>
                              setAdData((prev) => ({ ...prev, imageUrl: "" }))
                            }
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="company-adpublish-default-image">
                          <img
                            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80"
                            alt="Default ad"
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="company-adpublish-file-input"
                        id="university-image-upload"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const result = await uploadUniversityAdMedia(file);
                            if (result.success) {
                              setAdData((prev) => ({
                                ...prev,
                                imageUrl: result.url,
                              }));
                            } else {
                              const url = URL.createObjectURL(file);
                              setAdData((prev) => ({ ...prev, imageUrl: url }));
                            }
                          }
                        }}
                      />
                      <label
                        htmlFor="university-image-upload"
                        className="company-adpublish-upload-btn"
                      >
                        Choose Image
                      </label>
                    </div>
                    {/* Video Upload */}
                    <div
                      className="company-adpublish-video-upload-area"
                      style={{ flex: 1 }}
                    >
                      <h4
                        className="company-adpublish-media-title"
                        style={{ marginBottom: 16 }}
                      >
                        <span role="img" aria-label="upload-video">
                          🎥
                        </span>{" "}
                        Upload Video
                      </h4>
                      {videoPreview ? (
                        <div className="company-adpublish-video-preview">
                          <video
                            src={videoPreview}
                            controls
                            className="company-adpublish-preview-video"
                            style={{
                              width: "100%",
                              maxHeight: 220,
                              borderRadius: 8,
                            }}
                          />
                          <button
                            type="button"
                            className="company-adpublish-remove-media-btn"
                            onClick={() => {
                              setVideoPreview("");
                              setVideoFile(null);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div
                          className="company-adpublish-default-video company-adpublish-video-placeholder"
                          style={{
                            padding: "32px 0",
                            textAlign: "center",
                            color: "#6b7280",
                            background: "#e0e7ff",
                            borderRadius: 8,
                            marginBottom: 16,
                          }}
                        >
                          <span
                            className="company-adpublish-video-icon"
                            style={{
                              fontSize: 48,
                              display: "block",
                              marginBottom: 8,
                            }}
                          >
                            🎥
                          </span>
                          <p style={{ margin: 0 }}>No video selected</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="video/*"
                        className="company-adpublish-file-input"
                        id="university-video-upload"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setVideoFile(file);
                            const result = await uploadUniversityAdMedia(file);
                            if (result.success) setVideoPreview(result.url);
                            else setVideoPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                      <label
                        htmlFor="university-video-upload"
                        className="company-adpublish-upload-btn"
                      >
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
                    required
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
                    placeholder="admin@university.com"
                    required
                  />
                </div>

                <div className="form-row" style={{ display: "flex", gap: 16 }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Ad Type *</label>
                    <select
                      name="adType"
                      value={adData.adType}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      {adTypes.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ width: 180 }}>
                    <label>Duration (days) *</label>
                    <input
                      type="number"
                      name="duration"
                      value={adData.duration}
                      onChange={handleInputChange}
                      className="form-input"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="navigation-buttons">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn btn-primary"
                    disabled={!adData.title || !adData.imageUrl}
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
                <p className="section-description">
                  Choose your advertisement dates and review the pricing
                </p>

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
                      name="startDate"
                      value={adData.startDate}
                      onChange={handleInputChange}
                      className="form-input"
                      min={new Date().toISOString().split("T")[0]}
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
                      min={
                        adData.startDate ||
                        new Date().toISOString().split("T")[0]
                      }
                      required
                    />
                  </div>
                </div>

                <div className="budget-summary">
                  <h4>💰 Cost Breakdown</h4>
                  <div className="cost-item">
                    <span>
                      Ad Type:{" "}
                      {adTypes.find((t) => t.id === adData.adType)?.name}
                    </span>
                    <span>
                      ${adTypes.find((t) => t.id === adData.adType)?.price}/day
                    </span>
                  </div>
                  <div className="cost-item">
                    <span>Duration: {adData.duration} days</span>
                    <span>
                      $
                      {adTypes.find((t) => t.id === adData.adType)?.price *
                        (parseInt(adData.duration) || 1)}
                    </span>
                  </div>
                  <div className="cost-item">
                    <span>Tax (10%)</span>
                    <span>
                      $
                      {(
                        adTypes.find((t) => t.id === adData.adType)?.price *
                        (parseInt(adData.duration) || 1) *
                        0.1
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="cost-item total">
                    <span>Total</span>
                    <span>
                      $
                      {(
                        adTypes.find((t) => t.id === adData.adType)?.price *
                        (parseInt(adData.duration) || 1) *
                        1.1
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="navigation-buttons">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={prevStep}
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn btn-primary"
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
                <p className="section-description">
                  Review your ad details before publishing
                </p>

                <div className="review-section">
                  <div className="review-group">
                    <h4>📋 Ad Information</h4>
                    <div className="review-item">
                      <strong>Title:</strong> {adData.title}
                    </div>
                    <div className="review-item">
                      <strong>Ad Type:</strong>{" "}
                      {adTypes.find((t) => t.id === adData.adType)?.name}
                    </div>
                    <div className="review-item">
                      <strong>Website URL:</strong>{" "}
                      {adData.websiteUrl || "None"}
                    </div>
                  </div>

                  <div className="review-group">
                    <h4>📅 Campaign Schedule</h4>
                    <div className="review-item">
                      <strong>Start Date:</strong> {adData.startDate}
                    </div>
                    <div className="review-item">
                      <strong>End Date:</strong> {adData.endDate}
                    </div>
                    <div className="review-item">
                      <strong>Duration:</strong> {adData.duration} days
                    </div>
                    <div className="review-item">
                      <strong>Price per Day:</strong> $
                      {adTypes.find((t) => t.id === adData.adType)?.price}
                    </div>
                  </div>

                  <div className="review-group">
                    <h4>💰 Payment Summary</h4>
                    <div className="final-cost-breakdown">
                      {(() => {
                        const { subtotal, tax, total } = calculateTotal();
                        return (
                          <>
                            <div className="cost-item">
                              <span>Subtotal ({adData.duration} days)</span>
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
                          </>
                        );
                      })()}
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
                    <h5>{adData.title || "Your Ad Title Here"}</h5>
                    <p>
                      {adData.description ||
                        "Your ad description will appear here..."}
                    </p>
                    <div className="preview-company">
                      {adData.company || "Company Name"}
                    </div>
                    <button className="preview-btn">Learn More</button>
                  </div>
                </div>
                <p className="preview-note">
                  *Preview may vary from actual placement
                </p>
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
                {universityAds.length === 0 ? (
                  <div className="no-ads">
                    <p>No advertisement requests yet.</p>
                    <p>Create your first ad campaign!</p>
                  </div>
                ) : (
                  universityAds.slice(0, 5).map((ad) => {
                    const statusDisplay = getStatusDisplay(ad.status);
                    return (
                      <div key={ad.ad_id} className="ad-item">
                        <div className={`ad-status ${statusDisplay.class}`}>
                          {statusDisplay.text}
                        </div>
                        <div className="ad-details">
                          <strong>{ad.title}</strong>
                          <div className="ad-meta">
                            <span>
                              {ad.end_date ? getAdMeta(ad) : "Scheduled"}
                            </span>
                            <span>${ad.budget || "-"}</span>
                          </div>
                          <div className="ad-space-info">
                            <small>
                              {ad.ad_type} • {ad.start_date} to {ad.end_date}
                            </small>
                          </div>
                        </div>
                        <button
                          className="view-btn"
                          onClick={() => {
                            alert(
                              `Ad ID: ${ad.ad_id}\nStatus: ${ad.status}\nBudget: $${ad.budget}`
                            );
                          }}
                        >
                          View
                        </button>
                      </div>
                    );
                  })
                )}

                {universityAds.length > 5 && (
                  <div className="see-more">
                    <button
                      className="btn-link"
                      onClick={() => {
                        // Could implement view all functionality
                        alert(
                          `You have ${universityAds.length} total advertisement requests`
                        );
                      }}
                    >
                      See all {universityAds.length} requests →
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
        <div
          className="company-adpublish-admin-modal-overlay"
          onClick={() => setShowPaymentModal(false)}
        >
          <div
            className="company-adpublish-admin-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="company-adpublish-admin-modal-header">
              <h2>💳 Complete Payment</h2>
              <button
                className="company-adpublish-admin-modal-close"
                onClick={() => setShowPaymentModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="company-adpublish-admin-modal-body">
              <div className="company-adpublish-admin-payment-summary">
                <h3>Order Summary</h3>
                {(() => {
                  const { subtotal, tax, total } = calculateTotal();
                  return (
                    <>
                      <div className="company-adpublish-admin-summary-item">
                        <span>Ad Campaign</span>
                        <span>${subtotal}</span>
                      </div>
                      <div className="company-adpublish-admin-summary-item">
                        <span>Tax (10%)</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="company-adpublish-admin-summary-total">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </>
                  );
                })()}
              </div>

              <form
                onSubmit={handlePayment}
                className="company-adpublish-admin-payment-form"
              >
                <h3>Payment Information</h3>

                <div className="company-adpublish-admin-payment-methods">
                  <div className="company-adpublish-admin-payment-option">
                    <label className="company-adpublish-admin-payment-label">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit-card"
                        checked={paymentData.paymentMethod === "credit-card"}
                        onChange={handlePaymentChange}
                        className="company-adpublish-admin-form-radio"
                      />
                      💳 Credit/Debit Card
                      <div className="company-adpublish-admin-card-icons">
                        <span className="company-adpublish-admin-card-icon">
                          💳
                        </span>
                        <span className="company-adpublish-admin-card-icon">
                          💳
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="company-adpublish-admin-payment-option">
                    <label className="company-adpublish-admin-payment-label">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentData.paymentMethod === "paypal"}
                        onChange={handlePaymentChange}
                        className="company-adpublish-admin-form-radio"
                      />
                      🅿️ PayPal
                      <span className="company-adpublish-admin-paypal-icon">
                        🅿️
                      </span>
                    </label>
                  </div>
                </div>

                {paymentData.paymentMethod === "credit-card" && (
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
                  <button
                    type="button"
                    className="company-adpublish-admin-btn-cancel"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="company-adpublish-admin-btn-pay-now"
                  >
                    {(() => {
                      const { total } = calculateTotal();
                      return `Pay $${total.toFixed(2)}`;
                    })()}
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
