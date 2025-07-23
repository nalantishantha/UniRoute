import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCurrentUser } from '../../../utils/auth';
import AdminLayout from '../../../components/common/Admin/AdminLayout';
import {
  Users,
  ChevronLeft,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Award,
  Clock,
  Star,
  FileText,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Send,
  UserPlus
} from 'lucide-react';

const CounsellorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    location: '',
    specialization: '',
    experience_years: '',
    qualification: '',
    bio: '',
    availability: 'full-time',
    hourly_rate: '',
    languages: [],
    certifications: [],
    is_active: true,
    is_verified: false
  });

  const [errors, setErrors] = useState({});
  const [newLanguage, setNewLanguage] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [sendInvitation, setSendInvitation] = useState(false);

  // Predefined options
  const specializationOptions = [
    'Career Guidance',
    'Academic Planning',
    'Mental Health',
    'University Selection',
    'Scholarship Guidance',
    'Study Abroad',
    'Vocational Training',
    'Personal Development',
    'Test Preparation',
    'Life Skills',
    'Stress Management',
    'Time Management'
  ];

  const locationOptions = [
    'Colombo',
    'Gampaha',
    'Kalutara',
    'Kandy',
    'Matale',
    'Nuwara Eliya',
    'Galle',
    'Matara',
    'Hambantota',
    'Jaffna',
    'Kilinochchi',
    'Mannar',
    'Mullaitivu',
    'Vavuniya',
    'Puttalam',
    'Kurunegala',
    'Anuradhapura',
    'Polonnaruwa',
    'Badulla',
    'Monaragala',
    'Ratnapura',
    'Kegalle',
    'Batticaloa',
    'Ampara',
    'Trincomalee'
  ];

  const commonLanguages = [
    'English',
    'Sinhala',
    'Tamil',
    'Hindi',
    'French',
    'German',
    'Japanese',
    'Chinese',
    'Korean',
    'Spanish'
  ];

  useEffect(() => {
    if (isEditMode) {
      fetchCounsellorData();
    }
  }, [id, isEditMode]);

  const fetchCounsellorData = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API
      const mockData = {
        id: 1,
        first_name: 'Dr. Sarah',
        last_name: 'Johnson',
        email: 'sarah.johnson@uniroute.lk',
        phone: '0771234567',
        location: 'Colombo',
        specialization: 'Career Guidance',
        experience_years: 8,
        qualification: 'PhD in Psychology',
        bio: 'Experienced career counsellor specializing in helping students discover their career paths.',
        availability: 'full-time',
        hourly_rate: '5000',
        languages: ['English', 'Sinhala'],
        certifications: ['Certified Career Counselor', 'Mental Health First Aid'],
        is_active: true,
        is_verified: true
      };
      
      setFormData(mockData);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch counsellor data' });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.specialization) newErrors.specialization = 'Specialization is required';
    if (!formData.experience_years) newErrors.experience_years = 'Experience years is required';
    if (!formData.qualification.trim()) newErrors.qualification = 'Qualification is required';
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fix the errors above' });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call - replace with actual API
      const endpoint = isEditMode ? `/api/counsellors/${id}` : '/api/counsellors';
      const method = isEditMode ? 'PUT' : 'POST';
      
      console.log(`${method} request to ${endpoint}`, formData);
      
      // Simulate successful response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ 
        type: 'success', 
        text: `Counsellor ${isEditMode ? 'updated' : 'created'} successfully!` 
      });

      // If creating new counsellor and send invitation is checked
      if (!isEditMode && sendInvitation) {
        // Simulate sending invitation email
        await new Promise(resolve => setTimeout(resolve, 500));
        setMessage({ 
          type: 'success', 
          text: 'Counsellor created and invitation email sent successfully!' 
        });
      }
      
      setTimeout(() => {
        navigate('/admin/counsellors');
      }, 2000);
      
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: `Failed to ${isEditMode ? 'update' : 'create'} counsellor` 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (language) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang !== language)
    }));
  };

  const addCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (certification) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert !== certification)
    }));
  };

  return (
    <AdminLayout>
      <div className="counsellor-form-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <Link to="/admin/counsellors" className="back-link">
              <ChevronLeft size={20} />
              <span>Back to Counsellors</span>
            </Link>
            <h1 className="page-title">
              <Users className="page-icon" />
              {isEditMode ? 'Edit Counsellor' : 'Invite New Counsellor'}
            </h1>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Form */}
        <div className="form-container">
          <form onSubmit={handleSubmit} className="counsellor-form">
            {/* Personal Information */}
            <div className="form-section">
              <h3 className="section-title">
                <User size={20} />
                Personal Information
              </h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="first_name">
                    First Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className={errors.first_name ? 'error' : ''}
                    placeholder="Enter first name"
                  />
                  {errors.first_name && <span className="error-text">{errors.first_name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="last_name">
                    Last Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className={errors.last_name ? 'error' : ''}
                    placeholder="Enter last name"
                  />
                  {errors.last_name && <span className="error-text">{errors.last_name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email Address <span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <Mail size={18} />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                      placeholder="Enter email address"
                    />
                  </div>
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    Phone Number <span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <Phone size={18} />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? 'error' : ''}
                      placeholder="Enter phone number"
                    />
                  </div>
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="location">
                    Location <span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <MapPin size={18} />
                    <select
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={errors.location ? 'error' : ''}
                    >
                      <option value="">Select location</option>
                      {locationOptions.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                  {errors.location && <span className="error-text">{errors.location}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="availability">
                    Availability
                  </label>
                  <div className="input-with-icon">
                    <Clock size={18} />
                    <select
                      id="availability"
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                    >
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="weekend">Weekend Only</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="form-section">
              <h3 className="section-title">
                <BookOpen size={20} />
                Professional Information
              </h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="specialization">
                    Specialization <span className="required">*</span>
                  </label>
                  <select
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className={errors.specialization ? 'error' : ''}
                  >
                    <option value="">Select specialization</option>
                    {specializationOptions.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                  {errors.specialization && <span className="error-text">{errors.specialization}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="experience_years">
                    Years of Experience <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="experience_years"
                    name="experience_years"
                    value={formData.experience_years}
                    onChange={handleInputChange}
                    className={errors.experience_years ? 'error' : ''}
                    placeholder="Enter years of experience"
                    min="0"
                    max="50"
                  />
                  {errors.experience_years && <span className="error-text">{errors.experience_years}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="qualification">
                    Qualification <span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <Award size={18} />
                    <input
                      type="text"
                      id="qualification"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      className={errors.qualification ? 'error' : ''}
                      placeholder="Enter highest qualification"
                    />
                  </div>
                  {errors.qualification && <span className="error-text">{errors.qualification}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="hourly_rate">
                    Hourly Rate (LKR)
                  </label>
                  <input
                    type="number"
                    id="hourly_rate"
                    name="hourly_rate"
                    value={formData.hourly_rate}
                    onChange={handleInputChange}
                    placeholder="Enter hourly rate"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="bio">
                  Bio <span className="required">*</span>
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className={errors.bio ? 'error' : ''}
                  placeholder="Enter a brief bio about the counsellor..."
                  rows="4"
                />
                {errors.bio && <span className="error-text">{errors.bio}</span>}
              </div>
            </div>

            {/* Languages */}
            <div className="form-section">
              <h3 className="section-title">Languages</h3>
              
              <div className="tags-input">
                <div className="add-tag">
                  <select
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                  >
                    <option value="">Select language</option>
                    {commonLanguages.filter(lang => !formData.languages.includes(lang)).map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                  <button type="button" onClick={addLanguage} className="add-btn">
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="tags-list">
                  {formData.languages.map(language => (
                    <span key={language} className="tag">
                      {language}
                      <button type="button" onClick={() => removeLanguage(language)}>
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="form-section">
              <h3 className="section-title">Certifications</h3>
              
              <div className="tags-input">
                <div className="add-tag">
                  <input
                    type="text"
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    placeholder="Enter certification"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                  />
                  <button type="button" onClick={addCertification} className="add-btn">
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="tags-list">
                  {formData.certifications.map(cert => (
                    <span key={cert} className="tag">
                      {cert}
                      <button type="button" onClick={() => removeCertification(cert)}>
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Status Settings */}
            <div className="form-section">
              <h3 className="section-title">Status Settings</h3>
              
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark"></span>
                  Active
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_verified"
                    checked={formData.is_verified}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark"></span>
                  Verified
                </label>

                {!isEditMode && (
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={sendInvitation}
                      onChange={(e) => setSendInvitation(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Send invitation email
                  </label>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <Link to="/admin/counsellors" className="btn btn-secondary">
                <X size={20} />
                Cancel
              </Link>
              
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <>
                    {!isEditMode && sendInvitation ? <Send size={20} /> : <Save size={20} />}
                    {isEditMode ? 'Update Counsellor' : (sendInvitation ? 'Send Invitation' : 'Save Counsellor')}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .counsellor-form-container {
          padding: 0;
        }

        .page-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          border-radius: 12px;
          margin-bottom: 2rem;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          margin-bottom: 1rem;
          transition: color 0.2s;
        }

        .back-link:hover {
          color: white;
        }

        .page-title {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 2rem;
          font-weight: 600;
          margin: 0;
        }

        .page-icon {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem;
          border-radius: 8px;
        }

        .message {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        .message.success {
          background: #f0f9ff;
          color: #0369a1;
          border: 1px solid #bae6fd;
        }

        .message.error {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .form-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .counsellor-form {
          padding: 2rem;
        }

        .form-section {
          margin-bottom: 2.5rem;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #374151;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #f3f4f6;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: #374151;
        }

        .required {
          color: #dc2626;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-with-icon svg {
          position: absolute;
          left: 1rem;
          color: #9ca3af;
          z-index: 1;
        }

        .input-with-icon input,
        .input-with-icon select {
          padding-left: 3rem;
        }

        input, select, textarea {
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s;
          background: white;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        input.error, select.error, textarea.error {
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }

        .error-text {
          color: #dc2626;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .tags-input {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .add-tag {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .add-tag input,
        .add-tag select {
          flex: 1;
        }

        .add-btn {
          padding: 0.75rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .add-btn:hover {
          background: #5b6bd5;
        }

        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f3f4f6;
          padding: 0.5rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          color: #374151;
        }

        .tag button {
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          padding: 0;
          display: flex;
          align-items: center;
        }

        .tag button:hover {
          color: #dc2626;
        }

        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          font-weight: 500;
          color: #374151;
        }

        .checkbox-label input[type="checkbox"] {
          width: 1.25rem;
          height: 1.25rem;
          margin: 0;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          padding-top: 2rem;
          border-top: 2px solid #f3f4f6;
          margin-top: 2rem;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 1rem;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          .page-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </AdminLayout>
  );
};

export default CounsellorForm;
