import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import {
  Users,
  GraduationCap,
  School,
  Building2,
  UserCheck,
  LifeBuoy,
  BookOpen,
  BarChart3,
  FileText,
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
  AlertCircle,
  Loader2,
  LogIn,
  UserPlus,
  Handshake,
  NotebookPen,
  Briefcase
} from 'lucide-react';
import AdminLayout from '../../components/common/Admin/AdminLayout';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const ACTIVITY_COUNT_KEYS = [
  'logins',
  'registrations',
  'mentoring_requests',
  'tutoring_bookings',
  'courses_published',
  'mentor_applications'
];

const AdminDashboard = () => {
  // State for date range reports
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate] = useState('');
  const [reportSummary, setReportSummary] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);
  const [exportingReport, setExportingReport] = useState(false);
  const [reportWarning, setReportWarning] = useState(null);
  
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

  useEffect(() => {
    setReportError(null);
    setReportWarning(null);
  }, [reportStartDate, reportEndDate]);

  // Fetch dashboard statistics
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/administration/dashboard/statistics/`, {
        headers: {
          Accept: 'application/json',
        },
      });

      const responseBody = await response.text();
      let payload = null;
      if (responseBody) {
        try {
          payload = JSON.parse(responseBody);
        } catch (parseError) {
          console.warn('Dashboard statistics response could not be parsed as JSON:', parseError, responseBody);
        }
      }

      if (!response.ok) {
        let errorMessage = `Failed to fetch dashboard data (HTTP ${response.status})`;
        if (payload?.message) {
          errorMessage = payload.message;
        }
        throw new Error(errorMessage);
      }

      if (!payload) {
        throw new Error('Dashboard data response was empty.');
      }

      const data = payload;

      if (data?.success) {
        setDashboardData(data.statistics);
        setError(null);
      } else {
        throw new Error(data?.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
      setError(message);
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

    const universitiesGrowthValue = Number(dashboardData.universities_growth ?? 0);
    const companiesGrowthValue = Number(dashboardData.companies_growth ?? 0);
    const publishedCoursesGrowthValue = Number(dashboardData.published_courses_growth ?? 0);

    const formatDelta = (value) => {
      const numeric = Number.isFinite(value) ? value : 0;
      if (numeric === 0) return '0';
      const formatted = Math.abs(numeric).toLocaleString();
      return numeric > 0 ? `+${formatted}` : `-${formatted}`;
    };

    const formatCount = (value) => new Intl.NumberFormat('en-US').format(value || 0);

    const contentSummary = dashboardData.content_management || {};
    const publishedSummary = contentSummary.published_courses || {
      total: dashboardData.total_published_courses,
      growth: publishedCoursesGrowthValue,
    };
    const mentoringSummary = contentSummary.mentoring_sessions || dashboardData.mentoring_summary || {};
    const tutoringSummary = contentSummary.tutoring_sessions || dashboardData.tutoring_summary || {};
    const internshipsSummary = contentSummary.internships || dashboardData.internships_summary || {};
    
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
          },
          {
            title: 'Counsellors',
            value: dashboardData.total_counsellors?.toLocaleString() || '0',
            description: 'Career counsellors',
            change: `${dashboardData.counsellors_growth >= 0 ? '+' : ''}${dashboardData.counsellors_growth}%`,
            changeType: dashboardData.counsellors_growth >= 0 ? 'positive' : 'negative',
            icon: LifeBuoy,
            iconBg: 'bg-[#B39DDB]',
            link: '/admin/counsellors'
          },
          {
            title: 'Partner Universities',
            value: dashboardData.total_universities?.toLocaleString() || '0',
            description: 'Institution partners',
            change: formatDelta(universitiesGrowthValue),
            changeType: universitiesGrowthValue >= 0 ? 'positive' : 'negative',
            icon: School,
            iconBg: 'bg-[#75C2F6]',
            link: '/admin/universities'
          },
          {
            title: 'Corporate Partners',
            value: dashboardData.total_companies?.toLocaleString() || '0',
            description: 'Active companies',
            change: formatDelta(companiesGrowthValue),
            changeType: companiesGrowthValue >= 0 ? 'positive' : 'negative',
            icon: Building2,
            iconBg: 'bg-[#E57373]',
            link: '/admin/companies'
          }
        ]
      },
      {
        section: 'CONTENT MANAGEMENT',
        cards: [
          {
            title: 'Published Courses',
            value: formatCount(publishedSummary.total),
            description: 'Pre-university courses live',
            change: formatDelta(publishedSummary.growth ?? publishedCoursesGrowthValue),
            changeType: (publishedSummary.growth ?? publishedCoursesGrowthValue) >= 0 ? 'positive' : 'negative',
            icon: NotebookPen,
            iconBg: 'bg-[#FFF4E5]',
            iconColor: 'text-[#C27A02]',
            link: '/admin/content/published-courses'
          },
          {
            title: 'Mentoring Sessions',
            value: formatCount(mentoringSummary.total || mentoringSummary.total_requests),
            description: 'Requests and session outcomes',
            change: `Pending: ${formatCount(mentoringSummary.pending_requests)} • Scheduled: ${formatCount(mentoringSummary.scheduled_sessions)} • Completed: ${formatCount(mentoringSummary.completed_sessions)}`,
            changeType: 'neutral',
            icon: Handshake,
            iconBg: 'bg-[#E8F5E9]',
            iconColor: 'text-[#2E7D32]',
            link: '/admin/content/mentoring-sessions'
          },
          {
            title: 'Tutoring Sessions',
            value: formatCount(tutoringSummary.total),
            description: 'Tutoring pipeline status',
            change: `Pending: ${formatCount(tutoringSummary.pending_sessions)} • Scheduled: ${formatCount(tutoringSummary.scheduled_sessions)} • Completed: ${formatCount(tutoringSummary.completed_sessions)}`,
            changeType: 'neutral',
            icon: Activity,
            iconBg: 'bg-[#E0F2F1]',
            iconColor: 'text-[#00695C]',
            link: '/admin/content/tutoring-sessions'
          },
          {
            title: 'Internship Opportunities',
            value: formatCount(internshipsSummary.total),
            description: 'Partner internship listings',
            change: `Currently open: ${formatCount(internshipsSummary.currently_open)}`,
            changeType: 'neutral',
            icon: Briefcase,
            iconBg: 'bg-[#FFF3E0]',
            iconColor: 'text-[#EF6C00]',
            link: '/admin/jobs'
          },
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
        activityTimeline: {}
      };
    }

    const revenueData = (dashboardData.monthly_transaction_data || []).map((item) => ({
      month: item.label || item.month,
      total_amount: item.total_amount || 0,
      transactions: item.transaction_count || 0,
    }));

    return {
      userGrowthData: dashboardData.user_growth_data || [],
      revenueData,
      activityData: dashboardData.daily_activity || [],
      userDistributionData: dashboardData.user_distribution || [],
      activityTimeline: dashboardData.activity_timeline || {}
    };
  };

  const chartData = getChartData();
  const activityTimeline = chartData.activityTimeline || {};

  const getDateKey = (dateObj) => {
    if (!dateObj) return null;
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const selectedDateKey = getDateKey(selectedDate);
  const selectedActivityDetails = selectedDateKey ? activityTimeline[selectedDateKey] : null;

  const activityCounts = {
    logins: selectedActivityDetails?.logins || 0,
    registrations: selectedActivityDetails?.registrations || 0,
    mentoring_requests: selectedActivityDetails?.mentoring_requests || 0,
    tutoring_bookings: selectedActivityDetails?.tutoring_bookings || 0,
    courses_published: selectedActivityDetails?.courses_published || 0,
    mentor_applications: selectedActivityDetails?.mentor_applications || 0,
  };

  const activitySummaryItems = [
    {
      key: 'logins',
      label: 'User logins',
      value: activityCounts.logins,
      icon: LogIn,
      accent: 'bg-[#E7F3FB]',
      textColor: 'text-[#1D5D9B]'
    },
    {
      key: 'registrations',
      label: 'New registrations',
      value: activityCounts.registrations,
      icon: UserPlus,
      accent: 'bg-[#E8F5E9]',
      textColor: 'text-[#2E7D32]'
    },
    {
      key: 'mentoring_requests',
      label: 'Mentoring session requests',
      value: activityCounts.mentoring_requests,
      icon: Handshake,
      accent: 'bg-[#FFF4E5]',
      textColor: 'text-[#C27A02]'
    },
    {
      key: 'tutoring_bookings',
      label: 'Tutoring sessions booked',
      value: activityCounts.tutoring_bookings,
      icon: NotebookPen,
      accent: 'bg-[#F3E5F5]',
      textColor: 'text-[#7B1FA2]'
    },
    {
      key: 'courses_published',
      label: 'Pre-university courses published',
      value: activityCounts.courses_published,
      icon: BookOpen,
      accent: 'bg-[#E3F2FD]',
      textColor: 'text-[#0D47A1]'
    },
    {
      key: 'mentor_applications',
      label: 'Mentor applications submitted',
      value: activityCounts.mentor_applications,
      icon: GraduationCap,
      accent: 'bg-[#FFF3E0]',
      textColor: 'text-[#EF6C00]'
    }
  ];

  const derivedActivitySum = ACTIVITY_COUNT_KEYS.reduce(
    (sum, key) => sum + (selectedActivityDetails?.[key] || 0),
    0
  );

  const recordedTotalEvents = selectedActivityDetails?.total_events ?? 0;

  const totalActivityEvents = selectedActivityDetails
    ? recordedTotalEvents > 0
      ? recordedTotalEvents
      : derivedActivitySum
    : 0;

  const formatSelectedDateLabel = () => {
    if (!selectedDate) return '';
    return selectedDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDaySelect = (day) => {
    if (day === null) return;
    const newSelected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newSelected);
  };

  const isSelectedDay = (day) => {
    if (day === null || !selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const hasActivityForDay = (day) => {
    if (day === null) return false;
    const dateKey = getDateKey(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    const details = activityTimeline[dateKey];
    if (!details) return false;
    const eventCount = Array.isArray(details.events) ? details.events.length : 0;
    if (eventCount > 0) return true;
    const countsTotal = ACTIVITY_COUNT_KEYS.reduce((sum, key) => sum + (details[key] || 0), 0);
    if (countsTotal > 0) return true;
    return !!details.total_events;
  };

  const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value || 0);
  const formatCurrency = (value) => new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
  }).format(value || 0);
  const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '');
  const formatDateTime = (value) => (value ? new Date(value).toLocaleString() : '');

  const renderRevenueTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="rounded-md border border-[#E7F3FB] bg-white px-3 py-2 shadow-sm">
          <p className="text-xs font-semibold text-[#123460]">{label}</p>
          <p className="text-xs text-[#1D5D9B] mt-1">{formatCurrency(dataPoint.total_amount)}</p>
          <p className="text-xs text-[#7F8B99]">{formatNumber(dataPoint.transactions)} transactions</p>
        </div>
      );
    }
    return null;
  };

  const buildReportQuery = () => {
    const params = new URLSearchParams({
      start_date: reportStartDate,
      end_date: reportEndDate,
    });
    return params.toString();
  };

  const handlePreviewReport = async () => {
    if (!reportStartDate || !reportEndDate) {
      setReportError('Please choose both a start date and an end date.');
      return;
    }

    setReportLoading(true);
    setReportError(null);
    setReportSummary(null);
    setReportWarning(null);

    try {
  const response = await fetch(`${API_BASE_URL}/api/admin-reports/overview/?${buildReportQuery()}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to load report summary for the selected range.');
      }

      setReportSummary(data.data);
    } catch (err) {
      console.error('Report summary error:', err);
      setReportError(err.message);
    } finally {
      setReportLoading(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!reportStartDate || !reportEndDate) {
      setReportError('Please choose both a start date and an end date before exporting.');
      return;
    }

    setExportingReport(true);
    setReportError(null);
    setReportWarning(null);

    try {
  const response = await fetch(`${API_BASE_URL}/api/admin-reports/export/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start_date: reportStartDate,
          end_date: reportEndDate,
          requested_by: null,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to generate PDF report.');
      }

      if (data.report?.download_url) {
        window.open(data.report.download_url, '_blank', 'noopener');
      }

      if (data.report?.data_snapshot) {
        setReportSummary(data.report.data_snapshot);
      } else if (!reportSummary) {
        await handlePreviewReport();
      }

      if (data.report?.persisted === false) {
        setReportWarning('Report generated, but it could not be saved for history. Please apply the latest database migrations to enable archives.');
      }
    } catch (error) {
      console.error('Report export error:', error);
      setReportError(error.message);
    } finally {
      setExportingReport(false);
    }
  };

  const handleNotificationSubmit = (event) => {
    event.preventDefault();
    // Future enhancement: send notification payload to dedicated endpoint
    setShowNotificationModal(false);
    setNotificationForm({
      title: '',
      message: '',
      type: 'info',
      targetUsers: 'all',
    });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
    setSelectedDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
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
        {/* Report Generator Hero */}
        <section className="relative overflow-hidden rounded-2xl border border-[#C1DBF4] bg-gradient-to-br from-[#E8F2FF] via-white to-[#FDFBFF] shadow-lg">
          <div className="absolute -top-28 -right-24 h-72 w-72 rounded-full bg-[#1D5D9B] opacity-10 blur-3xl" />
          <div className="absolute -bottom-32 -left-16 h-64 w-64 rounded-full bg-[#81C784] opacity-10 blur-3xl" />
          <div className="relative z-10 p-6 lg:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#1D5D9B] border border-white/60 shadow-sm backdrop-blur">
                  <FileText className="h-3.5 w-3.5" />
                  Admin Report Center
                </span>
                <h2 className="text-2xl font-semibold text-[#123460]">Generate insights for your chosen date range</h2>
                <p className="text-sm text-[#4F5B67]">
                  Preview platform-wide KPIs and export a polished PDF for your leadership team.
                </p>
                {reportSummary?.metadata?.start && reportSummary?.metadata?.end && (
                  <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-[#1D5D9B]">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 border border-white/60 shadow-sm">
                      <Calendar className="h-4 w-4" />
                      {formatDate(reportSummary.metadata.start)} – {formatDate(reportSummary.metadata.end)}
                    </span>
                    {reportSummary.metadata.generated_at && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 border border-white/60 shadow-sm">
                        <Clock className="h-4 w-4" />
                        Generated {formatDateTime(reportSummary.metadata.generated_at)}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 bg-white/80 border border-white/60 rounded-xl p-4 shadow-sm backdrop-blur">
                <div className="flex-1 min-w-[160px]">
                  <label className="block text-xs font-semibold text-[#61748F] mb-2">Start Date</label>
                  <input
                    type="date"
                    value={reportStartDate}
                    onChange={(e) => setReportStartDate(e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent bg-white"
                  />
                </div>
                <div className="flex-1 min-w-[160px]">
                  <label className="block text-xs font-semibold text-[#61748F] mb-2">End Date</label>
                  <input
                    type="date"
                    value={reportEndDate}
                    min={reportStartDate || undefined}
                    onChange={(e) => setReportEndDate(e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent bg-white"
                  />
                </div>
                <div className="flex flex-col sm:justify-between gap-3 min-w-[160px]">
                  <button
                    onClick={handlePreviewReport}
                    disabled={reportLoading}
                    className="flex items-center justify-center space-x-2 px-4 py-2.5 border border-[#1D5D9B] text-[#1D5D9B] rounded-lg hover:bg-[#E7F3FB] transition-colors disabled:opacity-60"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>{reportLoading ? 'Loading…' : 'View Summary'}</span>
                  </button>
                  <button
                    onClick={handleGeneratePDF}
                    disabled={exportingReport}
                    className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#1D5D9B] text-white rounded-lg hover:bg-[#174A7C] transition-colors disabled:opacity-60 shadow"
                  >
                    {exportingReport ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                    <span>{exportingReport ? 'Generating…' : 'Generate PDF'}</span>
                  </button>
                </div>
              </div>
            </div>

            {reportError && (
              <div className="flex items-start space-x-2 rounded-lg border border-red-200 bg-red-50/90 px-3 py-2 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4" />
                <span>{reportError}</span>
              </div>
            )}

            {reportWarning && (
              <div className="flex items-start space-x-2 rounded-lg border border-amber-200 bg-amber-50/90 px-3 py-2 text-sm text-amber-700">
                <AlertCircle className="mt-0.5 h-4 w-4" />
                <span>{reportWarning}</span>
              </div>
            )}

            {reportLoading && (
              <div className="flex items-center space-x-3 text-[#61748F]">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Crunching the numbers…</span>
              </div>
            )}

            {!reportSummary && !reportLoading && (
              <p className="text-sm text-[#4F5B67]">
                Choose a date range and click <strong>View Summary</strong> to preview key performance indicators before exporting.
              </p>
            )}

            {reportSummary && !reportLoading && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-white/60 bg-white/85 p-5 shadow-sm">
                    <p className="text-xs font-semibold text-[#61748F] mb-1">New Users</p>
                    <p className="text-2xl font-semibold text-[#123460]">{formatNumber(reportSummary.user_management?.total_new_users)}</p>
                    <p className="text-xs text-[#7F8B99]">During this period</p>
                  </div>
                  <div className="rounded-xl border border-white/60 bg-white/85 p-5 shadow-sm">
                    <p className="text-xs font-semibold text-[#61748F] mb-1">Courses Created</p>
                    <p className="text-2xl font-semibold text-[#123460]">{formatNumber(reportSummary.content?.courses_created)}</p>
                    <p className="text-xs text-[#7F8B99]">Drafts and published</p>
                  </div>
                  <div className="rounded-xl border border-white/60 bg-white/85 p-5 shadow-sm">
                    <p className="text-xs font-semibold text-[#61748F] mb-1">Tutoring Revenue</p>
                    <p className="text-2xl font-semibold text-[#123460]">{formatCurrency(reportSummary.tutoring_earnings?.total_revenue)}</p>
                    <p className="text-xs text-[#7F8B99]">Recorded payments</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="rounded-xl border border-white/60 bg-white/85 p-5 shadow-sm">
                    <h4 className="text-sm font-semibold text-[#123460] mb-3">User Breakdown</h4>
                    <ul className="space-y-2">
                      {(reportSummary.user_management?.breakdown || []).map((item) => {
                        const label = item.user_type__type_name
                          ? item.user_type__type_name.replace(/_/g, ' ')
                          : 'Unknown';
                        return (
                          <li key={item.user_type__type_name || label} className="flex items-center justify-between text-sm text-[#263238]">
                            <span>{label}</span>
                            <span className="font-medium text-[#1D5D9B]">{formatNumber(item.count)}</span>
                          </li>
                        );
                      })}
                      {!reportSummary.user_management?.breakdown?.length && (
                        <li className="text-sm text-[#7F8B99]">No registrations recorded.</li>
                      )}
                      <li className="flex items-center justify-between text-sm pt-2 border-t border-[#E7F3FB]">
                        <span className="text-[#263238]">Active Users (all time)</span>
                        <span className="font-medium text-[#1D5D9B]">{formatNumber(reportSummary.user_management?.active_users_total)}</span>
                      </li>
                      <li className="flex items-center justify-between text-sm">
                        <span className="text-[#263238]">Inactive Users (all time)</span>
                        <span className="font-medium text-[#1D5D9B]">{formatNumber(reportSummary.user_management?.inactive_users_total)}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-xl border border-white/60 bg-white/85 p-5 shadow-sm">
                    <h4 className="text-sm font-semibold text-[#123460] mb-3">Top Enrolled Courses</h4>
                    <ul className="space-y-2">
                      {(reportSummary.content?.popular_courses || []).map((course) => {
                        const title = course.course__title || 'Untitled Course';
                        return (
                          <li key={title} className="flex items-center justify-between text-sm text-[#263238]">
                            <span>{title}</span>
                            <span className="font-medium text-[#1D5D9B]">{formatNumber(course.enrollments)}</span>
                          </li>
                        );
                      })}
                      {!reportSummary.content?.popular_courses?.length && (
                        <li className="text-sm text-[#7F8B99]">No course enrollments recorded.</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="rounded-xl border border-white/60 bg-white/85 p-5 shadow-sm">
                  <h4 className="text-sm font-semibold text-[#123460] mb-3">Tutoring Earnings</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-[#7F8B99]">Payments</p>
                      <p className="text-lg font-semibold text-[#123460]">{formatNumber(reportSummary.tutoring_earnings?.payment_count)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#7F8B99]">Average Ticket Size</p>
                      <p className="text-lg font-semibold text-[#123460]">{formatCurrency(reportSummary.tutoring_earnings?.average_payment)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#7F8B99]">Top Tutors</p>
                      <p className="text-sm text-[#263238]">
                        {reportSummary.tutoring_earnings?.top_tutors?.length
                          ? reportSummary.tutoring_earnings.top_tutors
                              .map((tutor) => tutor.tutor_username || `Tutor #${tutor.tutor_id}`)
                              .join(', ')
                          : 'No tutoring earnings available'}
                      </p>
                    </div>
                  </div>
                </div>

                {reportSummary.metadata?.start && reportSummary.metadata?.end ? (
                  <p className="text-xs text-[#7F8B99]">
                    Reporting period: {formatDate(reportSummary.metadata.start)} – {formatDate(reportSummary.metadata.end)}
                  </p>
                ) : (
                  <p className="text-xs text-[#7F8B99]">Reporting data unavailable for the selected range.</p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Daily Snapshot */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative overflow-hidden rounded-2xl border border-[#E7F3FB] bg-white shadow-sm p-6">
            <div className="absolute -top-6 -right-6 h-16 w-16 rounded-full bg-[#1D5D9B] opacity-10" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#61748F] uppercase tracking-wide">Today's Transactions</p>
                <p className="mt-2 text-2xl font-semibold text-[#123460]">{formatNumber(dashboardData?.today_transactions || 0)}</p>
              </div>
              <div className="p-3 rounded-full bg-[#1D5D9B]/10 text-[#1D5D9B]">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-xs text-[#7F8B99]">
              Total value {formatCurrency(dashboardData?.today_transaction_total || 0)} recorded today.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[#E7F3FB] bg-white shadow-sm p-6">
            <div className="absolute -top-6 -right-6 h-16 w-16 rounded-full bg-[#81C784] opacity-10" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#61748F] uppercase tracking-wide">New Registrations</p>
                <p className="mt-2 text-2xl font-semibold text-[#123460]">{formatNumber(dashboardData?.today_registrations || 0)}</p>
              </div>
              <div className="p-3 rounded-full bg-[#81C784]/15 text-[#388E3C]">
                <User className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-xs text-[#7F8B99]">Unique user accounts created in the last 24 hours.</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[#E7F3FB] bg-white shadow-sm p-6">
            <div className="absolute -top-6 -right-6 h-16 w-16 rounded-full bg-[#F4D160] opacity-20" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#61748F] uppercase tracking-wide">Platform Logins</p>
                <p className="mt-2 text-2xl font-semibold text-[#123460]">{formatNumber(dashboardData?.today_logins || 0)}</p>
              </div>
              <div className="p-3 rounded-full bg-[#F4D160]/20 text-[#C27A02]">
                <Activity className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-xs text-[#7F8B99]">Active sessions recorded so far today.</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="space-y-8">
          {stats.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-sm font-medium text-[#717171] mb-4">{section.section}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {section.cards.map((card, cardIndex) => {
                  const Icon = card.icon;
                  const iconColor = card.iconColor || 'text-white';
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
                              card.changeType === 'positive'
                                ? 'text-[#81C784]'
                                : card.changeType === 'negative'
                                ? 'text-[#E57373]'
                                : 'text-[#7F8B99]'
                            }`}>
                              {card.change}
                            </span>
                            <span className="text-xs text-[#B0B0B0] ml-1">from last month</span>
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg ${card.iconBg}`}>
                          <Icon className={`h-6 w-6 ${iconColor}`} />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section - Two rows */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <Line type="monotone" dataKey="users" stroke="#1D5D9B" activeDot={{ r: 8 }} name="Total Users" />
                  <Line type="monotone" dataKey="students" stroke="#81C784" name="Students" />
                  <Line type="monotone" dataKey="mentors" stroke="#F4D160" name="Mentors" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* User Distribution */}
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

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Transactions Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#263238]">Monthly Transactions</h3>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-[#717171]" />
                  <span className="text-sm text-[#717171]">Tutoring Only</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7F3FB" />
                  <XAxis dataKey="month" stroke="#717171" />
                  <YAxis stroke="#717171" />
                  <Tooltip content={renderRevenueTooltip} />
                  <Bar dataKey="total_amount" fill="#1D5D9B" name="Revenue (LKR)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Daily Activity Overview */}
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
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Activity Calendar */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#263238]">Activity Calendar</h3>
                <div className="flex items-center space-x-2">
                  <button onClick={() => navigateMonth(-1)} className="p-1 hover:bg-[#F5F7FA] rounded">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-medium">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <button onClick={() => navigateMonth(1)} className="p-1 hover:bg-[#F5F7FA] rounded">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="py-2 text-xs font-medium text-[#717171]">
                    {day}
                  </div>
                ))}
                {getDaysInMonth(currentDate).map((day, index) => (
                  <div
                    key={index}
                    onClick={day === null ? undefined : () => handleDaySelect(day)}
                    className={`relative flex flex-col items-center justify-center rounded-lg py-2 transition-colors ${
                      day === null ? 'cursor-default' : 'cursor-pointer'
                    } ${
                      day === null
                        ? ''
                        : isSelectedDay(day)
                        ? 'bg-[#1D5D9B] text-white shadow-sm'
                        : isToday(day)
                        ? 'border border-[#1D5D9B] text-[#123460]'
                        : hasActivityForDay(day)
                        ? 'bg-[#E7F3FB] text-[#123460]'
                        : 'text-[#263238] hover:bg-[#F5F7FA]'
                    }`}
                  >
                    <span className={`text-sm font-medium ${day === null ? 'opacity-0' : ''}`}>{day}</span>
                    {day !== null && hasActivityForDay(day) && (
                      <span
                        className={`mt-1 h-1.5 w-1.5 rounded-full ${
                          isSelectedDay(day) ? 'bg-white' : 'bg-[#1D5D9B]'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* Activity Details */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#263238]">Recent Activities</h3>
                  <p className="text-xs text-[#7F8B99]">{selectedActivityDetails ? formatSelectedDateLabel() : 'Select a day to see details'}</p>
                </div>
                {totalActivityEvents > 0 && (
                  <span className="inline-flex items-center rounded-full bg-[#E7F3FB] px-3 py-1 text-xs font-medium text-[#1D5D9B]">
                    {totalActivityEvents} events
                  </span>
                )}
              </div>

              {!selectedActivityDetails && (
                <div className="rounded-lg border border-dashed border-[#E7F3FB] bg-[#F9FCFF] p-6 text-center text-sm text-[#7F8B99]">
                  Choose a highlighted date to review platform activity captured over the last 60 days.
                </div>
              )}

              {selectedActivityDetails && totalActivityEvents === 0 && (
                <div className="rounded-lg border border-dashed border-[#E7F3FB] bg-[#F9FCFF] p-6 text-center text-sm text-[#7F8B99]">
                  No activity recorded for this day.
                </div>
              )}

              {selectedActivityDetails && totalActivityEvents > 0 && (
                <div className="space-y-4">
                  <div className="rounded-lg bg-[#F5F9FD] p-4">
                    <p className="text-xs uppercase tracking-wide text-[#61748F]">Highlights</p>
                    <ul className="mt-2 space-y-1 text-sm text-[#263238]">
                      {(selectedActivityDetails.highlights || []).map((highlight) => (
                        <li key={highlight.type} className="flex items-center justify-between">
                          <span>{highlight.label}</span>
                          <span className="font-semibold text-[#1D5D9B]">{formatNumber(highlight.count)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activitySummaryItems.map((item) => {
                      const Icon = item.icon;
                      const hasValue = item.value > 0;
                      return (
                        <div
                          key={item.key}
                          className={`flex items-center space-x-3 rounded-lg border border-[#E7F3FB] p-3 ${
                            hasValue ? 'bg-white' : 'bg-[#F9FCFF]'
                          }`}
                        >
                          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.accent}`}>
                            <Icon className={`h-5 w-5 ${item.textColor}`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-[#7F8B99]">{item.label}</p>
                            <p className={`text-lg font-semibold ${hasValue ? 'text-[#123460]' : 'text-[#B0B0B0]'}`}>
                              {formatNumber(item.value)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
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