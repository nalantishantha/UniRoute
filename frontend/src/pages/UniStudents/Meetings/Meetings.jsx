import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Video, 
  Users, 
  Plus, 
  Calendar, 
  Clock, 
  Copy,
  ExternalLink,
  Trash2
} from "lucide-react";
import JitsiMeeting from "../../../components/JitsiMeeting";

export default function Meetings() {
  const [activeTab, setActiveTab] = useState("create");
  const [meetings, setMeetings] = useState([]);
  const [activeMeeting, setActiveMeeting] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    // Load existing meetings from localStorage
    const savedMeetings = JSON.parse(localStorage.getItem('uniStudentMeetings') || '[]');
    setMeetings(savedMeetings);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const generateRoomName = () => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    return `uniroute-meeting-${randomId}-${timestamp}`;
  };

  const createInstantMeeting = () => {
    const newRoomName = generateRoomName();
    setActiveMeeting({
      roomName: newRoomName,
      displayName: 'UniRoute Student',
      type: 'instant'
    });
  };

  const scheduleMeeting = () => {
    if (!meetingTitle || !scheduledTime) {
      alert('Please fill in all required fields');
      return;
    }

    const newMeeting = {
      id: Date.now(),
      title: meetingTitle,
      roomName: roomName || generateRoomName(),
      scheduledTime,
      description,
      createdAt: new Date().toISOString(),
      status: 'scheduled'
    };

    const updatedMeetings = [...meetings, newMeeting];
    setMeetings(updatedMeetings);
    localStorage.setItem('uniStudentMeetings', JSON.stringify(updatedMeetings));

    // Reset form
    setMeetingTitle("");
    setRoomName("");
    setScheduledTime("");
    setDescription("");
    
    alert('Meeting scheduled successfully!');
  };

  const joinMeeting = (meeting) => {
    setActiveMeeting({
      roomName: meeting.roomName,
      displayName: 'UniRoute Student',
      type: 'scheduled',
      meetingInfo: meeting
    });
  };

  const deleteMeeting = (meetingId) => {
    const updatedMeetings = meetings.filter(m => m.id !== meetingId);
    setMeetings(updatedMeetings);
    localStorage.setItem('uniStudentMeetings', JSON.stringify(updatedMeetings));
  };

  const copyRoomLink = (roomName) => {
    const link = `${window.location.origin}/university-student/meetings?room=${roomName}`;
    navigator.clipboard.writeText(link);
    alert('Meeting link copied to clipboard!');
  };

  const leaveMeeting = () => {
    setActiveMeeting(null);
  };

  if (activeMeeting) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {activeMeeting.type === 'instant' ? 'Instant Meeting' : activeMeeting.meetingInfo?.title}
              </h2>
              <p className="text-gray-600">Room: {activeMeeting.roomName}</p>
            </div>
            <button
              onClick={leaveMeeting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Leave Meeting
            </button>
          </div>
          <div className="p-6">
            <JitsiMeeting 
              roomName={activeMeeting.roomName}
              displayName={activeMeeting.displayName}
            />
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-primary-100 rounded-xl">
              <Video className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Video Meetings</h1>
              <p className="text-gray-600">Create and manage your video meetings</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("create")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "create"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Meeting</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("scheduled")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "scheduled"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Scheduled Meetings</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "create" && (
            <div className="space-y-6">
              {/* Instant Meeting */}
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-primary-900 mb-2">Start Instant Meeting</h3>
                    <p className="text-primary-700">Start a meeting right now with a random room name</p>
                  </div>
                  <button
                    onClick={createInstantMeeting}
                    className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    <Video className="w-5 h-5" />
                    <span>Start Now</span>
                  </button>
                </div>
              </div>

              {/* Schedule Meeting */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Schedule a Meeting</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meeting Title *
                    </label>
                    <input
                      type="text"
                      value={meetingTitle}
                      onChange={(e) => setMeetingTitle(e.target.value)}
                      placeholder="Enter meeting title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Room Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      placeholder="Leave empty for auto-generated"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scheduled Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Meeting description (optional)"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={scheduleMeeting}
                    className="flex items-center space-x-2 px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-medium"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Schedule Meeting</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "scheduled" && (
            <div className="space-y-4">
              {meetings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No scheduled meetings</h3>
                  <p className="text-gray-600">Create your first meeting to get started</p>
                </div>
              ) : (
                meetings.map((meeting) => (
                  <div key={meeting.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">{meeting.title}</h4>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(meeting.scheduledTime).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>Room: {meeting.roomName}</span>
                          </div>
                        </div>
                        {meeting.description && (
                          <p className="mt-2 text-gray-600 text-sm">{meeting.description}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => copyRoomLink(meeting.roomName)}
                          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                          title="Copy meeting link"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => joinMeeting(meeting)}
                          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Join</span>
                        </button>
                        <button
                          onClick={() => deleteMeeting(meeting.id)}
                          className="p-2 text-red-500 hover:text-red-700 transition-colors"
                          title="Delete meeting"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
