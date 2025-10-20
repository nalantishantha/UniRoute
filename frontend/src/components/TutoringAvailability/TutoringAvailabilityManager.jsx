import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit,
  Clock,
  Calendar,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import Button from "../ui/Button";
import { tutoringAPI } from "../../utils/tutoringAPI";

const TutoringAvailabilityManager = ({ tutorId }) => {
  const [availability, setAvailability] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    day_of_week: 0,
    start_time: "09:00",
    end_time: "17:00",
    is_recurring: true,
    max_students: 1,
    subject: "",
    is_active: true,
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  // Debug: Log tutorId
  console.log("TutoringAvailabilityManager - tutorId:", tutorId);

  const daysOfWeek = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
  ];

  const fetchAvailability = useCallback(async () => {
    // Don't fetch if tutorId is invalid
    if (!tutorId || tutorId === "undefined" || tutorId === "null") {
      console.warn("Cannot fetch availability - invalid tutorId:", tutorId);
      return;
    }

    try {
      setLoading(true);
      const data = await tutoringAPI.getAvailability(tutorId);
      setAvailability(data.availability);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  }, [tutorId]);

  const fetchSubjects = useCallback(async () => {
    try {
      const data = await tutoringAPI.getSubjects();
      setSubjects(data.subjects || []);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
    }
  }, []);

  useEffect(() => {
    // Only fetch if tutorId is valid
    if (tutorId && tutorId !== "undefined" && tutorId !== "null") {
      fetchAvailability();
    }
    fetchSubjects();
  }, [fetchAvailability, fetchSubjects, tutorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.start_time >= formData.end_time) {
      setMessage({ type: "error", text: "Start time must be before end time" });
      return;
    }

    try {
      setLoading(true);

      const submitData = {
        ...formData,
        subject: formData.subject || null,
      };

      if (editingId) {
        await tutoringAPI.updateAvailability(tutorId, {
          ...submitData,
          availability_id: editingId,
        });
        setMessage({
          type: "success",
          text: "Availability updated successfully",
        });
      } else {
        await tutoringAPI.addAvailability(tutorId, submitData);
        setMessage({
          type: "success",
          text: "Availability added successfully",
        });
      }

      fetchAvailability();
      resetForm();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (availabilityId) => {
    if (
      !window.confirm("Are you sure you want to delete this availability slot?")
    ) {
      return;
    }

    try {
      setLoading(true);
      await tutoringAPI.deleteAvailability(tutorId, availabilityId);
      setMessage({
        type: "success",
        text: "Availability deleted successfully",
      });
      fetchAvailability();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (availability) => {
    setEditingId(availability.availability_id);
    setFormData({
      day_of_week: availability.day_of_week,
      start_time: availability.start_time,
      end_time: availability.end_time,
      is_recurring: availability.is_recurring,
      max_students: availability.max_students,
      subject: availability.subject || "",
      is_active: availability.is_active,
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      day_of_week: 0,
      start_time: "09:00",
      end_time: "17:00",
      is_recurring: true,
      max_students: 1,
      subject: "",
      is_active: true,
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

  // Check if tutorId is valid before rendering
  if (!tutorId || tutorId === "undefined" || tutorId === "null") {
    // Get user info for debugging
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    return (
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-warning mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              Tutor Profile Not Found
            </h3>
            <p className="text-neutral-grey mb-4">
              You need to be registered as a tutor to manage tutoring
              availability.
            </p>
            <div className="text-left text-sm text-neutral-grey bg-neutral-silver/50 p-4 rounded space-y-2">
              <p className="font-semibold mb-2">Debug Information:</p>
              <p>
                • Tutor ID:{" "}
                <span className="font-mono">
                  {String(tutorId) || "not set"}
                </span>
              </p>
              <p>
                • User ID:{" "}
                <span className="font-mono">{user.user_id || "not found"}</span>
              </p>
              <p>
                • University Student ID:{" "}
                <span className="font-mono">
                  {user.university_student_id || "not found"}
                </span>
              </p>
              <p>
                • Username:{" "}
                <span className="font-mono">
                  {user.username || "not found"}
                </span>
              </p>
              <div className="mt-3 pt-3 border-t border-neutral-light-grey">
                <p className="text-xs">
                  Check the browser console (F12) for more detailed logs.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>Tutoring Availability</span>
          </CardTitle>
          <Button onClick={() => setShowAddForm(true)} disabled={loading}>
            <Plus className="w-4 h-4 mr-2" />
            Add Slot
          </Button>
        </div>
        <p className="text-sm text-neutral-grey mt-2">
          Set your recurring weekly availability for tutoring sessions. These
          slots will be available for students to book every week.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Message Display */}
        <AnimatePresence>
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
        </AnimatePresence>

        {/* Add/Edit Form */}
        <AnimatePresence>
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
                    {editingId
                      ? "Edit Tutoring Availability"
                      : "Add New Tutoring Availability"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Day of Week *
                        </label>
                        <select
                          value={formData.day_of_week}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              day_of_week: parseInt(e.target.value),
                            }))
                          }
                          className="w-full p-3 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                          required
                        >
                          {daysOfWeek.map((day) => (
                            <option key={day.value} value={day.value}>
                              {day.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Subject
                        </label>
                        <select
                          value={formData.subject}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              subject: e.target.value,
                            }))
                          }
                          className="w-full p-3 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                        >
                          <option value="">All Subjects</option>
                          {subjects.map((subject) => (
                            <option
                              key={subject.subject_id}
                              value={subject.subject_id}
                            >
                              {subject.subject_name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Start Time *
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
                          className="w-full p-3 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          End Time *
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
                          className="w-full p-3 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Max Students *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={formData.max_students}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              max_students: parseInt(e.target.value),
                            }))
                          }
                          className="w-full p-3 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.is_recurring}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                is_recurring: e.target.checked,
                              }))
                            }
                            className="w-4 h-4 text-primary-600 rounded"
                          />
                          <span className="text-sm">Recurring Weekly</span>
                        </label>

                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                is_active: e.target.checked,
                              }))
                            }
                            className="w-4 h-4 text-primary-600 rounded"
                          />
                          <span className="text-sm">Active</span>
                        </label>
                      </div>
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
                          <Save className="w-4 h-4" />
                        )}
                        <span>{editingId ? "Update" : "Add"}</span>
                      </Button>
                      <Button type="button" variant="ghost" onClick={resetForm}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Availability Display */}
        {loading && !showAddForm ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.keys(groupedAvailability).length === 0 ? (
              <div className="text-center py-8 text-neutral-grey">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No tutoring availability slots configured yet.</p>
                <p className="text-sm">Click "Add Slot" to get started.</p>
              </div>
            ) : (
              daysOfWeek.map((day) => {
                const daySlots = groupedAvailability[day.label] || [];
                if (daySlots.length === 0) return null;

                return (
                  <div
                    key={day.value}
                    className="border border-neutral-light-grey rounded-lg p-4"
                  >
                    <h3 className="font-medium text-lg mb-3 text-neutral-black">
                      {day.label}
                    </h3>
                    <div className="space-y-2">
                      {daySlots.map((slot) => (
                        <motion.div
                          key={slot.availability_id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-3 bg-neutral-silver/10 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <Clock className="w-4 h-4 text-primary-600" />
                            <div>
                              <div className="font-medium">
                                {slot.start_time} - {slot.end_time}
                              </div>
                              <div className="text-xs text-neutral-grey flex items-center space-x-2">
                                {slot.subject_name && (
                                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                    {slot.subject_name}
                                  </span>
                                )}
                                <span>Max: {slot.max_students} students</span>
                                <span>•</span>
                                <span>{slot.current_bookings || 0} booked</span>
                                {slot.is_recurring && (
                                  <>
                                    <span>•</span>
                                    <span className="text-green-600">
                                      Recurring
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!slot.is_active && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                Inactive
                              </span>
                            )}
                            <button
                              onClick={() => handleEdit(slot)}
                              className="text-primary-600 hover:text-primary-800 transition-colors"
                              disabled={loading}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(slot.availability_id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
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
      </CardContent>
    </Card>
  );
};

export default TutoringAvailabilityManager;
