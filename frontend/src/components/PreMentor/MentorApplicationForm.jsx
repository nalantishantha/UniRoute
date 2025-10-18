import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Upload,
  FileText,
  User,
  Mail,
  GraduationCap,
  Calendar,
  Award,
  Camera
} from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

export default function MentorApplicationForm({ isOpen, onClose, userData, onSubmit }) {
  const [formData, setFormData] = useState({
    registration_number: '',
    academic_year: '',
    student_email: '',
    degree_program: '',
    recommendation: '',
    skills: '',
    nic_file: null,
    student_id_file: null,
    recommendation_letter_file: null
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [previews, setPreviews] = useState({
    nic_file: null,
    student_id_file: null,
    recommendation_letter_file: null
  });

  useEffect(() => {
    if (isOpen) {
      fetchUserDetails();
    }
  }, [isOpen]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));

      console.log('Fetching mentor application data for user:', user);

      if (!user || !user.user_id) {
        console.error('No valid user found in localStorage');
        setErrors({ fetch: 'User information not found. Please login again.' });
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:8000/api/pre-mentors/mentor-application-data/?user_id=${user.user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('API Response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('API Response data:', result);

        if (result.success) {
          setFormData(prev => ({
            ...prev,
            registration_number: result.data.registration_number || '',
            academic_year: result.data.academic_year || '',
            student_email: result.data.student_email || '',
            degree_program: result.data.degree_program || '',
          }));
        } else {
          console.error('API returned success: false', result);
          setErrors({ fetch: result.message || 'Failed to load user data' });
        }
      } else {
        const errorText = await response.text();
        console.error('API request failed:', response.status, errorText);
        setErrors({ fetch: `Failed to load user data: ${response.status}` });
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      setErrors({ fetch: 'Network error. Please check your connection.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = {
        nic_file: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
        student_id_file: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
        recommendation_letter_file: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
      };

      if (!allowedTypes[fieldName].includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: 'Please upload a valid file (PDF, JPG, or PNG)'
        }));
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: 'File size must be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        [fieldName]: file
      }));

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviews(prev => ({
            ...prev,
            [fieldName]: e.target.result
          }));
        };
        reader.readAsDataURL(file);
      } else {
        setPreviews(prev => ({
          ...prev,
          [fieldName]: null
        }));
      }

      // Clear error
      if (errors[fieldName]) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.recommendation.trim()) {
      newErrors.recommendation = 'Recommendation is required';
    }
    if (!formData.skills.trim()) {
      newErrors.skills = 'Skills are required';
    }
    if (!formData.nic_file) {
      newErrors.nic_file = 'NIC document is required';
    }
    if (!formData.student_id_file) {
      newErrors.student_id_file = 'Student ID document is required';
    }
    if (!formData.recommendation_letter_file) {
      newErrors.recommendation_letter_file = 'Recommendation letter is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      // Create FormData for file upload
      const submitData = new FormData();
      const user = JSON.parse(localStorage.getItem('user'));

      // Add user ID
      submitData.append('user_id', user.user_id);

      // Add text fields
      submitData.append('recommendation', formData.recommendation);
      submitData.append('skills', formData.skills);

      // Add files
      if (formData.nic_file) {
        submitData.append('nic_file', formData.nic_file);
      }
      if (formData.student_id_file) {
        submitData.append('student_id_file', formData.student_id_file);
      }
      if (formData.recommendation_letter_file) {
        submitData.append('recommendation_letter_file', formData.recommendation_letter_file);
      }

      const response = await fetch('http://localhost:8000/api/pre-mentors/submit-mentor-application/', {
        method: 'POST',
        body: submitData,
      });

      const result = await response.json();

      if (result.success) {
        onSubmit(result);
        onClose();
      } else {
        setErrors({ submit: result.message || 'Failed to submit application' });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setErrors({ submit: 'Failed to submit application. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const FileUploadArea = ({ fieldName, title, icon: Icon, description }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-black">
        {title} <span className="text-error">*</span>
      </label>
      <div className="relative">
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleFileChange(e, fieldName)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${formData[fieldName]
            ? 'border-success bg-success/5'
            : errors[fieldName]
              ? 'border-error bg-error/5'
              : 'border-neutral-silver hover:border-primary-400 bg-neutral-silver/10'
          }`}>
          {previews[fieldName] ? (
            <div className="space-y-2">
              <img
                src={previews[fieldName]}
                alt="Preview"
                className="mx-auto h-20 w-20 object-cover rounded-lg"
              />
              <p className="text-sm text-success font-medium">{formData[fieldName]?.name}</p>
            </div>
          ) : formData[fieldName] ? (
            <div className="space-y-2">
              <Icon className="mx-auto h-8 w-8 text-success" />
              <p className="text-sm text-success font-medium">{formData[fieldName].name}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Icon className="mx-auto h-8 w-8 text-neutral-grey" />
              <p className="text-sm text-neutral-grey">{description}</p>
              <p className="text-xs text-neutral-grey">PDF, JPG, PNG (Max 5MB)</p>
            </div>
          )}
        </div>
      </div>
      {errors[fieldName] && (
        <p className="text-sm text-error">{errors[fieldName]}</p>
      )}
    </div>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          <Card className="shadow-2xl">
            <CardContent className="p-0">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Mentor Application</h2>
                    <p className="text-primary-100">Complete your application to become a mentor</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="max-h-[calc(90vh-120px)] overflow-y-auto p-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                    <p className="text-neutral-grey">Loading application form...</p>
                  </div>
                ) : errors.fetch ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="bg-error/10 border border-error/20 rounded-lg p-6 max-w-md text-center">
                      <p className="text-error text-lg font-medium mb-2">Failed to Load Form</p>
                      <p className="text-neutral-grey mb-4">{errors.fetch}</p>
                      <button
                        onClick={fetchUserDetails}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Auto-filled Information */}
                    <div className="bg-neutral-silver/20 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-neutral-black mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2 text-primary-600" />
                        Student Information (Auto-filled)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-grey mb-1">
                            Registration Number
                          </label>
                          <input
                            type="text"
                            value={formData.registration_number}
                            disabled
                            className="w-full px-3 py-2 bg-neutral-silver/50 border border-neutral-silver rounded-lg text-neutral-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-grey mb-1">
                            Academic Year
                          </label>
                          <input
                            type="text"
                            value={formData.academic_year}
                            disabled
                            className="w-full px-3 py-2 bg-neutral-silver/50 border border-neutral-silver rounded-lg text-neutral-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-grey mb-1">
                            Student Email
                          </label>
                          <input
                            type="email"
                            value={formData.student_email}
                            disabled
                            className="w-full px-3 py-2 bg-neutral-silver/50 border border-neutral-silver rounded-lg text-neutral-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-grey mb-1">
                            Degree Program
                          </label>
                          <input
                            type="text"
                            value={formData.degree_program}
                            disabled
                            className="w-full px-3 py-2 bg-neutral-silver/50 border border-neutral-silver rounded-lg text-neutral-black"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-neutral-black flex items-center">
                        <Award className="w-5 h-5 mr-2 text-primary-600" />
                        Additional Information
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-neutral-black mb-2">
                          Recommendation <span className="text-error">*</span>
                        </label>
                        <textarea
                          name="recommendation"
                          value={formData.recommendation}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="Please provide a recommendation or reason why you want to become a mentor..."
                          className={`w-full px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.recommendation ? 'border-error' : 'border-neutral-silver'
                            }`}
                        />
                        {errors.recommendation && (
                          <p className="text-sm text-error mt-1">{errors.recommendation}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-black mb-2">
                          Skills & Expertise <span className="text-error">*</span>
                        </label>
                        <textarea
                          name="skills"
                          value={formData.skills}
                          onChange={handleInputChange}
                          rows={3}
                          placeholder="List your skills, expertise areas, and subjects you can mentor..."
                          className={`w-full px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.skills ? 'border-error' : 'border-neutral-silver'
                            }`}
                        />
                        {errors.skills && (
                          <p className="text-sm text-error mt-1">{errors.skills}</p>
                        )}
                      </div>
                    </div>

                    {/* File Uploads */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-neutral-black flex items-center">
                        <Camera className="w-5 h-5 mr-2 text-primary-600" />
                        Required Documents
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FileUploadArea
                          fieldName="nic_file"
                          title="National ID (NIC)"
                          icon={Upload}
                          description="Upload your NIC copy"
                        />

                        <FileUploadArea
                          fieldName="student_id_file"
                          title="Student ID"
                          icon={Upload}
                          description="Upload your Student ID copy"
                        />

                        <FileUploadArea
                          fieldName="recommendation_letter_file"
                          title="Recommendation Letter"
                          icon={FileText}
                          description="Upload recommendation letter"
                        />
                      </div>
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                      <div className="bg-error/10 border border-error/20 rounded-lg p-4">
                        <p className="text-error text-sm">{errors.submit}</p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-neutral-silver">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 border border-neutral-silver text-neutral-black rounded-lg hover:bg-neutral-silver/50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-lg hover:from-primary-700 hover:to-primary-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                      >
                        {submitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <span>Submit Application</span>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}