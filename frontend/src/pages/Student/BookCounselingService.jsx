import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import StudentNavigation from "../../components/Navigation/StudentNavigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  MessageCircle,
  Phone,
  User,
  Mail,
  GraduationCap,
  CheckCircle,
  CreditCard,
  Shield,
  Info,
} from "lucide-react";

const BookCounselingService = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    selectedDate: "",
    selectedTime: "",
    sessionType: "video",
    currentGoals: "",
    specificConcerns: "",
    previousCounseling: "no",
    paymentMethod: "card",
  });

  const [currentStep, setCurrentStep] = useState(1);

  // Pre-populated user data (in real app, this would come from user context/auth)
  const userData = {
    studentName: "Kasun Perera",
    email: "kasun.perera@email.com",
    phone: "+94 77 123 4567",
    alStream: "Physical Science",
    subjects: "Combined Mathematics, Physics, Chemistry",
  };
  const [isLoading, setIsLoading] = useState(false);

  // Sample service data (in real app, this would come from API)
  const services = {
    1: {
      name: "Career Path Discovery",
      description: "Comprehensive assessment to identify your ideal career path",
      duration: "90 minutes",
      price: "Rs. 2,500",
      features: ["Personality Assessment", "Interest Mapping", "Career Matching", "Action Plan"],
    },
    2: {
      name: "University Selection Guidance",
      description: "Expert advice on choosing the right university and program",
      duration: "60 minutes", 
      price: "Rs. 2,000",
      features: ["University Research", "Program Comparison", "Application Strategy", "Entrance Prep"],
    },
    3: {
      name: "Interview Preparation",
      description: "Mock interviews and preparation for university admissions",
      duration: "75 minutes",
      price: "Rs. 1,800",
      features: ["Mock Interviews", "Answer Techniques", "Confidence Building", "Feedback Report"],
    },
    4: {
      name: "Skills Assessment",
      description: "Identify your strengths and areas for development",
      duration: "45 minutes",
      price: "Rs. 1,500",
      features: ["Skill Mapping", "Strength Analysis", "Development Plan", "Resource Guide"],
    },
  };

  const service = services[serviceId] || services[1];

  const sessionTypes = [
    { id: "video", name: "Video Call", icon: Video, price: service.price },
    { id: "phone", name: "Phone Call", icon: Phone, price: "Rs. " + (parseInt(service.price.replace("Rs. ", "").replace(",", "")) - 200).toLocaleString() },
    { id: "chat", name: "Text Chat", icon: MessageCircle, price: "Rs. " + (parseInt(service.price.replace("Rs. ", "").replace(",", "")) - 500).toLocaleString() },
  ];

  const availableDates = [
    "2024-03-15", "2024-03-16", "2024-03-18", "2024-03-19", "2024-03-20",
    "2024-03-22", "2024-03-23", "2024-03-25", "2024-03-26", "2024-03-27"
  ];

  const availableTimes = [
    "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"
  ];

  const alStreams = [
    "Physical Science", "Biological Science", "Commerce", "Arts", "Technology"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBooking = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    
    // Show success message and redirect
    alert("Booking confirmed! You'll receive a confirmation email shortly.");
    navigate("/student/counseling");
  };

  const getSelectedSessionType = () => {
    return sessionTypes.find(type => type.id === formData.sessionType);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary-100 to-white">
      <StudentNavigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/student/counseling"
            className="inline-flex items-center text-blue-700 hover:text-blue-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Career Counseling
          </Link>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100">
            <h1 className="font-display font-bold text-3xl text-blue-900 mb-2">
              Book: {service.name}
            </h1>
            <p className="text-blue-800 mb-4">{service.description}</p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center text-blue-700">
                <Clock className="h-4 w-4 mr-2" />
                Duration: {service.duration}
              </div>
              <div className="flex items-center text-green-600 font-semibold">
                <CreditCard className="h-4 w-4 mr-2" />
                Starting from {service.price}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
                </div>
                {step < 2 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      currentStep > step ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="text-center">
              <p className="text-blue-900 font-medium">
                Step {currentStep}: {
                  currentStep === 1 ? "Session Details & Preferences" : "Confirmation & Payment"
                }
              </p>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100">
          {/* Step 1: Session Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="font-display font-semibold text-2xl text-blue-900 mb-6">
                Choose Session Details
              </h2>

              {/* Session Type */}
              <div>
                <label className="block text-blue-900 font-medium mb-3">
                  Session Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sessionTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <div
                        key={type.id}
                        onClick={() => setFormData(prev => ({ ...prev, sessionType: type.id }))}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          formData.sessionType === type.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div className="text-center">
                          <IconComponent className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                          <h3 className="font-medium text-blue-900">{type.name}</h3>
                          <p className="text-blue-700 font-semibold">{type.price}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-blue-900 font-medium mb-3">
                  Select Date
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {availableDates.map((date) => (
                    <button
                      key={date}
                      onClick={() => setFormData(prev => ({ ...prev, selectedDate: date }))}
                      className={`p-3 border rounded-lg text-sm transition-all ${
                        formData.selectedDate === date
                          ? "border-blue-500 bg-blue-50 text-blue-900"
                          : "border-gray-200 hover:border-blue-300 text-gray-700"
                      }`}
                    >
                      {new Date(date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-blue-900 font-medium mb-3">
                  Select Time
                </label>
                <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => setFormData(prev => ({ ...prev, selectedTime: time }))}
                      className={`p-2 border rounded-lg text-sm transition-all ${
                        formData.selectedTime === time
                          ? "border-blue-500 bg-blue-50 text-blue-900"
                          : "border-gray-200 hover:border-blue-300 text-gray-700"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Personal Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="font-display font-semibold text-2xl text-blue-900 mb-6">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-blue-900 font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-blue-900 font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-blue-900 font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-blue-900 font-medium mb-2">
                    A/L Stream *
                  </label>
                  <select
                    name="alStream"
                    value={formData.alStream}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select your A/L stream</option>
                    {alStreams.map((stream) => (
                      <option key={stream} value={stream}>
                        {stream}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-blue-900 font-medium mb-2">
                  A/L Subjects
                </label>
                <input
                  type="text"
                  name="subjects"
                  value={formData.subjects}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Combined Mathematics, Physics, Chemistry"
                />
              </div>

              <div>
                <label className="block text-blue-900 font-medium mb-2">
                  Current Goals & Career Interests
                </label>
                <textarea
                  name="currentGoals"
                  value={formData.currentGoals}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us about your career goals and interests..."
                />
              </div>

              <div>
                <label className="block text-blue-900 font-medium mb-2">
                  Specific Concerns or Questions
                </label>
                <textarea
                  name="specificConcerns"
                  value={formData.specificConcerns}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any specific areas you'd like to focus on during the session..."
                />
              </div>

              <div>
                <label className="block text-blue-900 font-medium mb-2">
                  Have you had career counseling before?
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="previousCounseling"
                      value="yes"
                      checked={formData.previousCounseling === "yes"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-blue-800">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="previousCounseling"
                      value="no"
                      checked={formData.previousCounseling === "no"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-blue-800">No</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation & Payment */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="font-display font-semibold text-2xl text-blue-900 mb-6">
                Confirmation & Payment
              </h2>

              {/* Booking Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-4">Booking Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-800">Service:</span>
                    <span className="text-blue-900 font-medium">{service.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800">Session Type:</span>
                    <span className="text-blue-900 font-medium">{getSelectedSessionType()?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800">Date:</span>
                    <span className="text-blue-900 font-medium">
                      {formData.selectedDate ? formatDate(formData.selectedDate) : "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800">Time:</span>
                    <span className="text-blue-900 font-medium">{formData.selectedTime || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800">Duration:</span>
                    <span className="text-blue-900 font-medium">{service.duration}</span>
                  </div>
                  <hr className="border-blue-200" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-blue-900">Total:</span>
                    <span className="text-green-600">{getSelectedSessionType()?.price}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-blue-900 font-medium mb-3">
                  Payment Method
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === "card"}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <CreditCard className="h-5 w-5 mr-3 text-blue-600" />
                    <span className="text-blue-900">Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={formData.paymentMethod === "bank"}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <Shield className="h-5 w-5 mr-3 text-blue-600" />
                    <span className="text-blue-900">Bank Transfer</span>
                  </label>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Important Information:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Sessions can be rescheduled up to 24 hours in advance</li>
                      <li>Cancellations within 24 hours may incur a 50% charge</li>
                      <li>You'll receive a confirmation email with session details</li>
                      <li>For video sessions, ensure you have a stable internet connection</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep < 3 ? (
              <button
                onClick={handleNextStep}
                disabled={
                  (currentStep === 1 && (!formData.selectedDate || !formData.selectedTime || !formData.sessionType)) ||
                  (currentStep === 2 && (!formData.studentName || !formData.email || !formData.phone || !formData.alStream))
                }
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleBooking}
                disabled={isLoading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? "Processing..." : "Confirm Booking"}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookCounselingService;
