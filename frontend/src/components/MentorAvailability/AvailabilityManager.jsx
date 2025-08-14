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
  CheckCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import Button from "../ui/Button";

const AvailabilityManager = ({ mentorId }) => {
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

  const fetchAvailability = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/mentoring/availability/${mentorId}/`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setAvailability(data.availability);
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to fetch availability" });
    } finally {
      setLoading(false);
    }
  }, [mentorId]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.start_time >= formData.end_time) {
      setMessage({ type: "error", text: "Start time must be before end time" });
      return;
    }

    try {
      setLoading(true);
      const url = `/api/mentoring/availability/${mentorId}/`;
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId 
        ? { ...formData, availability_id: editingId }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setMessage({ type: "success", text: data.message });
        fetchAvailability();
        resetForm();
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to save availability" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (availabilityId) => {
    if (!window.confirm("Are you sure you want to delete this availability slot?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/mentoring/availability/${mentorId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ availability_id: availabilityId })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setMessage({ type: "success", text: data.message });
        fetchAvailability();
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to delete availability" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (availability) => {
    setEditingId(availability.id);
    setFormData({
      day_of_week: availability.day_of_week,
      start_time: availability.start_time,
      end_time: availability.end_time
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
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

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Availability Management</span>
          </CardTitle>
          <Button
            onClick={() => setShowAddForm(true)}
            disabled={loading}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Slot
          </Button>
        </div>
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
                    {editingId ? "Edit Availability" : "Add New Availability"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Day of Week
                        </label>
                        <select
                          value={formData.day_of_week}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            day_of_week: parseInt(e.target.value)
                          }))}
                          className="w-full p-3 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                        >
                          {daysOfWeek.map(day => (
                            <option key={day.value} value={day.value}>
                              {day.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={formData.start_time}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            start_time: e.target.value
                          }))}
                          className="w-full p-3 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={formData.end_time}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            end_time: e.target.value
                          }))}
                          className="w-full p-3 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
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
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        <span>{editingId ? "Update" : "Add"}</span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={resetForm}
                      >
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
                <p>No availability slots configured yet.</p>
                <p className="text-sm">Click "Add Slot" to get started.</p>
              </div>
            ) : (
              daysOfWeek.map(day => {
                const daySlots = groupedAvailability[day.label] || [];
                if (daySlots.length === 0) return null;

                return (
                  <div key={day.value} className="border border-neutral-light-grey rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-3 text-neutral-black">
                      {day.label}
                    </h3>
                    <div className="space-y-2">
                      {daySlots.map(slot => (
                        <motion.div
                          key={slot.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-3 bg-neutral-silver/10 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <Clock className="w-4 h-4 text-primary-600" />
                            <span className="font-medium">
                              {slot.start_time} - {slot.end_time}
                            </span>
                            {!slot.is_active && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                Inactive
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(slot)}
                              className="text-primary-600 hover:text-primary-800 transition-colors"
                              disabled={loading}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(slot.id)}
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

export default AvailabilityManager;
