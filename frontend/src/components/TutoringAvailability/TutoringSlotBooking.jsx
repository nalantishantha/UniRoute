import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  FileText,
  Send,
  AlertCircle,
  CheckCircle,
  BookOpen,
  Users
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import Button from "../ui/Button";
import { tutoringAPI } from "../../utils/tutoringAPI";
import PaymentModal from "./PaymentModal";

const TutoringSlotBooking = ({ tutorId, tutorName, onBookingSuccess }) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null);
  const [bookingData, setBookingData] = useState({
    topic: "",
    description: "",
    payment_type: "single",
    start_date: ""
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const paymentTypes = [
    { value: 'single', label: 'Single Session', sessions: 1, discount: 0 },
    { value: 'monthly', label: 'Monthly Package (4 sessions)', sessions: 4, discount: 5 },
    { value: 'term', label: 'Term Package (12 sessions)', sessions: 12, discount: 10 }
  ];

  const fetchAvailableSlots = useCallback(async () => {
    try {
      setLoading(true);
      const data = await tutoringAPI.getAvailableSlots(tutorId, null);
      setAvailableSlots(data.available_slots);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  }, [tutorId]);

  useEffect(() => {
    fetchAvailableSlots();
  }, [fetchAvailableSlots]);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setShowBookingForm(true);
  };

  const calculateAmount = () => {
    const baseRate = 2000; // Rs. 2000 per session
    const selectedPaymentType = paymentTypes.find(pt => pt.value === bookingData.payment_type);
    if (!selectedPaymentType) return baseRate;
    
    const totalBeforeDiscount = baseRate * selectedPaymentType.sessions;
    const discount = (totalBeforeDiscount * selectedPaymentType.discount) / 100;
    return totalBeforeDiscount - discount;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!bookingData.topic.trim()) {
      setMessage({ type: "error", text: "Topic is required" });
      return;
    }

    if (!bookingData.description.trim()) {
      setMessage({ type: "error", text: "Description is required" });
      return;
    }

    if (!bookingData.start_date) {
      setMessage({ type: "error", text: "Start date is required" });
      return;
    }

    // Get student ID from localStorage
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      setMessage({ type: "error", text: "Please log in to book a session" });
      return;
    }
    
    const user = JSON.parse(userStr);
    if (!user.student_id) {
      setMessage({ type: "error", text: "Student information not found. Please log in again." });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: "", text: "" }); // Clear previous messages
      
      console.log('Creating booking with data:', {
        student_id: user.student_id,
        tutor_id: tutorId,
        availability_slot_id: selectedSlot.availability_id,
        subject_id: selectedSlot.subject,
        topic: bookingData.topic,
        description: bookingData.description,
        payment_type: bookingData.payment_type,
        start_date: bookingData.start_date,
        is_recurring: true
      });
      
      // Create booking
      const data = await tutoringAPI.createBooking({
        student_id: user.student_id,
        tutor_id: tutorId,
        availability_slot_id: selectedSlot.availability_id,
        subject_id: selectedSlot.subject,
        topic: bookingData.topic,
        description: bookingData.description,
        payment_type: bookingData.payment_type,
        start_date: bookingData.start_date,
        is_recurring: true
      });
      
      console.log('Booking created successfully:', data);
      
      if (data.status === 'success') {
        setPendingBooking({
          ...data.booking,
          payment_amount: data.payment_required.amount,
          sessions: data.payment_required.sessions
        });
        setShowBookingForm(false);
        setShowPaymentModal(true);
      }
    } catch (error) {
      console.error('Booking creation error:', error);
      setMessage({ type: "error", text: error.message || "Failed to create booking" });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    try {
      setLoading(true);
      
      const data = await tutoringAPI.confirmPayment(pendingBooking.booking_id, paymentDetails);
      
      if (data.status === 'success') {
        setMessage({ 
          type: "success", 
          text: "Payment confirmed! Your recurring tutoring session is now active." 
        });
        resetBookingForm();
        fetchAvailableSlots(); // Refresh slots to hide booked ones
        if (onBookingSuccess) {
          onBookingSuccess(data);
        }
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
      throw error; // Re-throw to let modal handle it
    } finally {
      setLoading(false);
    }
  };

  const resetBookingForm = () => {
    setSelectedSlot(null);
    setShowBookingForm(false);
    setShowPaymentModal(false);
    setPendingBooking(null);
    setBookingData({
      topic: "",
      description: "",
      payment_type: "single",
      start_date: ""
    });
  };

  // Group slots by day
  const groupedSlots = availableSlots.reduce((groups, slot) => {
    const day = daysOfWeek[slot.day_of_week];
    if (!groups[day]) {
      groups[day] = [];
    }
    groups[day].push(slot);
    return groups;
  }, {});

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>Available Recurring Tutoring Slots</span>
          </CardTitle>
          {tutorName && (
            <p className="text-neutral-grey">
              Book recurring weekly tutoring sessions with {tutorName}
            </p>
          )}
        </CardHeader>

      <CardContent className="space-y-6">
        {/* Message Display */}
        <AnimatePresence>
          {message.text && (
            <div
              className={`p-3 rounded-lg flex items-center space-x-2 ${
                message.type === "success" 
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="text-sm">{message.text}</span>
              <button
                onClick={() => setMessage({ type: "", text: "" })}
                className="ml-auto text-current hover:opacity-70"
              >
                ×
              </button>
            </div>
          )}
        </AnimatePresence>

        {/* Available Slots */}
        {loading && !showBookingForm ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : Object.keys(groupedSlots).length === 0 ? (
          <div className="text-center py-8 text-neutral-grey">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No available recurring slots found.</p>
            <p className="text-sm">Please check back later or contact the tutor directly.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {daysOfWeek.map(day => {
              const daySlots = groupedSlots[day] || [];
              if (daySlots.length === 0) return null;

              return (
                <div key={day} className="border border-neutral-light-grey rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-3 text-neutral-black flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    <span>{day}</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {daySlots.map(slot => (
                      <button
                        key={slot.availability_id}
                        onClick={() => handleSlotSelect(slot)}
                        className={`p-4 border rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-all text-left ${
                          selectedSlot && selectedSlot.availability_id === slot.availability_id
                            ? "border-primary-500 bg-primary-100 ring-2 ring-primary-200"
                            : "border-primary-200"
                        }`}
                        disabled={loading || slot.available_spots === 0}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-primary-600" />
                            <span className="font-medium">
                              {slot.start_time} - {slot.end_time}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs">
                            <Users className="w-3 h-3" />
                            <span>{slot.available_spots}/{slot.total_spots}</span>
                          </div>
                        </div>
                        {slot.subject_name && (
                          <div className="text-xs text-neutral-grey bg-blue-50 text-blue-700 px-2 py-1 rounded inline-block">
                            {slot.subject_name}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Booking Form */}
        <AnimatePresence>
          {showBookingForm && selectedSlot && (
            <div className="overflow-hidden">
              <Card className="border-primary-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Book Recurring Tutoring Session</span>
                  </CardTitle>
                  <p className="text-neutral-grey text-sm">
                    {daysOfWeek[selectedSlot.day_of_week]} at {selectedSlot.start_time} - {selectedSlot.end_time}
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Payment Type *
                      </label>
                      <select
                        value={bookingData.payment_type}
                        onChange={(e) => setBookingData(prev => ({ ...prev, payment_type: e.target.value }))}
                        className="w-full p-3 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                        required
                      >
                        {paymentTypes.map(pt => (
                          <option key={pt.value} value={pt.value}>
                            {pt.label} {pt.discount > 0 ? `(${pt.discount}% off)` : ''}
                          </option>
                        ))}
                      </select>
                      <p className="text-sm text-neutral-grey mt-1">
                        Amount: Rs. {calculateAmount().toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        value={bookingData.start_date}
                        onChange={(e) => setBookingData(prev => ({ ...prev, start_date: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full p-3 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                        required
                      />
                      <p className="text-sm text-neutral-grey mt-1">
                        Your weekly sessions will start from this date
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <FileText className="w-4 h-4 inline mr-1" />
                        Topic/Subject *
                      </label>
                      <input
                        type="text"
                        value={bookingData.topic}
                        onChange={(e) => setBookingData(prev => ({ ...prev, topic: e.target.value }))}
                        placeholder="e.g., Calculus, Physics, Programming"
                        className="w-full p-3 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Learning Goals & Description *
                      </label>
                      <textarea
                        value={bookingData.description}
                        onChange={(e) => setBookingData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        placeholder="Describe what you'd like to learn and your current level..."
                        className="w-full p-3 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                        required
                      />
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="flex items-center space-x-2"
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        <span>Proceed to Payment</span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={resetBookingForm}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>

    {/* Payment Modal - Rendered outside Card to avoid z-index/overflow issues */}
    {pendingBooking && (
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setMessage({ type: "info", text: "Payment cancelled. Booking is pending." });
        }}
        bookingDetails={{
          tutorName: tutorName,
          packageName: paymentTypes.find(pt => pt.value === bookingData.payment_type)?.label || 'Single Session',
          sessions: pendingBooking.sessions || 1,
          amount: pendingBooking.payment_amount || calculateAmount()
        }}
        onPaymentSuccess={handlePaymentSuccess}
      />
    )}
  </>
  );
};

export default TutoringSlotBooking;
