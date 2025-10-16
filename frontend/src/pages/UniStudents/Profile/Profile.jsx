import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Upload,
  Edit3,
  Save,
  X,
  Github,
  Linkedin,
  Globe,
  Star,
  Users,
  BookOpen,
  Award,
  Camera,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { getCurrentUser } from "../../../utils/auth";

// Utility function to handle avatar URLs
const getAvatarUrl = (avatarPath) => {
  if (!avatarPath)
    return "https://via.placeholder.com/150x150/cccccc/666666?text=Avatar";

  // If it's already a full URL, return as is
  if (avatarPath.startsWith("http://") || avatarPath.startsWith("https://")) {
    return avatarPath;
  }

  // If it's a relative path from Django, construct the full URL
  // Remove leading slash if present to avoid double slashes
  const cleanPath = avatarPath.startsWith("/")
    ? avatarPath.slice(1)
    : avatarPath;
  return `http://127.0.0.1:8000/media/${cleanPath}`;
};

const initialProfileData = {
  personal: {
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    avatar: "",
    joinDate: "",
  },
  university: {
    university: "",
    faculty: "",
    degree_program: "",
    year_of_study: "",
    registration_number: "",
    gpa: "",
    specialization: "",
    thesis_topic: "",
    supervisor: "",
  },
  education: [],
  experience: [],
  social_links: {
    github: "",
    x: "",
    linkedin: "",
    website: "",
  },
  skills: [],
};

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [profileData, setProfileData] = useState(initialProfileData);
  const [formData, setFormData] = useState(initialProfileData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "education", label: "Education", icon: BookOpen },
    { id: "experience", label: "Experience", icon: Award },
    { id: "social", label: "Social Links", icon: Globe },
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const currentUser = getCurrentUser();

      if (!currentUser) {
        setMessage({
          type: "error",
          text: "Please log in to view your profile",
        });
        return;
      }

      const response = await fetch(
        `/api/university-students/profile/?user_id=${currentUser.user_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        // Ensure all nested objects exist to prevent errors
        const safeProfileData = {
          personal: data.profile.personal || {},
          university: data.profile.university || {},
          education: data.profile.education || [],
          experience: data.profile.experience || [],
          social_links: data.profile.social_links || {},
          skills: data.profile.skills || [],
        };

        setProfileData(safeProfileData);
        setFormData(safeProfileData);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to fetch profile",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage({ type: "error", text: "Failed to fetch profile data" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check form validity using HTML5 validation
    const form = event.target;
    if (!form.checkValidity()) {
      form.reportValidity(); // This will show HTML5 validation messages
      return;
    }

    try {
      setSaving(true);
      setMessage({ type: "", text: "" });

      // Additional validation for required personal fields
      if (
        !formData.personal.name?.trim() ||
        !formData.personal.email?.trim() ||
        !formData.personal.phone?.trim()
      ) {
        setMessage({
          type: "error",
          text: "Please fill in all required personal information fields (Name, Email, Phone)",
        });
        setSaving(false);
        return;
      }

      // Validate education entries before submitting
      const validEducation = formData.education.filter((edu) => {
        const degree = edu.degree?.trim();
        const institution = edu.institution?.trim();
        return degree && institution; // Only include if both degree and institution are filled
      });

      // Validate experience entries before submitting
      const validExperience = formData.experience.filter((exp) => {
        const title = exp.title?.trim();
        const company = exp.company?.trim();
        return title && company; // Only include if both title and company are filled
      });

      const currentUser = getCurrentUser();

      const submitData = {
        user_id: currentUser.user_id,
        personal: formData.personal,
        education: validEducation,
        experience: validExperience,
        social_links: formData.social_links,
      };

      const response = await fetch("/api/university-students/profile/update/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (data.success) {
        // Update the profile data with the validated data
        const updatedProfileData = {
          ...formData,
          education: validEducation,
          experience: validExperience,
        };

        setProfileData(updatedProfileData);
        setFormData(updatedProfileData);
        setIsEditing(false);
        setMessage({ type: "success", text: "Profile updated successfully!" });

        // Clear success message after 3 seconds
        setTimeout(() => {
          setMessage({ type: "", text: "" });
        }, 3000);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to update profile",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
    setMessage({ type: "", text: "" });
  };

  const handlePersonalChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value,
      },
    }));
  };
  const handleSocialLinksChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [field]: value,
      },
    }));
  };
  const handleEducationChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };
  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { degree: "", institution: "", year: "", gpa: "" },
      ],
    }));
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { title: "", company: "", period: "", description: "" },
      ],
    }));
  };

  const removeEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };
  const removeExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  // Add image upload handler
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setMessage({
        type: "error",
        text: "Please select a valid image file",
      });
      return;
    }

    // Validate file size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "Image file size must be less than 5MB",
      });
      return;
    }

    uploadProfilePicture(file);
  };

  const uploadProfilePicture = async (file) => {
    try {
      setUploading(true);
      setMessage({ type: "", text: "" });

      const currentUser = getCurrentUser();
      const uploadFormData = new FormData();
      uploadFormData.append("profile_picture", file);
      uploadFormData.append("user_id", currentUser.user_id);

      const response = await fetch(
        "/api/university-students/profile/upload-avatar/",
        {
          method: "POST",
          body: uploadFormData,
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update the avatar in both profileData and formData
        const updatedPersonal = {
          ...formData.personal,
          avatar: data.avatar_url,
        };

        setProfileData((prev) => ({
          ...prev,
          personal: updatedPersonal,
        }));

        setFormData((prev) => ({
          ...prev,
          personal: updatedPersonal,
        }));

        setMessage({
          type: "success",
          text: "Profile picture updated successfully!",
        });

        // Clear success message after 3 seconds
        setTimeout(() => {
          setMessage({ type: "", text: "" });
        }, 3000);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to upload profile picture",
        });
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setMessage({
        type: "error",
        text: "Failed to upload profile picture",
      });
    } finally {
      setUploading(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-end">
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            {isEditing ? (
              <div className="mb-5">
                <Button
                  className="mr-2"
                  type="button"
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            ) : (
              <Button
                className="mb-5"
                type="button"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Message Display */}
        {message.text && (
          <div
            className={`p-4 rounded-lg flex items-center space-x-3 ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Profile Overview */}
        <Card className="rounded-b-none">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-xl overflow-hidden bg-neutral-silver">
                  <img
                    src={getAvatarUrl(formData.personal.avatar)}
                    alt={formData.personal.name || "User Avatar"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/150x150/cccccc/666666?text=Avatar";
                    }}
                  />
                </div>
                {isEditing && (
                  <>
                    <button
                      type="button"
                      onClick={triggerFileUpload}
                      disabled={uploading}
                      className="absolute bottom-2 right-2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors disabled:bg-primary-400"
                    >
                      {uploading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Camera className="w-4 h-4" />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-black">
                      {formData.personal.name || "University Student"}
                    </h2>
                    <p className="text-neutral-grey mt-1">
                      {formData.personal.bio}
                    </p>
                    <div className="flex items-center space-x-4 mt-4 text-sm text-neutral-grey">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {formData.personal.location ||
                            "Location not specified"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Joined {formData.personal.joinDate || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* University Info */}
                    {/* <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">
                        <p>
                          <strong>University:</strong>{" "}
                          {formData.university.university}
                        </p>
                        <p>
                          <strong>Faculty:</strong>{" "}
                          {formData.university.faculty}
                        </p>
                        <p>
                          <strong>Program:</strong>{" "}
                          {formData.university.degree_program}
                        </p>
                        <p>
                          <strong>Year:</strong>{" "}
                          {formData.university.year_of_study}
                        </p>
                        {formData.university.gpa && (
                          <p>
                            <strong>GPA:</strong> {formData.university.gpa}
                          </p>
                        )}
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                  <p>
                    <strong>University:</strong>{" "}
                    {formData.university.university}
                  </p>
                  <p>
                    <strong>Faculty:</strong> {formData.university.faculty}
                  </p>
                  <p>
                    <strong>Program:</strong>{" "}
                    {formData.university.degree_program}
                  </p>
                  <p>
                    <strong>Year:</strong> {formData.university.year_of_study}
                  </p>
                  {formData.university.gpa && (
                    <p>
                      <strong>GPA:</strong> {formData.university.gpa}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card className="rounded-t-none">
          <CardHeader>
            <div className="flex space-x-1 border-b border-neutral-silver -mb-4">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    type="button"
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-neutral-grey hover:text-neutral-black"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Personal Information */}
            {activeTab === "personal" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-black mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.personal.name}
                      disabled={!isEditing}
                      required={isEditing}
                      onChange={(e) =>
                        handlePersonalChange("name", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-black mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.personal.email}
                      disabled={!isEditing}
                      required={isEditing}
                      onChange={(e) =>
                        handlePersonalChange("email", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-black mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      pattern="[0-9]{10}"
                      value={formData.personal.phone}
                      disabled={!isEditing}
                      required={isEditing}
                      onChange={(e) =>
                        handlePersonalChange("phone", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-black mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.personal.location}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handlePersonalChange("location", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                      placeholder="Enter your location"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Bio
                  </label>
                  <textarea
                    rows="4"
                    value={formData.personal.bio}
                    disabled={!isEditing}
                    onChange={(e) =>
                      handlePersonalChange("bio", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Add required fields notice for personal info */}
                {isEditing && (
                  <div className="text-sm text-neutral-grey">
                    <span className="text-red-500">*</span> Required fields
                  </div>
                )}
              </motion.div>
            )}

            {/* Education */}
            {activeTab === "education" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {formData.education.length === 0 && !isEditing ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-neutral-light-grey mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-neutral-black mb-2">
                      No Education Added
                    </h3>
                    <p className="text-neutral-grey mb-4">
                      Add your educational background to showcase your
                      qualifications.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(true);
                        addEducation();
                      }}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                ) : (
                  <>
                    {formData.education.map((edu, index) => (
                      <div
                        key={index}
                        className="p-4 border border-neutral-light-grey rounded-lg"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-neutral-black">
                            Education {index + 1}
                          </h4>
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => removeEducation(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-black mb-2">
                              Degree <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={edu.degree || ""}
                              disabled={!isEditing}
                              required={isEditing}
                              onChange={(e) =>
                                handleEducationChange(
                                  index,
                                  "degree",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                              placeholder="e.g., Bachelor of Science"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-black mb-2">
                              Institution{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={edu.institution || ""}
                              disabled={!isEditing}
                              required={isEditing}
                              onChange={(e) =>
                                handleEducationChange(
                                  index,
                                  "institution",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                              placeholder="e.g., University of Colombo"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-black mb-2">
                              Year
                            </label>
                            <input
                              type="text"
                              value={edu.year || ""}
                              disabled={!isEditing}
                              onChange={(e) =>
                                handleEducationChange(
                                  index,
                                  "year",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                              placeholder="e.g., 2020-2024"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-black mb-2">
                              GPA
                            </label>
                            <input
                              type="text"
                              value={edu.gpa || ""}
                              disabled={!isEditing}
                              onChange={(e) =>
                                handleEducationChange(
                                  index,
                                  "gpa",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                              placeholder="e.g., 3.8"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addEducation}
                        className="w-full"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Add Education
                      </Button>
                    )}
                  </>
                )}
                {isEditing && formData.education.length > 0 && (
                  <div className="text-sm text-neutral-grey">
                    <span className="text-red-500">*</span> Required fields.
                    Empty entries will not be saved.
                  </div>
                )}
              </motion.div>
            )}

            {/* Experience */}
            {activeTab === "experience" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {formData.experience.length === 0 && !isEditing ? (
                  <div className="text-center py-12">
                    <Award className="w-12 h-12 text-neutral-light-grey mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-neutral-black mb-2">
                      No Experience Added
                    </h3>
                    <p className="text-neutral-grey mb-4">
                      Add your work experience to highlight your professional
                      background.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(true);
                        addExperience();
                      }}
                    >
                      <Award className="w-4 h-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>
                ) : (
                  <>
                    {formData.experience.map((exp, index) => (
                      <div
                        key={index}
                        className="p-4 border border-neutral-light-grey rounded-lg"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-neutral-black">
                            Experience {index + 1}
                          </h4>
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => removeExperience(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-black mb-2">
                              Job Title <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={exp.title || ""}
                              disabled={!isEditing}
                              required={isEditing}
                              onChange={(e) =>
                                handleExperienceChange(
                                  index,
                                  "title",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                              placeholder="e.g., Software Developer"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-black mb-2">
                              Company <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={exp.company || ""}
                              disabled={!isEditing}
                              required={isEditing}
                              onChange={(e) =>
                                handleExperienceChange(
                                  index,
                                  "company",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                              placeholder="e.g., Tech Corp"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-black mb-2">
                              Period
                            </label>
                            <input
                              type="text"
                              value={exp.period || ""}
                              disabled={!isEditing}
                              onChange={(e) =>
                                handleExperienceChange(
                                  index,
                                  "period",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                              placeholder="e.g., Jan 2023 - Dec 2023"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-neutral-black mb-2">
                            Description
                          </label>
                          <textarea
                            rows="3"
                            value={exp.description || ""}
                            disabled={!isEditing}
                            onChange={(e) =>
                              handleExperienceChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                            placeholder="Describe your responsibilities and achievements..."
                          />
                        </div>
                      </div>
                    ))}
                    {isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addExperience}
                        className="w-full"
                      >
                        <Award className="w-4 h-4 mr-2" />
                        Add Experience
                      </Button>
                    )}
                  </>
                )}
                {isEditing && formData.experience.length > 0 && (
                  <div className="text-sm text-neutral-grey">
                    <span className="text-red-500">*</span> Required fields.
                    Empty entries will not be saved.
                  </div>
                )}
              </motion.div>
            )}

            {/* Social Links */}
            {activeTab === "social" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Github className="w-5 h-5 text-neutral-grey" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-neutral-black mb-1">
                        GitHub
                      </label>
                      <input
                        type="text"
                        value={formData.social_links.github}
                        disabled={!isEditing}
                        onChange={(e) =>
                          handleSocialLinksChange("github", e.target.value)
                        }
                        placeholder="username"
                        className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Linkedin className="w-5 h-5 text-neutral-grey" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-neutral-black mb-1">
                        LinkedIn
                      </label>
                      <input
                        type="text"
                        value={formData.social_links.linkedin}
                        disabled={!isEditing}
                        onChange={(e) =>
                          handleSocialLinksChange("linkedin", e.target.value)
                        }
                        placeholder="username"
                        className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-neutral-grey" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-neutral-black mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        value={formData.social_links.website}
                        disabled={!isEditing}
                        onChange={(e) =>
                          handleSocialLinksChange("website", e.target.value)
                        }
                        placeholder="https://your-website.com"
                        className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </form>
    </motion.div>
  );
}
