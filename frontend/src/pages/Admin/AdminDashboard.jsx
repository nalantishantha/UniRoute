import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  Users,
  GraduationCap,
  School,
  Building2,
  UserCheck,
  UserCog,
  BookOpen,
  BarChart3,
  FileText,
  Briefcase,
  Calendar,
  Plus,
  Send,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
  Eye,
  Clock,
  X,
  User
} from 'lucide-react';
import AdminLayout from '../../components/common/Admin/AdminLayout';

const AdminDashboard = () => {
  // State for date range reports
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate] = useState('');
  
  // State for notifications
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'info',
    targetUsers: 'all'
  });

  // State for calendar
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Add user distribution data for pie chart
  const userDistributionData = [
    { name: 'Students', value: 3200, color: '#81C784' },
    { name: 'University Students', value: 1156, color: '#75C2F6' },
    { name: 'Mentors', value: 420, color: '#F4D160' },
    { name: 'Tutors', value: 310, color: '#4C7FB1' },
    { name: 'Universities', value: 37, color: '#1D5D9B' },
    { name: 'Companies', value: 61, color: '#E57373' }
  ];

  // Stats data matching your original design
  const stats = [
    {
      section: 'USER MANAGEMENT',
      cards: [
        {
          title: 'Total Users',
          value: '4,847',
          description: 'All registered users',
          change: '+12.3%',
          changeType: 'positive',
          icon: Users,
          iconBg: 'bg-[#1D5D9B]',
          link: '/admin/users'
        },
        {
          title: 'Students',
          value: '3,200',
          description: 'High school students',
          change: '+8.7%',
          changeType: 'positive',
          icon: GraduationCap,
          iconBg: 'bg-[#81C784]',
          link: '/admin/students'
        },
        {
          title: 'University Students',
          value: '1,156',
          description: 'Currently enrolled',
          change: '+15.2%',
          changeType: 'positive',
          icon: School,
          iconBg: 'bg-[#75C2F6]',
          link: '/admin/university-students'
        },
        {
          title: 'Mentors',
          value: '420',
          description: 'Active mentors',
          change: '+6.8%',
          changeType: 'positive',
          icon: UserCheck,
          iconBg: 'bg-[#F4D160]',
          link: '/admin/mentors'
        }
      ]
    },
    {
      section: 'INSTITUTION MANAGEMENT',
      cards: [
        {
          title: 'Tutors',
          value: '310',
          description: 'Verified tutors',
          change: '+4.2%',
          changeType: 'positive',
          icon: UserCog,
          iconBg: 'bg-[#4C7FB1]',
          link: '/admin/tutors'
        },
        {
          title: 'Universities',
          value: '37',
          description: 'Partner institutions',
          change: '+2',
          changeType: 'positive',
          icon: School,
          iconBg: 'bg-[#75C2F6]',
          link: '/admin/universities'
        },
        {
          title: 'Companies',
          value: '61',
          description: 'Corporate partners',
          change: '+11',
          changeType: 'positive',
          icon: Building2,
          iconBg: 'bg-[#F4D160]',
          link: '/admin/companies'
        },
        {
          title: 'Active Programs',
          value: '156',
          description: 'Available programs',
          change: '+4',
          changeType: 'positive',
          icon: BookOpen,
          iconBg: 'bg-[#E7F3FB]',
          link: '/admin/programs'
        }
      ]
    }
  ];

  // Sample chart data
  const userGrowthData = [
    { month: 'Jan', users: 1200, students: 800, universityStudents: 300 },
    { month: 'Feb', users: 1500, students: 1000, universityStudents: 400 },
    { month: 'Mar', users: 1800, students: 1200, universityStudents: 500 },
    { month: 'Apr', users: 2200, students: 1500, universityStudents: 600 },
    { month: 'May', users: 2800, students: 1900, universityStudents: 750 },
    { month: 'Jun', users: 3200, students: 2200, universityStudents: 850 }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 15000 },
    { month: 'Feb', revenue: 18000 },
    { month: 'Mar', revenue: 22000 },
    { month: 'Apr', revenue: 25000 },
    { month: 'May', revenue: 30000 },
    { month: 'Jun', revenue: 35000 }
  ];

  const activityData = [
    { date: 'Jan 1', registrations: 60, logins: 320 },
    { date: 'Jan 2', registrations: 70, logins: 380 },
    { date: 'Jan 3', registrations: 55, logins: 420 },
    { date: 'Jan 4', registrations: 80, logins: 360 },
    { date: 'Jan 5', registrations: 90, logins: 480 },
    { date: 'Jan 6', registrations: 85, logins: 390 },
    { date: 'Jan 7', registrations: 75, logins: 310 }
  ];

  const recentActivities = [
    {
      id: 1,
      user: 'Sarah Silva',
      action: 'registered as University Student',
      time: '2 minutes ago',
      date: '2024-01-07',
      performedBy: 'user'
    },
    {
      id: 2,
      user: 'John Mentor',
      action: 'approved as Mentor',
      time: '15 minutes ago',
      date: '2024-01-07',
      performedBy: 'admin'
    },
    {
      id: 3,
      user: 'Google Inc.',
      action: 'registered as Company Partner',
      time: '1 hour ago',
      date: '2024-01-07',
      performedBy: 'user'
    },
    {
      id: 4,
      user: 'University of Moratuwa',
      action: 'added new Engineering program',
      time: '2 hours ago',
      date: '2024-01-07',
      performedBy: 'user'
    },
    {
      id: 5,
      user: 'Alex Tutor',
      action: 'created new Mathematics course',
      time: '3 hours ago',
      date: '2024-01-07',
      performedBy: 'user'
    }
  ];

  // Helper functions
  const handleGeneratePDF = () => {
    if (!reportStartDate || !reportEndDate) {
      alert("Please select both start and end dates.");
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("UniRoute Admin Report", 14, 18);
    doc.setFontSize(12);
    doc.text(
      `From: ${new Date(reportStartDate).toLocaleDateString()} To: ${new Date(reportEndDate).toLocaleDateString()}`,
      14,
      28
    );
    doc.save(`uniroute_admin_report_${reportStartDate}_to_${reportEndDate}.pdf`);
  };

  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    console.log('Notification submitted:', notificationForm);
    setShowNotificationModal(false);
    setNotificationForm({
      title: '',
      message: '',
      type: 'info',
      targetUsers: 'all'
    });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  return (
    <AdminLayout pageTitle="Dashboard" pageDescription="Welcome back, Admin!">
      <div className="space-y-6">
        

        

        {/* Stats Cards */}
        <div className="space-y-8">
          {stats.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-sm font-medium text-[#717171] mb-4">{section.section}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {section.cards.map((card, cardIndex) => {
                  const Icon = card.icon;
                  return (
                    <Link
                      key={cardIndex}
                      to={card.link}
                      className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#717171]">{card.title}</p>
                          <p className="text-2xl font-bold text-[#263238] mt-1">{card.value}</p>
                          <p className="text-xs text-[#B0B0B0] mt-1">{card.description}</p>
                          <div className="flex items-center mt-2">
                            <span className={`text-xs font-medium ${
                              card.changeType === 'positive' ? 'text-[#81C784]' : 'text-[#E57373]'
                            }`}>
                              {card.change}
                            </span>
                            <span className="text-xs text-[#B0B0B0] ml-1">from last month</span>
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg ${card.iconBg}`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section - 3 charts in first row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Growth Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#263238]">User Growth Trend</h3>
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-[#717171]" />
                <span className="text-sm text-[#717171]">6 months</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7F3FB" />
                <XAxis dataKey="month" stroke="#717171" />
                <YAxis stroke="#717171" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#1D5D9B" strokeWidth={2} />
                <Line type="monotone" dataKey="students" stroke="#81C784" strokeWidth={2} />
                <Line type="monotone" dataKey="universityStudents" stroke="#75C2F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#263238]">Platform Revenue Trend</h3>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-[#717171]" />
                <span className="text-sm text-[#717171]">6 months</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7F3FB" />
                <XAxis dataKey="month" stroke="#717171" />
                <YAxis stroke="#717171" />
                <Tooltip />
                <Bar dataKey="revenue" fill="#1D5D9B" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* User Distribution Pie Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#263238]">User Distribution</h3>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-[#717171]" />
                <span className="text-sm text-[#717171]">Current</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Activity Overview - Full Width */}
        <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#263238]">Daily Activity Overview</h3>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-[#717171]" />
              <span className="text-sm text-[#717171]">Last 7 days</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7F3FB" />
              <XAxis dataKey="date" stroke="#717171" />
              <YAxis stroke="#717171" />
              <Tooltip />
              <Legend />
              <Bar dataKey="registrations" fill="#1D5D9B" name="New Registrations" />
              <Bar dataKey="logins" fill="#81C784" name="Daily Logins" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Row - Recent Activities and Activity Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#263238]">Recent Activities</h3>
              <Link to="/admin/activities" className="text-sm text-[#1D5D9B] hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="bg-[#E7F3FB] p-2 rounded-lg">
                    <User className="h-4 w-4 text-[#1D5D9B]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[#263238]">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <div className="flex items-center text-xs text-[#717171] mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Calendar */}
          <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#263238]">Activity Calendar</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-1 hover:bg-[#F5F7FA] rounded"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-1 hover:bg-[#F5F7FA] rounded"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-xs font-medium text-[#717171] py-2">
                  {day}
                </div>
              ))}
              {getDaysInMonth(currentDate).map((day, index) => (
                <div
                  key={index}
                  className={`text-sm py-2 cursor-pointer rounded ${
                    day === null
                      ? ''
                      : isToday(day)
                      ? 'bg-[#1D5D9B] text-white'
                      : 'hover:bg-[#F5F7FA] text-[#263238]'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6">
            <div className="text-center">
              <p className="text-sm text-[#717171] mb-1">Today's Revenue</p>
              <p className="text-2xl font-bold text-[#1D5D9B]">$4100</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6">
            <div className="text-center">
              <p className="text-sm text-[#717171] mb-1">Registrations</p>
              <p className="text-2xl font-bold text-[#1D5D9B]">55</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6">
            <div className="text-center">
              <p className="text-sm text-[#717171] mb-1">Logins</p>
              <p className="text-2xl font-bold text-[#1D5D9B]">320</p>
            </div>
          </div>
        </div>

      {/* PDF Report Generator */}
        <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-[#717171] mb-2">Start Date</label>
                <input
                  type="date"
                  value={reportStartDate}
                  onChange={e => setReportStartDate(e.target.value)}
                  className="px-3 py-2 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#717171] mb-2">End Date</label>
                <input
                  type="date"
                  value={reportEndDate}
                  onChange={e => setReportEndDate(e.target.value)}
                  className="px-3 py-2 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={handleGeneratePDF}
              className="flex items-center space-x-2 px-4 py-2 bg-[#1D5D9B] text-white rounded-lg hover:bg-[#174A7C] transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span>Generate PDF Report</span>
            </button>
          </div>
        </div>

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#263238]">Create Notification</h3>
              <button
                onClick={() => setShowNotificationModal(false)}
                className="p-2 hover:bg-[#F5F7FA] rounded transition-colors"
              >
                <X className="h-5 w-5 text-[#717171]" />
              </button>
            </div>
            
            <form onSubmit={handleNotificationSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#717171] mb-2">Title</label>
                <input
                  type="text"
                  value={notificationForm.title}
                  onChange={(e) => setNotificationForm({...notificationForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
                  placeholder="Enter notification title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#717171] mb-2">Message</label>
                <textarea
                  value={notificationForm.message}
                  onChange={(e) => setNotificationForm({...notificationForm, message: e.target.value})}
                  className="w-full px-3 py-2 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
                  rows="4"
                  placeholder="Enter notification message"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#717171] mb-2">Type</label>
                  <select
                    value={notificationForm.type}
                    onChange={(e) => setNotificationForm({...notificationForm, type: e.target.value})}
                    className="w-full px-3 py-2 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#717171] mb-2">Target Users</label>
                  <select
                    value={notificationForm.targetUsers}
                    onChange={(e) => setNotificationForm({...notificationForm, targetUsers: e.target.value})}
                    className="w-full px-3 py-2 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
                  >
                    <option value="all">All Users</option>
                    <option value="students">Students</option>
                    <option value="mentors">Mentors</option>
                    <option value="tutors">Tutors</option>
                    <option value="universities">Universities</option>
                    <option value="companies">Companies</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNotificationModal(false)}
                  className="px-4 py-2 text-[#717171] bg-[#F5F7FA] rounded-lg hover:bg-[#E7F3FB] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-4 py-2 bg-[#1D5D9B] text-white rounded-lg hover:bg-[#174A7C] transition-colors"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Notification</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;