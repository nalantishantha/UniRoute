import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  Building,
  GraduationCap,
  Briefcase,
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter
} from 'lucide-react';
import AdminLayout from '../../../components/common/Admin/AdminLayout';

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    type: 'all',
    category: 'all'
  });

  // Sample data - replace with actual API calls
  useEffect(() => {
    const sampleEvents = [
      {
        id: 1,
        title: 'AI Workshop',
        description: 'Introduction to Artificial Intelligence',
        type: 'company',
        category: 'workshop',
        date: '2025-08-15',
        location: 'Colombo',
        organizer: 'TechCorp',
        participants: 25,
        maxParticipants: 50,
        status: 'active'
      },
      {
        id: 2,
        title: 'Career Fair 2025',
        description: 'Annual university career fair',
        type: 'university',
        category: 'career_fair',
        date: '2025-09-10',
        location: 'University of Colombo',
        organizer: 'University of Colombo',
        participants: 150,
        maxParticipants: 200,
        status: 'active'
      },
      {
        id: 3,
        title: 'Mathematics Tutoring Session',
        description: 'Advanced calculus tutoring',
        type: 'tutoring',
        category: 'session',
        date: '2025-07-25',
        location: 'Online',
        organizer: 'John Doe',
        participants: 5,
        maxParticipants: 10,
        status: 'scheduled'
      },
      {
        id: 4,
        title: 'Mentoring Session: Software Engineering',
        description: 'Career guidance for software engineers',
        type: 'mentoring',
        category: 'session',
        date: '2025-07-30',
        location: 'Online',
        organizer: 'Jane Smith',
        participants: 3,
        maxParticipants: 5,
        status: 'scheduled'
      }
    ];
    
    setTimeout(() => {
      setEvents(sampleEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const getEventIcon = (type) => {
    switch (type) {
      case 'company': return <Briefcase className="w-4 h-4" />;
      case 'university': return <GraduationCap className="w-4 h-4" />;
      case 'tutoring': return <BookOpen className="w-4 h-4" />;
      case 'mentoring': return <Users className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'company': return 'bg-blue-100 text-blue-800';
      case 'university': return 'bg-green-100 text-green-800';
      case 'tutoring': return 'bg-purple-100 text-purple-800';
      case 'mentoring': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEvents = events.filter(event => {
    if (filter.type !== 'all' && event.type !== filter.type) return false;
    if (filter.category !== 'all' && event.category !== filter.category) return false;
    return true;
  });

  const handleDelete = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
            <p className="text-gray-600">Manage all events across the platform</p>
          </div>
          <Link
            to="/admin/events/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border flex gap-4 items-center">
          <Filter className="w-4 h-4 text-gray-500" />
          <div className="flex gap-4">
            <select
              value={filter.type}
              onChange={(e) => setFilter({...filter, type: e.target.value})}
              className="border rounded px-3 py-1"
            >
              <option value="all">All Types</option>
              <option value="company">Company Events</option>
              <option value="university">University Events</option>
              <option value="tutoring">Tutoring Sessions</option>
              <option value="mentoring">Mentoring Sessions</option>
            </select>
            <select
              value={filter.category}
              onChange={(e) => setFilter({...filter, category: e.target.value})}
              className="border rounded px-3 py-1"
            >
              <option value="all">All Categories</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="career_fair">Career Fair</option>
              <option value="session">Session</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{events.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Company Events</p>
                <p className="text-2xl font-bold text-gray-900">
                  {events.filter(e => e.type === 'company').length}
                </p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">University Events</p>
                <p className="text-2xl font-bold text-gray-900">
                  {events.filter(e => e.type === 'university').length}
                </p>
              </div>
              <GraduationCap className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Sessions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {events.filter(e => e.type === 'tutoring' || e.type === 'mentoring').length}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      Loading events...
                    </td>
                  </tr>
                ) : filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No events found
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{event.title}</div>
                          <div className="text-sm text-gray-500">{event.description}</div>
                          <div className="text-sm text-gray-400">Organizer: {event.organizer}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                          {getEventIcon(event.type)}
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-900">
                          <Calendar className="w-4 h-4" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {event.participants} / {event.maxParticipants}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.round((event.participants / event.maxParticipants) * 100)}% full
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/events/${event.id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/events/${event.id}/edit`}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EventsList;
