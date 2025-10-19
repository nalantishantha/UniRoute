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
  User,
  AlertCircle
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

  // State for dashboard data
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard statistics
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/administration/dashboard/statistics/');
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setDashboardData(data.statistics);
        setError(null);
      } else {
        throw new Error(data.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError(err.message);
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Generate stats data from real dashboard data
  const getStatsData = () => {
    if (!dashboardData) return [];
    
    return [
      {
        section: 'USER MANAGEMENT',
        cards: [
          {
            title: 'Total Users',
            value: dashboardData.total_users?.toLocaleString() || '0',
            description: 'All registered users',
            change: `${dashboardData.users_growth >= 0 ? '+' : ''}${dashboardData.users_growth}%`,
            changeType: dashboardData.users_growth >= 0 ? 'positive' : 'negative',
            icon: Users,
            iconBg: 'bg-[#1D5D9B]',
            link: '/admin/users'
          },
          {
            title: 'Students',
            value: dashboardData.total_students?.toLocaleString() || '0',
            description: 'High school students',
            change: `${dashboardData.students_growth >= 0 ? '+' : ''}${dashboardData.students_growth}%`,
            changeType: dashboardData.students_growth >= 0 ? 'positive' : 'negative',
            icon: GraduationCap,
            iconBg: 'bg-[#81C784]',
            link: '/admin/students'
          },
          {
            title: 'University Students',
            value: dashboardData.total_university_students?.toLocaleString() || '0',
            description: 'Currently enrolled',
            change: `${dashboardData.university_students_growth >= 0 ? '+' : ''}${dashboardData.university_students_growth}%`,
            changeType: dashboardData.university_students_growth >= 0 ? 'positive' : 'negative',
            icon: School,
            iconBg: 'bg-[#75C2F6]',
            link: '/admin/university-students'
          },
          {
            title: 'Mentors',
            value: dashboardData.total_mentors?.toLocaleString() || '0',
            description: 'Active mentors',
            change: `${dashboardData.mentors_growth >= 0 ? '+' : ''}${dashboardData.mentors_growth}%`,
            changeType: dashboardData.mentors_growth >= 0 ? 'positive' : 'negative',
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
            value: dashboardData.total_tutors?.toLocaleString() || '0',
            description: 'Verified tutors',
            change: `${dashboardData.tutors_growth >= 0 ? '+' : ''}${dashboardData.tutors_growth}%`,
            changeType: dashboardData.tutors_growth >= 0 ? 'positive' : 'negative',
            icon: UserCog,
            iconBg: 'bg-[#4C7FB1]',
            link: '/admin/tutors'
          },
          {
            title: 'Universities',
            value: dashboardData.total_universities?.toString() || '0',
            description: 'Partner institutions',
            change: dashboardData.universities_growth >= 0 ? `+${dashboardData.universities_growth}` : dashboardData.universities_growth.toString(),
            changeType: dashboardData.universities_growth >= 0 ? 'positive' : 'negative',
            icon: School,
            iconBg: 'bg-[#75C2F6]',
            link: '/admin/universities'
          },
          {
            title: 'Companies',
            value: dashboardData.total_companies?.toString() || '0',
            description: 'Corporate partners',
            change: dashboardData.companies_growth >= 0 ? `+${dashboardData.companies_growth}` : dashboardData.companies_growth.toString(),
            changeType: dashboardData.companies_growth >= 0 ? 'positive' : 'negative',
            icon: Building2,
            iconBg: 'bg-[#F4D160]',
            link: '/admin/companies'
          },
          {
            title: 'Active Programs',
            value: dashboardData.total_programs?.toString() || '0',
            description: 'Available programs',
            change: dashboardData.programs_growth >= 0 ? `+${dashboardData.programs_growth}` : dashboardData.programs_growth.toString(),
            changeType: dashboardData.programs_growth >= 0 ? 'positive' : 'negative',
            icon: BookOpen,
            iconBg: 'bg-[#E7F3FB]',
            link: '/admin/programs'
          }
        ]
      }
    ];
  };

  const stats = getStatsData();

  // Get chart data from dashboard data
  const getChartData = () => {
    if (!dashboardData) {
      return {
        userGrowthData: [],
        revenueData: [],
        activityData: [],
        userDistributionData: [],
        recentActivities: []
      };
    }

    // Generate revenue data based on user growth (mock calculation)
    const revenueData = dashboardData.user_growth_data?.map((item, index) => ({
      month: item.month,
      revenue: Math.max(item.users * 10 + 15000 + (index * 2000), 15000)
    })) || [];

    return {
      userGrowthData: dashboardData.user_growth_data || [],
      revenueData,
      activityData: dashboardData.daily_activity || [],
      userDistributionData: dashboardData.user_distribution || [],
      recentActivities: dashboardData.recent_activities || []
    };
  };

  const chartData = getChartData();

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

  // Loading and error states
  if (loading) {
    return (
      <AdminLayout pageTitle="Dashboard" pageDescription="Welcome back, Admin!">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D5D9B]"></div>
          <span className="ml-3 text-[#717171]">Loading dashboard...</span>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout pageTitle="Dashboard" pageDescription="Welcome back, Admin!">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-400 mr-3">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={fetchDashboardData}
                className="mt-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

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
              <LineChart data={chartData.userGrowthData}>
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
              <BarChart data={chartData.revenueData}>
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
                  data={chartData.userDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.userDistributionData.map((entry, index) => (
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
            <BarChart data={chartData.activityData}>
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
              {chartData.recentActivities.slice(0, 5).map((activity) => (
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
              <p className="text-2xl font-bold text-[#1D5D9B]">${dashboardData?.today_revenue?.toLocaleString() || '0'}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6">
            <div className="text-center">
              <p className="text-sm text-[#717171] mb-1">Registrations</p>
              <p className="text-2xl font-bold text-[#1D5D9B]">{dashboardData?.today_registrations || '0'}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6">
            <div className="text-center">
              <p className="text-sm text-[#717171] mb-1">Logins</p>
              <p className="text-2xl font-bold text-[#1D5D9B]">{dashboardData?.today_logins || '0'}</p>
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