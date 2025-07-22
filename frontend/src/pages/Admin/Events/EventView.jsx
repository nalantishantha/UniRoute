import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  Building,
  GraduationCap,
  Briefcase,
  BookOpen,
  ArrowLeft,
  Edit,
  Trash2
} from 'lucide-react';
import AdminLayout from '../../../components/common/Admin/AdminLayout';

const EventView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call - replace with actual API
    const sampleEvent = {
      id: parseInt(id),
      title: 'AI Workshop',
      description: 'Introduction to Artificial Intelligence and Machine Learning concepts',
      type: 'company',
      category: 'workshop',
      date: '2025-08-15',
      endDate: '2025-08-15',
      location: 'Colombo Tech Hub, Level 5',
      organizer: 'TechCorp Solutions',
      organizerContact: 'events@techcorp.com',
      participants: 25,
      maxParticipants: 50,
      status: 'active',
      registrationDeadline: '2025-08-10',
      createdAt: '2025-07-15',
      requirements: 'Basic programming knowledge, Laptop required',
      agenda: [
        { time: '09:00-09:30', activity: 'Registration & Welcome Coffee' },
        { time: '09:30-11:00', activity: 'Introduction to AI Concepts' },
        { time: '11:00-11:15', activity: 'Break' },
        { time: '11:15-12:30', activity: 'Machine Learning Fundamentals' },
        { time: '12:30-13:30', activity: 'Lunch Break' },
        { time: '13:30-15:00', activity: 'Hands-on Programming Session' },
        { time: '15:00-15:15', activity: 'Break' },
        { time: '15:15-16:30', activity: 'Q&A and Wrap-up' }
      ],
      registeredUsers: [
        { id: 1, name: 'John Doe', email: 'john@example.com', type: 'student' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', type: 'university_student' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', type: 'student' }
      ]
    };

    setTimeout(() => {
      setEvent(sampleEvent);
      setLoading(false);
    }, 500);
  }, [id]);

  const getEventIcon = (type) => {
    switch (type) {
      case 'company': return <Briefcase className="w-6 h-6" />;
      case 'university': return <GraduationCap className="w-6 h-6" />;
      case 'tutoring': return <BookOpen className="w-6 h-6" />;
      case 'mentoring': return <Users className="w-6 h-6" />;
      default: return <Calendar className="w-6 h-6" />;
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'company': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'university': return 'bg-green-100 text-green-800 border-green-200';
      case 'tutoring': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'mentoring': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      // Add delete API call here
      navigate('/admin/events');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading event details...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!event) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Event not found</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/events')}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
              <p className="text-gray-600">Event Details</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/admin/events/${event.id}/edit`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className={`p-3 rounded-lg border ${getEventTypeColor(event.type)}`}>
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h2>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getEventTypeColor(event.type)}`}>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)} Event
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.status)}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
                      {event.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Event Date</p>
                      <p className="text-gray-600">{new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Location</p>
                      <p className="text-gray-600">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Organizer</p>
                      <p className="text-gray-600">{event.organizer}</p>
                      <p className="text-sm text-gray-500">{event.organizerContact}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Participants</p>
                      <p className="text-gray-600">{event.participants} / {event.maxParticipants} registered</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Registration Deadline</p>
                      <p className="text-gray-600">{new Date(event.registrationDeadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements */}
            {event.requirements && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                <p className="text-gray-600">{event.requirements}</p>
              </div>
            )}

            {/* Agenda */}
            {event.agenda && event.agenda.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Agenda</h3>
                <div className="space-y-3">
                  {event.agenda.map((item, index) => (
                    <div key={index} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-blue-600 min-w-[80px]">
                        {item.time}
                      </div>
                      <div className="text-gray-700">
                        {item.activity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registered Users */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Registered Participants ({event.registeredUsers.length})
              </h3>
              <div className="space-y-3">
                {event.registeredUsers.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                      <p className="text-gray-500 text-xs">{user.email}</p>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {user.type}
                    </span>
                  </div>
                ))}
                {event.registeredUsers.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{event.registeredUsers.length - 5} more participants
                  </p>
                )}
              </div>
            </div>

            {/* Event Statistics */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Registration Rate</span>
                  <span className="font-medium">
                    {Math.round((event.participants / event.maxParticipants) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Spots</span>
                  <span className="font-medium">
                    {event.maxParticipants - event.participants}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created Date</span>
                  <span className="font-medium">
                    {new Date(event.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EventView;
