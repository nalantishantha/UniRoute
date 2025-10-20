import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Edit3,
  Trash2,
  Plus,
  Filter,
  Eye,
  Settings,
  Save,
  AlertCircle,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Calendar from "../../../components/ui/Calendar";
import { getCurrentUser } from "../../../utils/auth";

const mockAvailableDates = [
  new Date(2024, 1, 15),
  new Date(2024, 1, 16),
  new Date(2024, 1, 17),
  new Date(2024, 1, 20),
  new Date(2024, 1, 21),
  new Date(2024, 1, 22),
];

const mockBookedDates = [
  new Date(2024, 1, 18),
  new Date(2024, 1, 19),
  new Date(2024, 1, 23),
];

const mockEvents = [
  {
    id: 1,
    title: "Career Counseling with John",
    date: "2024-02-15",
    time: "14:00",
    duration: "1 hour",
    student: "John Smith",
    status: "confirmed",
    type: "online"
  },
  {
    id: 2,
    title: "Academic Planning with Sarah",
    date: "2024-02-16", 
    time: "10:30",
    duration: "1.5 hours",
    student: "Sarah Johnson",
    status: "confirmed",
    type: "physical"
  }
];

const CounsellorCalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState(mockAvailableDates);
  const [bookedDates] = useState(mockBookedDates);
  const [events] = useState(mockEvents);
  const [activeTab, setActiveTab] = useState("calendar");
  const [user, setUser] = useState(null);

  // Counsellor Availability Management States
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    day_of_week: 0,
    start_time: "09:00",
    end_time: "17:00"
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const daysOfWeek = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" }
  ];

  // Get current user on component mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    console.log('CounsellorCalendarPage - Current user:', currentUser);
    console.log('CounsellorCalendarPage - localStorage user:', localStorage.getItem('user'));
    setUser(currentUser);
    
    // Use user_id which is the correct field from the backend
    const userId = currentUser?.user_id || currentUser?.id;
    console.log('CounsellorCalendarPage - Using user ID:', userId);
    console.log('CounsellorCalendarPage - Available fields:', Object.keys(currentUser || {}));
    
    if (userId) {
      fetchAvailability(userId);
    } else {
      console.error('CounsellorCalendarPage - No user ID found in:', currentUser);
      setMessage({ type: "error", text: `User ID not found. Available fields: ${Object.keys(currentUser || {}).join(', ')}. Please login again.` });
    }
  }, []);

  // Availability management functions
  const fetchAvailability = async (counsellorId) => {
    try {
      setLoading(true);
      console.log('Fetching availability for counsellor ID:', counsellorId);
      const response = await fetch(`/api/counsellors/availability/${counsellorId}/`);
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.status === 'success') {
        setAvailability(data.availability || []);
        setMessage({ type: "success", text: `Loaded ${data.availability?.length || 0} availability slots` });
      } else {
        setMessage({ type: "error", text: data.message || "Failed to fetch availability" });
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      setMessage({ type: "error", text: "Failed to fetch availability: " + error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilitySubmit = async (e) => {
    e.preventDefault();

    if (formData.start_time >= formData.end_time) {
      setMessage({ type: "error", text: "Start time must be before end time" });
      return;
    }

    const userId = user?.user_id || user?.id;
    if (!userId) {
      setMessage({ type: "error", text: "User ID not found" });
      return;
    }

    try {
      setLoading(true);
      const url = `/api/counsellors/availability/${userId}/`;
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId
        ? { ...formData, availability_id: editingId }
        : formData;

      console.log('Submitting availability data:', body, 'to URL:', url);
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      console.log('Submit response status:', response.status);
      const data = await response.json();
      console.log('Submit response data:', data);

      if (data.status === 'success') {
        setMessage({ type: "success", text: data.message || "Availability saved successfully" });
        fetchAvailability(userId);
        resetAvailabilityForm();
      } else {
        setMessage({ type: "error", text: data.message || "Failed to save availability" });
      }
    } catch (error) {
      console.error('Error saving availability:', error);
      setMessage({ type: "error", text: "Failed to save availability" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAvailability = async (availabilityId) => {
    if (!window.confirm("Are you sure you want to delete this availability slot?")) {
      return;
    }

    const userId = user?.user_id || user?.id;
    if (!userId) {
      setMessage({ type: "error", text: "User ID not found" });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/counsellors/availability/${userId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ availability_id: availabilityId })
      });

      const data = await response.json();

      if (data.status === 'success') {
        setMessage({ type: "success", text: data.message || "Availability deleted successfully" });
        fetchAvailability(userId);
      } else {
        setMessage({ type: "error", text: data.message || "Failed to delete availability" });
      }
    } catch (error) {
      console.error('Error deleting availability:', error);
      setMessage({ type: "error", text: "Failed to delete availability" });
    } finally {
      setLoading(false);
    }
  };

  const handleEditAvailability = (availabilitySlot) => {
    setEditingId(availabilitySlot.id);
    setFormData({
      day_of_week: availabilitySlot.day_of_week,
      start_time: availabilitySlot.start_time,
      end_time: availabilitySlot.end_time
    });
    setShowAddForm(true);
  };

  const resetAvailabilityForm = () => {
    setFormData({
      day_of_week: 0,
      start_time: "09:00",
      end_time: "17:00"
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const groupedAvailability = availability.reduce((groups, slot) => {
    const day = slot.day_name;
    if (!groups[day]) {
      groups[day] = [];
    }
    groups[day].push(slot);
    return groups;
  }, {});

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleSetAvailability = (date, timeSlots) => {
    console.log("Setting availability for:", date, "Time slots:", timeSlots);
    setAvailableDates((prev) => {
      const exists = prev.some(
        (d) =>
          d.getDate() === date.getDate() &&
          d.getMonth() === date.getMonth() &&
          d.getFullYear() === date.getFullYear()
      );
      if (!exists) {
        return [...prev, date];
      }
      return prev;
    });
  };

  const stats = {
    totalAvailableSlots: availability.length * 8, // Rough estimate
    bookedSlots: 12,
    upcomingSessions: events.filter(e => new Date(e.date) > new Date()).length,
    totalSessions: 45,
  };

  const filteredEvents = events.filter((event) => {
    if (!selectedDate) return true;
    const eventDate = new Date(event.date);
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-black">
            Calendar & Availability
          </h1>
          <p className="text-neutral-grey">
            Manage your counseling schedule and availability
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-grey">
                  Available Slots
                </p>
                <p className="mt-2 text-2xl font-bold text-neutral-black">
                  {stats.totalAvailableSlots}
                </p>
                <p className="mt-1 text-sm text-success">This week</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-success/20 rounded-xl">
                <Clock className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-grey">
                  Booked Sessions
                </p>
                <p className="mt-2 text-2xl font-bold text-neutral-black">
                  {stats.bookedSlots}
                </p>
                <p className="mt-1 text-sm text-neutral-grey">This week</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-grey">
                  Upcoming Sessions
                </p>
                <p className="mt-2 text-2xl font-bold text-neutral-black">
                  {stats.upcomingSessions}
                </p>
                <p className="mt-1 text-sm text-warning">Next 7 days</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-warning/20 rounded-xl">
                <CalendarIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-grey">
                  Total Sessions
                </p>
                <p className="mt-2 text-2xl font-bold text-neutral-black">
                  {stats.totalSessions}
                </p>
                <p className="mt-1 text-sm text-neutral-grey">All time</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-neutral-silver/20 rounded-xl">
                <CheckCircle className="w-6 h-6 text-neutral-grey" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <div className="flex -mb-4 space-x-1 border-b border-neutral-silver">
            <button
              onClick={() => setActiveTab("calendar")}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "calendar"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-neutral-grey hover:text-neutral-black"
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Calendar View</span>
            </button>
            <button
              onClick={() => setActiveTab("availability")}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "availability"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-neutral-grey hover:text-neutral-black"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Manage Availability</span>
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Calendar Tab */}
          {activeTab === "calendar" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Calendar Component */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CalendarIcon className="w-5 h-5" />
                      <span>Calendar</span>
                    </CardTitle>
                    <CardDescription>
                      Click on a date to view or manage sessions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      selectedDate={selectedDate}
                      onDateSelect={handleDateSelect}
                      availableDates={availableDates}
                      bookedDates={bookedDates}
                      events={events}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Events List */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <Users className="w-5 h-5" />
                        <span>
                          {selectedDate
                            ? `Sessions for ${selectedDate.toLocaleDateString()}`
                            : "All Upcoming Sessions"}
                        </span>
                      </span>
                      <Filter className="w-4 h-4 text-neutral-grey" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {filteredEvents.length > 0 ? (
                      filteredEvents.map((event) => (
                        <div
                          key={event.id}
                          className="p-4 transition-shadow border rounded-lg border-neutral-light-grey hover:shadow-sm"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-neutral-black">
                              {event.title}
                            </h4>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded ${
                                event.status === "confirmed"
                                  ? "bg-success/20 text-success"
                                  : "bg-warning/20 text-yellow-600"
                              }`}
                            >
                              {event.status}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm text-neutral-grey">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-3 h-3" />
                              <span>
                                {event.time} ({event.duration})
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="w-3 h-3" />
                              <span>{event.student}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="w-3 h-3 text-xs text-center">
                                {event.type === "online" ? "📹" : "📍"}
                              </span>
                              <span>
                                {event.type === "online" ? "Online" : "In-person"}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center mt-3 space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit3 className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center">
                        <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-neutral-light-grey" />
                        <p className="text-neutral-grey">
                          {selectedDate
                            ? "No sessions scheduled for this date"
                            : "No upcoming sessions"}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Availability Management Tab */}
          {activeTab === "availability" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Message Display */}
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
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
                  <span>{message.text}</span>
                  <button
                    onClick={() => setMessage({ type: "", text: "" })}
                    className="ml-auto text-current hover:opacity-70"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* Header with Add Button */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-black">
                    Counselling Availability Management
                  </h3>
                  <p className="text-sm text-neutral-grey">
                    Set your weekly availability for counselling sessions
                  </p>
                </div>
                <Button
                  onClick={() => setShowAddForm(true)}
                  disabled={loading}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Slot
                </Button>
              </div>

              {/* Add/Edit Form */}
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Card className="border-primary-200">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {editingId ? "Edit Availability" : "Add New Availability"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAvailabilitySubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <div>
                            <label className="block mb-2 text-sm font-medium">
                              Day of Week
                            </label>
                            <select
                              value={formData.day_of_week}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  day_of_week: parseInt(e.target.value),
                                }))
                              }
                              className="w-full p-3 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                            >
                              {daysOfWeek.map((day) => (
                                <option key={day.value} value={day.value}>
                                  {day.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block mb-2 text-sm font-medium">
                              Start Time
                            </label>
                            <input
                              type="time"
                              value={formData.start_time}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  start_time: e.target.value,
                                }))
                              }
                              className="w-full p-3 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                            />
                          </div>

                          <div>
                            <label className="block mb-2 text-sm font-medium">
                              End Time
                            </label>
                            <input
                              type="time"
                              value={formData.end_time}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  end_time: e.target.value,
                                }))
                              }
                              className="w-full p-3 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                            />
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <Button
                            type="submit"
                            disabled={loading}
                            className="flex items-center space-x-2"
                          >
                            {loading ? (
                              <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin"></div>
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                            <span>{editingId ? "Update" : "Add"}</span>
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={resetAvailabilityForm}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Availability Display */}
              {loading && !showAddForm ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.keys(groupedAvailability).length === 0 ? (
                    <div className="py-8 text-center text-neutral-grey">
                      <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No availability slots configured yet.</p>
                      <p className="text-sm">Click "Add Slot" to get started.</p>
                    </div>
                  ) : (
                    daysOfWeek.map((day) => {
                      const daySlots = groupedAvailability[day.label] || [];
                      if (daySlots.length === 0) return null;

                      return (
                        <div
                          key={day.value}
                          className="p-4 border rounded-lg border-neutral-light-grey"
                        >
                          <h3 className="mb-3 text-lg font-medium text-neutral-black">
                            {day.label}
                          </h3>
                          <div className="space-y-2">
                            {daySlots.map((slot) => (
                              <motion.div
                                key={slot.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center justify-between p-3 rounded-lg bg-neutral-silver/10"
                              >
                                <div className="flex items-center space-x-3">
                                  <Clock className="w-4 h-4 text-primary-600" />
                                  <span className="font-medium">
                                    {slot.start_time} - {slot.end_time}
                                  </span>
                                  {!slot.is_active && (
                                    <span className="px-2 py-1 text-xs text-yellow-800 bg-yellow-100 rounded">
                                      Inactive
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleEditAvailability(slot)}
                                    className="p-1 transition-colors text-primary-600 hover:text-primary-800"
                                    disabled={loading}
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAvailability(slot.id)}
                                    className="p-1 text-red-600 transition-colors hover:text-red-800"
                                    disabled={loading}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CounsellorCalendarPage;