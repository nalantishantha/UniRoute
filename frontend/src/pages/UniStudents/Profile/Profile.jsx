import { useState } from "react";
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
  Twitter,
  Linkedin,
  Globe,
  Star,
  Users,
  BookOpen,
  Award,
  Camera,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

const profileData = {
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  phone: "+1 (555) 123-4567",
  location: "New York, NY",
  joinDate: "January 2023",
  bio: "Passionate educator with 5+ years of experience in mathematics and physics tutoring. Dedicated to helping students achieve their academic goals and build confidence in STEM subjects.",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  education: [
    {
      degree: "Master of Science in Mathematics",
      institution: "Columbia University",
      year: "2019-2021",
      gpa: "3.9/4.0",
    },
    {
      degree: "Bachelor of Science in Physics",
      institution: "MIT",
      year: "2015-2019",
      gpa: "3.8/4.0",
    },
  ],
  experience: [
    {
      title: "Senior Math Tutor",
      company: "Academic Excellence Center",
      period: "2021-Present",
      description:
        "Lead mathematics tutor specializing in calculus and linear algebra",
    },
    {
      title: "Physics Teaching Assistant",
      company: "Columbia University",
      period: "2019-2021",
      description: "Assisted professors with undergraduate physics courses",
    },
  ],
  skills: [
    "Advanced Mathematics",
    "Physics",
    "Problem Solving",
    "Curriculum Development",
    "Online Teaching",
    "Student Assessment",
  ],
  mentoringPreferences: {
    topics: [
      "University Admissions",
      "Career Planning",
      "Study Strategies",
      "STEM Subjects",
    ],
    availability: ["Weekdays 9-5", "Weekend Mornings"],
    location: "Online & NYC Area",
  },
  socialLinks: {
    github: "alexjohnson",
    twitter: "alexjohnsonmath",
    linkedin: "alex-johnson-educator",
  },
  stats: {
    totalSessions: 247,
    studentRating: 4.8,
    courseRating: 4.9,
    responseRate: 95,
  },
};

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState(profileData);

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "education", label: "Education", icon: BookOpen },
    { id: "experience", label: "Experience", icon: Award },
    { id: "preferences", label: "Mentoring", icon: Users },
    { id: "social", label: "Social Links", icon: Globe },
  ];

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-end">
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          {isEditing ? (
            <>
              <Button variant="ghost" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-xl overflow-hidden bg-neutral-silver">
                <img
                  src={formData.avatar}
                  alt={formData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <button className="absolute bottom-2 right-2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-black">
                    {formData.name}
                  </h2>
                  <p className="text-neutral-grey mt-1">{formData.bio}</p>
                  <div className="flex items-center space-x-4 mt-4 text-sm text-neutral-grey">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{formData.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {formData.joinDate}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6 md:mt-0">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">
                      {formData.stats.totalSessions}
                    </p>
                    <p className="text-xs text-neutral-grey">Total Sessions</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Star className="w-4 h-4 text-warning fill-current" />
                      <p className="text-2xl font-bold text-neutral-black">
                        {formData.stats.studentRating}
                      </p>
                    </div>
                    <p className="text-xs text-neutral-grey">Student Rating</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Star className="w-4 h-4 text-warning fill-current" />
                      <p className="text-2xl font-bold text-neutral-black">
                        {formData.stats.courseRating}
                      </p>
                    </div>
                    <p className="text-xs text-neutral-grey">Course Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">
                      {formData.stats.responseRate}%
                    </p>
                    <p className="text-xs text-neutral-grey">Response Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <div className="flex space-x-1 border-b border-neutral-silver -mb-4">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
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
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2 email">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey "
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-black mb-2">
                  Bio
                </label>
                <textarea
                  rows="4"
                  value={formData.bio}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                />
              </div>
            </motion.div>
          )}

          {/* Education */}
          {activeTab === "education" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {formData.education.map((edu, index) => (
                <div
                  key={index}
                  className="p-4 border border-neutral-light-grey rounded-lg"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-black mb-2">
                        Degree
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-black mb-2">
                        Institution
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-black mb-2">
                        Year
                      </label>
                      <input
                        type="text"
                        value={edu.year}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-black mb-2">
                        GPA
                      </label>
                      <input
                        type="text"
                        value={edu.gpa}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {isEditing && (
                <Button variant="outline" className="w-full">
                  Add Education
                </Button>
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
              {formData.experience.map((exp, index) => (
                <div
                  key={index}
                  className="p-4 border border-neutral-light-grey rounded-lg"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-black mb-2">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={exp.title}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-black mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-black mb-2">
                        Period
                      </label>
                      <input
                        type="text"
                        value={exp.period}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-neutral-black mb-2">
                      Description
                    </label>
                    <textarea
                      rows="3"
                      value={exp.description}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                    />
                  </div>
                </div>
              ))}
              {isEditing && (
                <Button variant="outline" className="w-full">
                  Add Experience
                </Button>
              )}
            </motion.div>
          )}

          {/* Mentoring Preferences */}
          {activeTab === "preferences" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-neutral-black mb-2">
                  Mentoring Topics
                </label>
                <div className="flex flex-wrap gap-2">
                  {formData.mentoringPreferences.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-black mb-2">
                  Available Times
                </label>
                <div className="space-y-2">
                  {formData.mentoringPreferences.availability.map(
                    (time, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked
                          disabled={!isEditing}
                          className="rounded"
                        />
                        <span className="text-sm text-neutral-black">
                          {time}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-black mb-2">
                  Preferred Location
                </label>
                <input
                  type="text"
                  value={formData.mentoringPreferences.location}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                />
              </div>
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
                      value={formData.socialLinks.github}
                      disabled={!isEditing}
                      placeholder="username"
                      className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Twitter className="w-5 h-5 text-neutral-grey" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-neutral-black mb-1">
                      Twitter
                    </label>
                    <input
                      type="text"
                      value={formData.socialLinks.twitter}
                      disabled={!isEditing}
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
                      value={formData.socialLinks.linkedin}
                      disabled={!isEditing}
                      placeholder="username"
                      className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
