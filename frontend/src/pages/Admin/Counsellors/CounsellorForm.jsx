import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../../components/common/Admin/AdminLayout';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  UserCircle,
  UserPlus
} from 'lucide-react';
import { counsellorsAPI } from '../../../utils/counsellorsAPI';

const initialState = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  languages: 'English',
  specializations: 'Career Guidance',
  experienceYears: '1',
  status: 'active',
  verified: false,
  education: '',
  certifications: '',
  bio: ''
};

const CounsellorForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [fetchError, setFetchError] = useState(null);

  const certificationsList = useMemo(() => {
    if (!formData.certifications) {
      return [];
    }
    return formData.certifications
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }, [formData.certifications]);

  useEffect(() => {
    if (!isEditing) {
      setFormData(initialState);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setFetchError(null);

    const loadCounsellor = async () => {
      try {
        const data = await counsellorsAPI.getCounsellorById(id);
        if (!isMounted) {
          return;
        }
        const counsellor = data.counsellor;
        setFormData({
          fullName: counsellor.fullName || counsellor.username || '',
          email: counsellor.email || '',
          phone: counsellor.phone || '',
          location: counsellor.location || '',
          languages: (counsellor.languages || []).join(', '),
          specializations: (counsellor.specializations || []).join(', '),
          experienceYears: counsellor.experienceYears ? String(counsellor.experienceYears) : '',
          status: counsellor.status || 'active',
          verified: Boolean(counsellor.verified),
          education: counsellor.education || '',
          certifications: (counsellor.certifications || []).join(', '),
          bio: counsellor.bio || ''
        });
      } catch (error) {
        if (isMounted) {
          setFetchError(error.message || 'Failed to load counsellor details.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCounsellor();

    return () => {
      isMounted = false;
    };
  }, [id, isEditing]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nextErrors.email = 'Enter a valid email address';
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = 'Contact number is required';
    }

    if (!formData.location.trim()) {
      nextErrors.location = 'Location is required';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    if (!isEditing) {
      setSubmitMessage({
        type: 'error',
        text: 'Creating new counsellors is not available yet.'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const normalizeList = (value) =>
        value
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);

      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        status: formData.status,
        verified: formData.verified,
        languages: normalizeList(formData.languages),
        specializations: normalizeList(formData.specializations),
        experienceYears: formData.experienceYears,
        education: formData.education,
        certifications: normalizeList(formData.certifications),
        bio: formData.bio
      };

      await counsellorsAPI.updateCounsellor(id, payload);

      setSubmitMessage({
        type: 'success',
        text: 'Counsellor updated successfully.'
      });

      setTimeout(() => {
        navigate('/admin/counsellors');
      }, 800);
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: error.message || 'Failed to update counsellor.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout
      pageTitle={isEditing ? 'Edit Counsellor' : 'Add New Counsellor'}
      pageDescription={
        isEditing
          ? 'Update counsellor details and availability information.'
          : 'Create a new counsellor profile for the UniRoute platform.'
      }
    >
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-[#E7F3FB] p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full border border-[#C1DBF4] text-[#1D5D9B] hover:bg-[#E8F1FF]"
                title="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-[#0F172A]">
                  {isEditing ? 'Edit Counsellor Profile' : 'New Counsellor Profile'}
                </h1>
                <p className="text-sm text-[#6B7A8C]">
                  Provide core information used for matching students with the right counsellor.
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-[#6B7A8C]">
              <UserPlus className="h-4 w-4" />
              Counsellor Management
            </div>
          </div>

          {submitMessage && (
            <div
              className={`mb-6 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${
                submitMessage.type === 'success'
                  ? 'border-[#C4EED0] bg-[#F0FFF4] text-[#1B7A3D]'
                  : 'border-[#FBD5D5] bg-[#FFF5F5] text-[#B3261E]'
              }`}
            >
              {submitMessage.type === 'success' ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4" />
              ) : (
                <AlertCircle className="mt-0.5 h-4 w-4" />
              )}
              <span>{submitMessage.text}</span>
            </div>
          )}

          {fetchError && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-[#FBD5D5] bg-[#FFF5F5] px-4 py-3 text-sm text-[#B3261E]">
              <AlertCircle className="mt-0.5 h-4 w-4" />
              <span>{fetchError}</span>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-[#6B7A8C] gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-[#1D5D9B]" />
              Loading counsellor...
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <section>
              <h2 className="text-base font-semibold text-[#0F172A] mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#6B7A8C] mb-1">
                    Full name
                  </label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent ${
                        errors.fullName ? 'border-[#F5908F]' : 'border-[#C1DBF4]'
                      }`}
                      placeholder="E.g. Dinuka Jayasinghe"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-[#B3261E]">{errors.fullName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6B7A8C] mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent ${
                        errors.email ? 'border-[#F5908F]' : 'border-[#C1DBF4]'
                      }`}
                      placeholder="name@uniroute.lk"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-[#B3261E]">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6B7A8C] mb-1">
                    Contact number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent ${
                        errors.phone ? 'border-[#F5908F]' : 'border-[#C1DBF4]'
                      }`}
                      placeholder="+94 77 123 4567"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-xs text-[#B3261E]">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6B7A8C] mb-1">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent ${
                        errors.location ? 'border-[#F5908F]' : 'border-[#C1DBF4]'
                      }`}
                      placeholder="City, Province"
                    />
                  </div>
                  {errors.location && (
                    <p className="mt-1 text-xs text-[#B3261E]">{errors.location}</p>
                  )}
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[#0F172A] mb-4">Professional Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#6B7A8C] mb-1">
                    Languages (comma separated)
                  </label>
                  <input
                    type="text"
                    name="languages"
                    value={formData.languages}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
                    placeholder="English, Sinhala"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6B7A8C] mb-1">
                    Specializations (comma separated)
                  </label>
                  <input
                    type="text"
                    name="specializations"
                    value={formData.specializations}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
                    placeholder="IELTS Preparation, STEM Pathways"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6B7A8C] mb-1">
                    Years of experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6B7A8C] mb-1">
                    Account status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input
                  id="verified"
                  type="checkbox"
                  name="verified"
                  checked={formData.verified}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#1D5D9B] border-[#C1DBF4] rounded"
                />
                <label htmlFor="verified" className="text-sm text-[#0F172A]">
                  Mark as verified counsellor
                </label>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[#0F172A] mb-4">Background</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#6B7A8C] mb-1">
                    Education
                  </label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
                    placeholder="e.g. MSc in Career Counseling"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6B7A8C] mb-1">
                    Certifications (comma separated)
                  </label>
                  <input
                    type="text"
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
                    placeholder="NCDA Certified Career Counselor"
                  />
                  {certificationsList.length > 0 && (
                    <p className="mt-1 text-xs text-[#94A3B8]">
                      Will save as: {certificationsList.join(', ')}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-[#6B7A8C] mb-1">
                  Bio / notes
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
                  placeholder="Share counsellor experience highlights, focus areas and impact."
                />
              </div>
            </section>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-4 border-t border-[#E7F3FB]">
              <Link
                to="/admin/counsellors"
                className="inline-flex items-center justify-center px-4 py-2 border border-[#C1DBF4] text-[#0F172A] rounded-lg hover:bg-[#F8FAFC]"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-[#1D5D9B] text-white rounded-lg hover:bg-[#174A7C] disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {isEditing ? 'Save changes' : 'Create counsellor'}
                  </>
                )}
              </button>
            </div>
          </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CounsellorForm;
